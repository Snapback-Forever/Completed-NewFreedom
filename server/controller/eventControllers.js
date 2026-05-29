import db from "../db/index.js";
import { deleteGridFsFileById } from "../gridfsHelper.js";

const eventController = {

  // ✅ Inside of attendees you need to have bringingAlongEmails and userComing should be the same id as createdBy. Cant have two events with the same name, you can not add emails that are in the notAllowedToRegister because they are blocked
  addEvent: async (req, res) => {
    const {
      title,
      description,
      startDate,
      endDate,
      maxCapacity,
      createdBy,
      status,
      locationName,
    } = req.body;
    try {
      if (!title || !startDate || !maxCapacity || !createdBy) {
        return res.status(400).json({
          message: "title, startDate, maxCapacity, and createdBy are required.",
        });
      }
      const titleChecked = title.toLowerCase().trim().replace(/\s+/g, "");
      const duplicate = await db.Event.findOne({ titleChecked }).lean();
      if (duplicate) {
        return res.status(400).json({
          message: "An event with this title already exists.",
        });
      }
      const newEvent = new db.Event({
        title,
        titleChecked,
        description,
        startDate,
        endDate,
        maxCapacity,
        capacityRemaining: maxCapacity,
        createdBy,
        status,
        locationName,
      });
      const savedEvent = await newEvent.save();
      await db.User.updateOne(
        { _id: createdBy },
        { $addToSet: { upcomingEvent: savedEvent._id } }
      );
      return res.status(201).json({
        ...savedEvent.toObject(),
        message: "Event created successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err instanceof Error && !err.code) {
        return res.status(400).json({ message: err.message });
      }
      if (err.code === 11000 && err.keyPattern?.titleChecked) {
        return res.status(400).json({
          message: "An event with this title already exists.",
        });
      }
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error creating event." });
    }
  },

  updateEvent: async (req, res) => {

    const { id } = req.params;
  
    try {
  
      const event = await db.Event.findById(id);
  
      if (!event) {
        return res.status(404).json({
          message: "Event not found.",
        });
      }
  
      const allowedUpdates = [
        "title",
        "description",
        "startDate",
        "endDate",
        "maxCapacity",
        "capacityRemaining",
        "location",
        "locationName",
        "status",
        "upcomingEvent"
      ];
  
      allowedUpdates.forEach((field) => {
  
        if (req.body[field] !== undefined) {
          event[field] = req.body[field];
        }
  
      });
  
      // Prevent negative capacity
      if (event.capacityRemaining < 0) {
        return res.status(400).json({
          message: "capacityRemaining cannot be below 0.",
        });
      }
  
      // Prevent remaining capacity exceeding max
      if (event.capacityRemaining > event.maxCapacity) {
        return res.status(400).json({
          message: "capacityRemaining cannot exceed maxCapacity.",
        });
      }
  
      const updatedEvent = await event.save();
  
      return res.json({
        ...updatedEvent.toObject(),
        message: "Event updated successfully!",
      });
  
    } catch (err) {
  
      console.error(err);
  
      if (err.name === "ValidationError") {
        return res.status(400).json({
          message: err.message,
        });
      }
  
      return res.status(500).json({
        message: "Error updating event.",
      });
    }
  },

  addAdditionalEventImages: async (req, res) => {
    const { id } = req.params;
    const { additionalImages } = req.body;
  
    if (additionalImages === undefined) {
      return res.status(400).json({
        message: "additionalImages is required.",
      });
    }
  
    try {
      const event = await db.Event.findById(id);
  
      if (!event) {
        return res.status(404).json({
          message: "Event not found.",
        });
      }
  
      // Normalize input to array of images
      let newImages = [];
  
      if (typeof additionalImages === "string") {
        // Accept comma-separated URLs
        newImages = additionalImages
          .split(",")
          .map((link) => ({
            link: link.trim(),
            imageFileId: null,
            imageBucketName: null,
            description: "",
          }))
          .filter((img) => img.link);
  
      } else if (Array.isArray(additionalImages)) {
  
        newImages = additionalImages
          .map((img) => {
  
            if (img && typeof img === "object") {
              return {
                link: (img.link || "").trim(),
                description: (img.description || "").trim(),
                imageFileId: img.imageFileId || null,
                imageBucketName: img.imageBucketName || null,
              };
            }
  
            // String value
            if (typeof img === "string") {
              return {
                link: img.trim(),
                description: "",
                imageFileId: null,
                imageBucketName: null,
              };
            }
  
            return null;
          })
  
          // Allow either link or imageFileId
          .filter((img) => img && (img.link || img.imageFileId));
  
      } else {
  
        return res.status(400).json({
          message: "additionalImages must be a string or an array.",
        });
      }
  
      // Remove duplicates in incoming images
      const seenNew = new Set();
  
      newImages = newImages.filter((img) => {
        const key = img.imageFileId
          ? String(img.imageFileId)
          : img.link;
  
        if (seenNew.has(key)) {
          return false;
        }
  
        seenNew.add(key);
        return true;
      });
  
      // Existing images
      const existingImages = Array.isArray(event.additionalImages)
        ? event.additionalImages.map((img) => ({
            link: (img.link || "").trim(),
            description: (img.description || "").trim(),
            imageFileId: img.imageFileId || null,
            imageBucketName: img.imageBucketName || null,
          }))
        : [];
  
      // Merge existing + new
      const imageMap = new Map();
  
      for (const img of existingImages) {
        const key = img.imageFileId
          ? String(img.imageFileId)
          : img.link;
  
        if (!key) continue;
  
        imageMap.set(key, img);
      }
  
      // New data overwrites old data
      for (const img of newImages) {
        const key = img.imageFileId
          ? String(img.imageFileId)
          : img.link;
  
        if (!key) continue;
  
        const existing = imageMap.get(key);
  
        imageMap.set(key, {
          ...existing,
          ...img,
        });
      }
  
      // Save merged images
      event.additionalImages = Array.from(imageMap.values());
  
      const updatedEvent = await event.save();
  
      return res.json({
        ...updatedEvent.toObject(),
        message: "Additional event images added successfully!",
      });
  
    } catch (err) {
  
      console.error(err);
  
      if (err.name === "ValidationError") {
        return res.status(400).json({
          message: err.message,
        });
      }
  
      return res.status(500).json({
        message: "Error adding additional event images.",
      });
    }
  },
  
  deleteAdditionalEventImage: async (req, res) => {
  
    const { id } = req.params;
    const { imageFileId, link } = req.body;
  
    if (!imageFileId && !link) {
      return res.status(400).json({
        message: "imageFileId or link is required.",
      });
    }
  
    try {
  
      // Delete from GridFS if needed
      if (imageFileId) {
        await deleteGridFsFileById("images", imageFileId);
      }
  
      const condition = imageFileId
        ? { imageFileId }
        : { link: link.trim() };
  
      const updatedEvent = await db.Event.findByIdAndUpdate(
        id,
        {
          $pull: {
            additionalImages: condition,
          },
        },
        { new: true }
      );
  
      if (!updatedEvent) {
        return res.status(404).json({
          message: "Event not found.",
        });
      }
  
      return res.json({
        ...updatedEvent.toObject(),
        message: "Additional event image deleted successfully!",
      });
  
    } catch (err) {
  
      console.error(err);
  
      return res.status(500).json({
        message: "Error deleting additional event image.",
      });
    }
  },

  // ✅
  updateEventStatus: async (req, res) => {
    const { eventId } = req.params;        // or from req.body if you prefer
    const { status } = req.body;           // "draft" | "published" | "cancelled"
    if (!eventId || !status) {
      return res.status(400).json({
        message: "eventId and status are required.",
      });
    }
    const allowedStatuses = ["draft", "published", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value.",
      });
    }
    try {
      const event = await db.Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found." });
      }
      event.status = status;
      await event.save();
      return res.status(200).json({
        message: "Event status updated successfully.",
        event: event.toObject(),
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error updating event status.",
        error: err.message,
      });
    }
  },

  // ✅
  addEventToLocation: async (req, res) => {
    const { locationId, eventId } = req.body;
    if (!locationId || !eventId) {
      return res
        .status(400)
        .json({ message: "locationId and eventId are required." });
    }
    try {
      // Update Location → Event
      const locResult = await db.Location.updateOne(
        { _id: locationId },
        { $addToSet: { upcomingEvent: eventId } }
      );
      if (locResult.matchedCount === 0) {
        return res.status(404).json({ message: "Location not found." });
      }
      // Update Event → Location
      const evtResult = await db.Event.updateOne(
        { _id: eventId },
        { $addToSet: { upcomingEvent: locationId } }
      );
      if (evtResult.matchedCount === 0) {
        return res.status(404).json({ message: "Event not found." });
      }
      return res.status(200).json({
        message: "Event and location linked successfully.",
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Error linking event and location." });
    }
  },

  // ✅
  removeEventFromLocation: async (req, res) => {
    const { locationId, eventId } = req.body;

    if (!locationId || !eventId) {
      return res.status(400).json({
        message: "locationId and eventId are required."
      });
    }

    try {

      // Remove event from Location
      const locResult = await db.Location.updateOne(
        { _id: locationId },
        { $pull: { upcomingEvent: eventId } }
      );

      if (locResult.matchedCount === 0) {
        return res.status(404).json({ message: "Location not found." });
      }

      // Remove location from Event
      const evtResult = await db.Event.updateOne(
        { _id: eventId },
        { $pull: { upcomingEvent: locationId } }
      );

      if (evtResult.matchedCount === 0) {
        return res.status(404).json({ message: "Event not found." });
      }

      return res.status(200).json({
        message: "Event removed from location successfully."
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error removing event from location."
      });
    }
  },

  addOrUpdateAttendee:async(req,res)=>{
    try{
    const{eventId}=req.params
    const{menteeComingId,userComingId,bringingAlongEmails=[],statusOnAttendence,email,firstName,lastName}=req.body
    const allowed=["requested","approved","denied"];const newStatus=statusOnAttendence||"requested"
    if(!allowed.includes(newStatus))return res.status(400).json({message:"Invalid status value"})
    if(!menteeComingId&&!userComingId&&!email)return res.status(400).json({message:"Provide menteeComingId, userComingId, or email"})
    if(menteeComingId&&userComingId)return res.status(400).json({message:"Provide only one of menteeComingId or userComingId"})
    const norm=e=>e.trim().toLowerCase()
    const guestsRequested=[...new Set(bringingAlongEmails.flatMap(e=>e.split(",")).map(norm).filter(Boolean))]
    const event=await db.Event.findById(eventId)
    if(!event)return res.status(404).json({message:"Event not found"})
    if(event.status==="cancelled")return res.status(400).json({message:"Event cancelled"})
    if(event.capacityRemaining==null)event.capacityRemaining=event.maxCapacity??0
    const eventBlocked=new Set((event.notAllowedToRegister||[]).map(norm))
    const allowedDoc=await db.Allowed.findOne({})
    const globalBlocked=new Set((allowedDoc?.notAllowedToRegister||[]).map(norm))
    let attendeeData={},primaryEmail
    if(userComingId){const u=await db.User.findById(userComingId);if(!u)return res.status(404).json({message:"User not found"});primaryEmail=norm(u.email);attendeeData={userComing:u._id,firstName:u.firstName,lastName:u.lastName,email:primaryEmail}}
    else if(menteeComingId){const m=await db.Mail.findById(menteeComingId);if(!m)return res.status(404).json({message:"Mail not found"});primaryEmail=norm(m.email);attendeeData={menteeComing:m._id,firstName:m.firstName,lastName:m.lastName,email:primaryEmail}}
    else{primaryEmail=norm(email);attendeeData={firstName,lastName,email:primaryEmail}}
    if(eventBlocked.has(primaryEmail)||globalBlocked.has(primaryEmail))return res.status(400).json({message:"Primary email not allowed",email:primaryEmail})
    if(guestsRequested.includes(primaryEmail))return res.status(400).json({message:"Primary email cannot be guest"})
    const attendeeMap=new Map(),guestOwner=new Map()
    event.attendees.forEach(a=>{if(!a.email)return;const ae=norm(a.email);attendeeMap.set(ae,a);(a.bringingAlongEmails||[]).forEach(g=>guestOwner.set(norm(g),ae))})
    event.attendees.forEach(a=>{if(!a.bringingAlongEmails)return;a.bringingAlongEmails=a.bringingAlongEmails.filter(g=>norm(g)!==primaryEmail);a.bringingAlong=a.bringingAlongEmails.length})
    let attendee=attendeeMap.get(primaryEmail)
    const existingGuests=new Set((attendee?.bringingAlongEmails||[]).map(norm))
    const accepted=[],rejected=[]
    for(const g of guestsRequested){if(existingGuests.has(g))continue
    if(eventBlocked.has(g)||globalBlocked.has(g)){rejected.push({email:g,reason:"Not allowed"});continue}
    if(attendeeMap.has(g)){rejected.push({email:g,reason:"Already an attendee"});continue}
    if(guestOwner.has(g)){rejected.push({email:g,reason:"Already guest with "+guestOwner.get(g)});continue}
    accepted.push(g)}
    const finalGuests=[...existingGuests,...accepted]
    const seats=finalGuests.length===0?1:finalGuests.length+1
    if(!attendee){if(newStatus==="approved"){if(event.capacityRemaining-seats<0)return res.status(400).json({message:"Not enough capacity remaining"});event.capacityRemaining-=seats}
    event.attendees.push({...attendeeData,bringingAlongEmails:finalGuests,bringingAlong:seats,statusOnAttendence:newStatus})
    await event.save()
    return res.status(200).json({message:primaryEmail+" added",acceptedGuests:accepted,rejectedGuests:rejected,event})}
    const oldStatus=attendee.statusOnAttendence||"requested"
    const oldSeats=typeof attendee.bringingAlong==="number"?attendee.bringingAlong:(attendee.bringingAlongEmails?.length||0)+1
    const guestsChanged=JSON.stringify(attendee.bringingAlongEmails||[])!==JSON.stringify(finalGuests)
    if(oldStatus==="approved"&&newStatus==="approved"&&!guestsChanged)return res.status(400).json({message:"Already approved"})
    if(oldStatus==="denied"&&newStatus==="approved")return res.status(400).json({message:"Denied attendee cannot be approved"})
    if(guestsChanged&&oldStatus==="approved"){event.capacityRemaining+=oldSeats;attendee.statusOnAttendence="requested"}
    if(oldStatus!=="approved"&&newStatus==="approved"){if(event.capacityRemaining-seats<0)return res.status(400).json({message:"Not enough capacity remaining"});event.capacityRemaining-=seats}
    if(oldStatus==="approved"&&newStatus!=="approved")event.capacityRemaining+=oldSeats
    if(newStatus==="denied"){event.attendees=event.attendees.filter(a=>norm(a.email)!==primaryEmail);await event.save();return res.status(200).json({message:"Attendee denied and removed",event})}
    attendee.bringingAlongEmails=finalGuests
    attendee.bringingAlong=seats
    attendee.statusOnAttendence=newStatus
    await event.save()
    return res.status(200).json({message:"Attendee updated",acceptedGuests:accepted,rejectedGuests:rejected,event})
    }catch(err){console.error(err);return res.status(500).json({message:"Server error"})}
  },
    
  // ✅
  updateAttendeeStatus:async(req,res)=>{try{
    const{eventId}=req.params
    const{statusOnAttendence,email}=req.body
    const allowedStatuses=["requested","approved","denied"]
    if(!allowedStatuses.includes(statusOnAttendence))return res.status(400).json({message:"Invalid status value."})
    if(!email)return res.status(400).json({message:"Email is required."})
    const norm=e=>e.trim().toLowerCase()
    const normalizedEmail=norm(email)
    const event=await db.Event.findById(eventId)
    if(!event)return res.status(404).json({message:"Event not found."})
    if(event.capacityRemaining==null)event.capacityRemaining=event.maxCapacity??0
    const attendee=event.attendees.find(a=>a.email&&norm(a.email)===normalizedEmail)
    if(!attendee)return res.status(404).json({message:"Attendee not found."})
    const oldStatus=attendee.statusOnAttendence||"requested"
    const newStatus=statusOnAttendence
    if(oldStatus==="approved"&&newStatus==="approved")return res.status(400).json({message:"This attendee has already been approved."})
    if(oldStatus==="denied"&&newStatus==="approved")return res.status(400).json({message:"This attendee was denied and cannot be approved."})
    const emailCount=Array.isArray(attendee.bringingAlongEmails)?attendee.bringingAlongEmails.length:0
    const seats=emailCount===0?1:emailCount+1
    attendee.bringingAlong=seats
    if(oldStatus!=="approved"&&newStatus==="approved"){const remaining=event.capacityRemaining;if(remaining-seats<0)return res.status(400).json({message:"Not enough capacity remaining for this attendee."});event.capacityRemaining=remaining-seats}
    if(oldStatus==="approved"&&newStatus!=="approved")event.capacityRemaining=(event.capacityRemaining??0)+seats
    if(newStatus==="denied"){event.attendees=event.attendees.filter(a=>a.email&&norm(a.email)!==normalizedEmail);await event.save();return res.status(200).json({message:"Attendee request denied and removed.",event})}
    const user=await db.User.findOne({email:normalizedEmail})
    const mail=await db.Mail.findOne({email:normalizedEmail})
    if(user)attendee.userComing=user._id
    if(mail)attendee.menteeComing=mail._id
    attendee.statusOnAttendence=newStatus
    await event.save()
    return res.status(200).json({message:"Attendee status updated successfully.",event})
    }catch(err){console.error(err);return res.status(500).json({message:"Server error."})}
  },

  // ✅
  removeAttendee:async(req,res)=>{try{
    const{eventId}=req.params
    const{menteeComing,userComing,email}=req.body
    if(!eventId)return res.status(400).json({message:"eventId is required."})
    if(!menteeComing&&!userComing&&!email)return res.status(400).json({message:"Provide menteeComing, userComing, or email to identify attendee."})
    const norm=e=>e.trim().toLowerCase()
    const normalizedEmail=email?norm(email):null
    const event=await db.Event.findById(eventId)
    if(!event)return res.status(404).json({message:"Event not found."})
    const attendeeIndex=event.attendees.findIndex(a=>{
    if(menteeComing)return a.menteeComing&&a.menteeComing.toString()===menteeComing.toString()
    if(userComing)return a.userComing&&a.userComing.toString()===userComing.toString()
    if(normalizedEmail)return a.email&&norm(a.email)===normalizedEmail
    return false
    })
    if(attendeeIndex===-1)return res.status(404).json({message:"Attendee not found on event."})
    const attendee=event.attendees[attendeeIndex]
    if(attendee.statusOnAttendence==="approved"){
    const seatsToRestore=typeof attendee.bringingAlong==="number"
    ?attendee.bringingAlong
    :((Array.isArray(attendee.bringingAlongEmails)?attendee.bringingAlongEmails.length:0)===0?1:(attendee.bringingAlongEmails.length+1))
    if(event.capacityRemaining==null)event.capacityRemaining=event.maxCapacity??0
    event.capacityRemaining+=seatsToRestore
    }
    event.attendees.splice(attendeeIndex,1)
    await event.save()
    return res.status(200).json({event:event.toObject(),message:"Attendee removed successfully."})
    }catch(err){console.error(err);if(err.name==="ValidationError")return res.status(400).json({message:err.message});return res.status(500).json({message:"Error removing attendee."})}
  },

  getEventById: async (req, res) => {
    try {
      const { id } = req.params;
      console.log("hello id", id)
      const event = await db.Event.findById(id)
        // optionally populate refs
        .populate('upcomingEvent')
        // .populate('createdBy')
        // .populate('attendees')
        .exec();
      if (!event) {
        return res.status(404).json({
          message: "Event not found.",
        });
      }
      return res.status(200).json(event);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error fetching event.",
      });
    }
  },

  // ✅
  getAllEvents: async (req, res) => {
    try {
      const events = await db.Event.find({})
        // optionally sort by start date (soonest first)
        .sort({ startDate: 1 })
        // optionally populate refs
        .populate('upcomingEvent')
        // .populate('createdBy')
        // .populate('attendees')
        .exec();
      return res.status(200).json({
        count: events.length,
        events,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error fetching events.",
      });
    }
  },

  deleteEvent: async (req, res) => {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({
        message: "eventId is required."
      });
    }

    try {

      const event = await db.Event.findById(eventId);

      if (!event) {
        return res.status(404).json({
          message: "Event not found."
        });
      }

      // Remove event from all Locations
      await db.Location.updateMany(
        { upcomingEvent: eventId },
        { $pull: { upcomingEvent: eventId } }
      );

      // Remove event from all Users
      await db.User.updateMany(
        { upcomingEvent: eventId },
        { $pull: { upcomingEvent: eventId } }
      );

      // Delete the event itself
      await db.Event.deleteOne({ _id: eventId });

      return res.status(200).json({
        message: "Event deleted and references cleaned successfully."
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error deleting event."
      });
    }
  },


}

export default eventController
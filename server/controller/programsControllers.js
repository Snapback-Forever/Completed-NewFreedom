import db from "../db/index.js";
import mongoose from "mongoose";
import { deleteGridFsFileById } from '../gridfsHelper.js';

const ProgramController = {

  //  LOCATION CONTROLLERS
  // ✅
  addLocation: async (req, res) => {
    const {
      locationImage,
      locImageFileId,
      locImageBucketName,
      aboutLocation,
      aboutLocationVideo,
      additionalImages,  // can be comma-separated string or array of *links*
      mailingAddress,    // { street, city, state, zipCode }
      maxCapacity,
      programs,          // optional
      facilitySex,
      locationName,
      locationPhoneNumber,
    } = req.body;
    try {
      // Basic required field checks that correspond to schema
      if (maxCapacity == null) {
        return res.status(400).json({
          message: 'maxCapacity is required.',
        });
      }
      if (Number.isNaN(Number(maxCapacity)) || Number(maxCapacity) < 0) {
        return res.status(400).json({
          message: 'maxCapacity must be a non-negative number.',
        });
      }
      const allowedSex = ['men', 'women', 'coed'];
      if (!facilitySex || !allowedSex.includes(facilitySex)) {
        return res.status(400).json({
          message: 'facilitySex must be one of: men, women, coed.',
        });
      }
      // Phone validation
      const usPhoneRegex =
        /^(?:\+?1[\s-]?)?(?:\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;
      if (locationPhoneNumber && !usPhoneRegex.test(locationPhoneNumber)) {
        return res.status(400).json({
          message: 'locationPhoneNumber must be a valid US phone number.',
        });
      }
      // Normalize mailingAddress to a single object
      if (!mailingAddress || typeof mailingAddress !== 'object') {
        return res.status(400).json({
          message:
            'mailingAddress must be an object with street, city, state, zipCode.',
        });
      }
      const mailingAddressObj = {
        street: mailingAddress.street || '',
        city: mailingAddress.city || '',
        state: mailingAddress.state || '',
        zipCode: mailingAddress.zipCode || '',
      };
      // Normalize additionalImages to array of *subdocs* { link }
      // (Later you can also add imageFileId/imageBucketName from upload flow.)
      let additionalImagesLinks = [];
      if (typeof additionalImages === 'string') {
        additionalImagesLinks = additionalImages
          .split(',')
          .map(img => img.trim())
          .filter(Boolean);
      } else if (Array.isArray(additionalImages)) {
        additionalImagesLinks = additionalImages
          .map(img => (img || '').trim())
          .filter(Boolean);
      }
      // Deduplicate links
      additionalImagesLinks = [...new Set(additionalImagesLinks)];
      // Map into schema shape: { link, imageFileId, imageBucketName, description }
      const additionalImagesDocs = additionalImagesLinks.map(link => ({
        link,
        // imageFileId, imageBucketName, description can be set later via update
        // or separate upload route; they default to null/undefined in schema.
      }));
      const newLocation = new db.Location({
        mailingAddress: mailingAddressObj,
        maxCapacity: Number(maxCapacity),
        aboutLocation,
        aboutLocationVideo,
        facilitySex,
        locationImage,
        locImageFileId,
        locImageBucketName,
        additionalImages: additionalImagesDocs,
        locationName,
        locationPhoneNumber,
        ...(programs && { programs }),
      });
      const savedLocation = await newLocation.save();
      return res.status(201).json({
        ...savedLocation.toObject(),
        message: 'Location created successfully!',
      });
    } catch (err) {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: 'Error creating location.' });
    }
  },
  

  // ✅
  updateLocation: async (req, res) => {
    const { id } = req.params;
    const {
      mailingAddress,
      maxCapacity,
      aboutLocation,
      aboutLocationVideo,
      facilitySex,
      locationImage,
      locImageFileId,
      locImageBucketName,
      additionalImages,
      locationName,
      locationPhoneNumber
    } = req.body;
    try {
      const usPhoneRegex =
        /^(?:\+?1[\s-]?)?(?:\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;
      if (locationPhoneNumber !== undefined && locationPhoneNumber !== null) {
        if (locationPhoneNumber !== '' && !usPhoneRegex.test(locationPhoneNumber)) {
          return res.status(400).json({
            message: 'locationPhoneNumber must be a valid US phone number.',
          });
        }
      }
      const location = await db.Location.findById(id);
      if (!location) {
        return res.status(404).json({ message: "Location not found." });
      }
      // -------------------------
      // BASIC FIELD UPDATES
      // -------------------------
      if (locationName !== undefined) location.locationName = locationName;
      if (aboutLocation !== undefined) location.aboutLocation = aboutLocation;
      if (aboutLocationVideo !== undefined) location.aboutLocationVideo = aboutLocationVideo;
      if (facilitySex !== undefined) location.facilitySex = facilitySex;
      if (locationPhoneNumber !== undefined) location.locationPhoneNumber = locationPhoneNumber;
      // -------------------------
      // ADDRESS UPDATE
      // -------------------------
      if (mailingAddress !== undefined) {
        if (!mailingAddress || typeof mailingAddress !== "object") {
          return res.status(400).json({
            message: "mailingAddress must contain street, city, state, zipCode"
          });
        }
        location.mailingAddress = {
          street: mailingAddress.street || "",
          city: mailingAddress.city || "",
          state: mailingAddress.state || "",
          zipCode: mailingAddress.zipCode || ""
        };
      }
      // -------------------------
      // CAPACITY
      // -------------------------
      if (maxCapacity !== undefined) {
        location.maxCapacity = maxCapacity;
      }
      // -------------------------
      // LOCATION IMAGE UPDATE
      // (THIS IS WHAT YOUR UI BUTTON USES)
      // -------------------------
      if (locationImage !== undefined) {
        location.locationImage = locationImage;
      }
      if (locImageFileId !== undefined) {
        location.locImageFileId = locImageFileId;
      }
      if (locImageBucketName !== undefined) {
        location.locImageBucketName = locImageBucketName;
      }
      // -------------------------
      // ADDITIONAL IMAGES
      // -------------------------
      if (additionalImages !== undefined) {
        let additionalImagesArr = [];
        if (typeof additionalImages === "string") {
          additionalImagesArr = additionalImages
            .split(",")
            .map(link => link.trim())
            .filter(Boolean)
            .map(link => ({
              link,
              description: ""
            }));
        }
        else if (Array.isArray(additionalImages)) {
          additionalImagesArr = additionalImages
            .map(img => {
              if (img && typeof img === "object") {
                return {
                  link: (img.link || "").trim(),
                  description: (img.description || "").trim(),
                  imageFileId: img.imageFileId || null,
                  imageBucketName: img.imageBucketName || null
                };
              }
              if (typeof img === "string") {
                return {
                  link: img.trim(),
                  description: "",
                  imageFileId: null,
                  imageBucketName: null
                };
              }
              return null;
            })
            .filter(img => img && img.link);
        }
        // dedupe
        const seen = new Set();
        additionalImagesArr = additionalImagesArr.filter(img => {
          if (seen.has(img.link)) return false;
          seen.add(img.link);
          return true;
        });
        location.additionalImages = additionalImagesArr;
      }
      // -------------------------
      // RECALCULATE CAPACITY
      // -------------------------
      const menteeCount = location.locationMentee
        ? location.locationMentee.length
        : 0;
      const maxCap = location.maxCapacity || 0;
      location.currentCapacity = Math.max(0, maxCap - menteeCount);
      const updatedLocation = await location.save();
      return res.json({
        ...updatedLocation.toObject(),
        message: "Location updated successfully!"
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({
        message: "Error updating location."
      });
    }
  },

  // ✅
  addAdditionalImages: async (req, res) => {
    const { id } = req.params;
    const { additionalImages } = req.body;
    console.log("me")
    if (!additionalImages) {
        return res.status(400).json({ message: "additionalImages is required." });
    }
    try {
        const location = await db.Location.findById(id);
        if (!location) {
            return res.status(404).json({ message: "Location not found." });
        }
        let newImages = [];
        if (Array.isArray(additionalImages)) {
            newImages = additionalImages
                .map((img) => {
                    if (!img) return null;
                    return {
                        link: (img.link || "").trim(),
                        imageFileId: img.imageFileId || null,
                        imageBucketName: img.imageBucketName || null,
                        description: (img.description || "").trim()
                    };
                })
                .filter((img) => img && (img.link || img.imageFileId));
        } else {
            return res.status(400).json({
                message: "additionalImages must be an array."
            });
        }
        const seenNew = new Set();
        newImages = newImages.filter((img) => {
            const key = img.link || String(img.imageFileId);
            if (seenNew.has(key)) return false;
            seenNew.add(key);
            return true;
        });
        const existingImages = Array.isArray(location.additionalImages)
            ? location.additionalImages
            : [];
        const imageMap = new Map();
        for (const img of existingImages) {
            const key = img.link || String(img.imageFileId);
            if (!key) continue;
            imageMap.set(key, img);
        }
        for (const img of newImages) {
            const key = img.link || String(img.imageFileId);
            const existing = imageMap.get(key);
            if (existing) {
                imageMap.set(key, {
                    link: img.link || existing.link || "",
                    imageFileId: img.imageFileId || existing.imageFileId || null,
                    imageBucketName: img.imageBucketName || existing.imageBucketName || null,
                    description: img.description || existing.description || ""
                });
            } else {
                imageMap.set(key, img);
            }
        }
        location.additionalImages = Array.from(imageMap.values());
        const updatedLocation = await location.save();
        return res.json({
            ...updatedLocation.toObject(),
            message: "Additional images added successfully!"
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Error adding additional images." });
    }
    
    },

  // ✅
  removeAdditionalImages: async (req, res) => {
    const { id } = req.params;
    const { link, imageFileId } = req.body;
    if (!link && !imageFileId) {
      return res.status(400).json({
        message: "link or imageFileId is required."
      });
    }
    try {
      const location = await db.Location.findById(id);
      if (!location) {
        return res.status(404).json({ message: "Location not found." });
      }
      const existingImages = Array.isArray(location.additionalImages)
        ? location.additionalImages
        : [];
      const imageToDelete = existingImages.find((img) =>
        (link && img.link === link) ||
        (imageFileId &&
          img.imageFileId &&
          String(img.imageFileId) === String(imageFileId))
      );
      if (imageToDelete?.imageFileId) {
        await deleteGridFsFileById("images", imageToDelete.imageFileId);
      }
      const updatedImages = existingImages.filter((img) => {
        if (link && img.link === link) return false;
        if (
          imageFileId &&
          img.imageFileId &&
          String(img.imageFileId) === String(imageFileId)
        ) return false;
        return true;
      });
      location.additionalImages = updatedImages;
      const updatedLocation = await location.save();
      return res.json({
        ...updatedLocation.toObject(),
        message: "Selected image removed successfully!"
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error removing additional images."
      });
    }
  },

  // ✅ allows multiple if needed
  addLocationStaff: async (req, res) => {
    const { locationId } = req.params;
    let { userIds } = req.body; // can be string, comma-separated, or array
    if (!userIds) {
      return res.status(400).json({ message: "userIds is required" });
    }
    // Normalize userIds to an array of strings
    if (Array.isArray(userIds)) {
      userIds = userIds.map((id) => String(id));
    } else if (typeof userIds === "string") {
      // Support comma-separated, e.g. "1,2,3"
      userIds = userIds
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
    } else {
      // Fallback: single non-string value
      userIds = [String(userIds)];
    }
    if (userIds.length === 0) {
      return res.status(400).json({ message: "No valid userIds provided" });
    }
    try {
      // Ensure location exists (with current staff)
      const location = await db.Location.findById(locationId).select("locationStaff");
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      // Ensure users exist (optional but recommended)
      const users = await db.User.find({ _id: { $in: userIds } }).select("_id");
      if (users.length === 0) {
        return res.status(404).json({ message: "No valid users found" });
      }
      const existingStaffIds = location.locationStaff.map((id) => String(id));
      const incomingIds = users.map((u) => String(u._id));
      // Determine which requested IDs are already there vs new
      const alreadyAtLocation = incomingIds.filter((id) =>
        existingStaffIds.includes(id)
      );
      const toAdd = incomingIds.filter((id) =>
        !existingStaffIds.includes(id)
      );
      let updatedLocation;
      if (toAdd.length > 0) {
        // Add only the new IDs (MongoDB still enforces uniqueness via $addToSet)
        updatedLocation = await db.Location.findByIdAndUpdate(
          locationId,
          { $addToSet: { locationStaff: { $each: toAdd } } },
          { new: true }
        ).populate("locationStaff", "-password");
        // Update Users: add this location to workLocation
        await db.User.updateMany(
          { _id: { $in: toAdd } },
          { $addToSet: { workLocation: locationId } }
        );
      } else {
        // No new IDs to add; just populate for consistent response
        updatedLocation = await db.Location.findById(locationId)
          .populate("locationStaff", "-password");
      }
      // Different messages for frontend toast logic
      if (toAdd.length === 0 && alreadyAtLocation.length > 0) {
        // All requested users were already at this location
        return res.status(200).json({
          message: "All selected users are already assigned to this location.",
          addedUserIds: [],
          alreadyAtLocation,
          location: updatedLocation,
        });
      }
      if (toAdd.length > 0 && alreadyAtLocation.length > 0) {
        // Some newly added, some already there
        return res.status(200).json({
          message:
            "Some users were added to this location. Some were already assigned.",
          addedUserIds: toAdd,
          alreadyAtLocation,
          location: updatedLocation,
        });
      }
      // No duplicates: all users newly added
      return res.status(200).json({
        message: "Users added to locationStaff and workLocation updated.",
        addedUserIds: toAdd,
        alreadyAtLocation: [],
        location: updatedLocation,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Error adding users to locationStaff" });
    }
  },

  // ✅
  removeLocationStaff: async (req, res) => {
    const { locationId } = req.params;
    let { userIds } = req.body; // can be string or array
    if (!userIds) {
      return res.status(400).json({ message: "userIds is required" });
    }
    // Normalize to array
    if (!Array.isArray(userIds)) {
      userIds = [userIds];
    }
    try {
      // 1. Ensure location exists
      const location = await db.Location.findById(locationId);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      // 2. Optional: check that some of these users are actually in locationStaff
      const staffSet = new Set(location.locationStaff.map(id => id.toString()));
      const actuallyAssigned = userIds.filter(id => staffSet.has(id.toString()));
      if (actuallyAssigned.length === 0) {
        return res.status(400).json({
          message: "None of the given users are assigned to this location",
        });
      }
      // 3. Update Location: remove users from locationStaff
      const updatedLocation = await db.Location.findByIdAndUpdate(
        locationId,
        { $pull: { locationStaff: { $in: userIds } } },
        { new: true }
      ).populate("locationStaff", "-password");
      // 4. Update Users: remove this location from workLocation
      await db.User.updateMany(
        { _id: { $in: userIds } },
        { $pull: { workLocation: locationId } }
      );
      return res.status(200).json({
        message:
          "Users removed from locationStaff and workLocation cleaned up",
        location: updatedLocation,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error removing users from locationStaff",
      });
    }
  },

  // ✅ 
  addLocationMentees: async (req, res) => {
    const { locationId } = req.params;
    let { mailIds } = req.body; // can be string or array
    if (!mailIds) {
      return res.status(400).json({ message: "mailIds is required" });
    }
    // Normalize mailIds -> array of non-empty strings
    if (typeof mailIds === "string") {
      mailIds = mailIds
        .split(",")
        .map(id => id.trim())
        .filter(id => id.length > 0);
    } else if (Array.isArray(mailIds)) {
      mailIds = mailIds
        .map(id => (typeof id === "string" ? id.trim() : id))
        .filter(id => id);
    } else {
      return res.status(400).json({
        message: "mailIds must be a string or an array",
      });
    }
    if (mailIds.length === 0) {
      return res.status(400).json({ message: "No valid mailIds provided" });
    }
    try {
      // 1) Load location including current mentees
      const location = await db.Location.findById(locationId)
        .populate("locationMentee")
        .lean();
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      // 2) Load only valid Mail docs
      const mails = await db.Mail.find({ _id: { $in: mailIds } }).lean();
      if (mails.length === 0) {
        return res.status(404).json({ message: "No valid mail/mentees found" });
      }
      const validMailIds = mails.map(m => String(m._id));
      // 3) NEW: block mentees already assigned to another location
      const conflictingLocations = await db.Location.find({
        _id: { $ne: locationId },            // any location other than this one
        locationMentee: { $in: validMailIds } // that already has any of these mentees
      })
        .select("_id locationName locationMentee")
        .lean();
      if (conflictingLocations.length > 0) {
        // Optionally, you can be more granular and return which mentee is in which location
        return res.status(400).json({
          message: "Some mentees are already assigned to another location",
          requestedMailIds: mailIds,
          conflictingLocations: conflictingLocations.map(loc => ({
            locationId: loc._id,
            locationName: loc.locationName,
          })),
        });
      }
      // 4) Existing mentees before this operation (in THIS location)
      const existingMenteeIds = (location.locationMentee || []).map(m =>
        String(m._id || m)
      );
      // Only mentees that are not already present could actually be added
      const uniqueNewMenteeIds = validMailIds.filter(
        id => !existingMenteeIds.includes(id)
      );
      const numPotentialAdds = uniqueNewMenteeIds.length;
      // 5) Compute available capacity BEFORE adding anything
      const currentMenteeCount = existingMenteeIds.length;
      const capacityBefore = location.maxCapacity - currentMenteeCount;
      if (capacityBefore < numPotentialAdds) {
        return res.status(400).json({
          message: "Not enough capacity for these mentees",
          currentCapacity: capacityBefore,
        });
      }
      // 6) Add mentees (no duplicates) to this location
      const updatedLocation = await db.Location.findByIdAndUpdate(
        locationId,
        {
          $addToSet: { locationMentee: { $each: validMailIds } },
        },
        { new: true }
      ).populate("locationMentee");
      // AFTER update: recompute capacity using array length
      const updatedMenteeCount = Array.isArray(updatedLocation.locationMentee)
        ? updatedLocation.locationMentee.length
        : 0;
      const newCurrentCapacity =
        (updatedLocation.maxCapacity ?? 0) - updatedMenteeCount;
      // Persist recomputed currentCapacity
      updatedLocation.currentCapacity = newCurrentCapacity;
      await updatedLocation.save();
      // What actually changed in this call
      const updatedMenteeIds = updatedLocation.locationMentee.map(m =>
        String(m._id || m)
      );
      const actuallyAdded = updatedMenteeIds.filter(
        id => !existingMenteeIds.includes(id)
      );
      const alreadyPresent = validMailIds.filter(id =>
        existingMenteeIds.includes(id)
      );
      // 7) Update Mail docs to reference this location
      // (still using an array on Mail.livingLocation)
      await db.Mail.updateMany(
        { _id: { $in: actuallyAdded } },
        {
          $addToSet: { livingLocation: locationId },
          $set:      { currentLocation: location.locationName },
        }
      );
      return res.status(200).json({
        message:
          "Mentees processed: locationMentee updated, capacity recalculated, and livingLocation updated",
        summary: {
          requestedMailIds: mailIds,
          validMailIds,
          addedMentees: actuallyAdded,
          alreadyInLocation: alreadyPresent,
          currentCapacity: newCurrentCapacity,
        },
        location: updatedLocation,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  },

  // ✅ 
  removeLocationMentee: async (req, res) => {
    const { locationId } = req.params;
    const { mailId } = req.body; // single mentee/mail ID
    if (!mailId) {
      return res.status(400).json({ message: "mailId is required" });
    }
    try {
      // 1. Ensure location exists and actually contains this mentee
      const location = await db.Location.findById(locationId);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      const isMenteeInLocation = (location.locationMentee || []).some(
        (id) => id.toString() === mailId.toString()
      );
      if (!isMenteeInLocation) {
        return res.status(400).json({
          message: "Mentee is not assigned to this location",
        });
      }
      // 2. Remove mentee from locationMentee (this is where the ID is actually removed)
      const updatedLocation = await db.Location.findByIdAndUpdate(
        locationId,
        {
          $pull: { locationMentee: mailId },
        },
        { new: true }
      ).populate("locationMentee");
      // 3. AFTER removal: recompute currentCapacity from updated array length
      const updatedMenteeCount = Array.isArray(updatedLocation.locationMentee)
        ? updatedLocation.locationMentee.length
        : 0;
      const newCurrentCapacity =
        (updatedLocation.maxCapacity ?? 0) - updatedMenteeCount;
      updatedLocation.currentCapacity = newCurrentCapacity;
      await updatedLocation.save();
      // 4. Update Mail doc: remove this location from livingLocation
      await db.Mail.updateOne(
        { _id: mailId },
        { $pull: { livingLocation: locationId } }
      );
      return res.status(200).json({
        message:
          "Mentee removed from locationMentee, livingLocation cleaned up, and capacity recalculated",
        location: updatedLocation,
        currentCapacity: newCurrentCapacity,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message:
          "Error removing mentee from locationMentee and updating capacity",
        error: err.message,
      });
    }
  },

  getLocationById: async (req, res) => {
    const { id } = req.params;
    try {
      const location = await db.Location
        .findById(id)
        .populate("programs")
        .populate("locationStaff")
        .populate("upcomingEvent")
      if (!location) {
        return res.status(404).json({
          message: 'Location not found.',
        });
      }
      return res.json(location);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Error fetching location.',
        error: err,
      });
    }
  },

  // ✅
  getAllLocations: (req, res) => {

    db.Location.find()
      .populate("programs")
      .populate("locationMentee")
      .populate("locationStaff")
      .populate("upcomingEvent")
      .then((data) => {
        if (!data || data.length === 0) {
          return res.json({
            message: "There are no locations in the database.",
          });
        } else {
          return res.json(data);
        }
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Error fetching locations.", error: err });
      });
  },


  //  PROGRAM CONTROLLERS
  // ✅
  addProgram: async (req, res) => {
    const {
      programName,
      openToPublic,
      descriptionOfProgramVideo,
      maxCapacity,
      programType,
      descriptionOfProgram,
      lengthOfProgram,
      graduates,           // NEW: allow graduates on create
      // still intentionally no teachers, students
      // location could be added similarly if needed
    } = req.body;
    try {
      if (!programName || typeof programName !== 'string') {
        return res
          .status(400)
          .json({ message: 'Program name is required and must be a string.' });
      }
      if (
        maxCapacity === undefined ||
        maxCapacity === null ||
        isNaN(Number(maxCapacity)) ||
        Number(maxCapacity) < 0
      ) {
        return res.status(400).json({
          message: 'maxCapacity is required and must be a non-negative number.',
        });
      }
      const normalizedMaxCapacity = Number(maxCapacity);
      const programNameNormalized = programName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '');
      const newProgram = new db.Program({
        programName,
        programNameNormalized,
        programType,
        openToPublic,
        descriptionOfProgramVideo,
        descriptionOfProgram,
        lengthOfProgram,
        maxCapacity: normalizedMaxCapacity,
        graduates,              // NEW: will be cast to subdocs using schema
        // currentCapacity handled by pre('save') (maxCapacity - students.length)
        // other arrays default to []
      });
      const savedProgram = await newProgram.save();
      return res.status(201).json({
        ...savedProgram.toObject(),
        message: 'Program created successfully!',
      });
    } catch (err) {
      console.error(err);
      if (
        err.code === 11000 &&
        err.keyPattern &&
        err.keyPattern.programNameNormalized
      ) {
        return res.status(400).json({
          message: 'A program with this name already exists.',
          field: 'programName',
          type: 'duplicate',
        });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: 'Error creating program.' });
    }
  },

  // ✅
  attachProgramToLocation: async (req, res) => {
    const { locationId, programId } = req.params;
    try {
      const [location, program] = await Promise.all([
        db.Location.findById(locationId),
        db.Program.findById(programId),
      ]);
      if (!location || !program) {
        return res.status(404).json({ message: "Location or Program not found." });
      }
      const alreadyAttached =
        location.programs?.some(p => p.toString() === programId) ||
        program.location?.some(l => l.toString() === locationId);
      if (alreadyAttached) {
        return res.json({ message: "Program is already attached to this location." });
      }
      // push location into Program
      await db.Program.findByIdAndUpdate(
        programId,
        { $addToSet: { location: locationId } },
        { new: true }
      );
      // push program into Location
      await db.Location.findByIdAndUpdate(
        locationId,
        { $addToSet: { programs: programId } },
        { new: true }
      );
      return res.json({
        message: "Program attached to location successfully."
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error attaching program to location." });
    }
  },

  // ✅
  removeLocationFromProgram: async (req, res) => {
    const { locationId, programId } = req.params;
  
    try {
  
      const [location, program] = await Promise.all([
        db.Location.findById(locationId),
        db.Program.findById(programId),
      ]);
  
      if (!location || !program) {
        return res.status(404).json({ message: "Location or Program not found." });
      }
  
      const isAttached =
        location.programs?.some(p => p.toString() === programId.toString()) ||
        program.location?.some(l => l.toString() === locationId.toString());
  
      if (!isAttached) {
        return res.json({
          message: "Program is not attached to this location."
        });
      }
  
      await db.Program.findByIdAndUpdate(
        programId,
        { $pull: { location: locationId } },
        { new: true }
      );
  
      await db.Location.findByIdAndUpdate(
        locationId,
        { $pull: { programs: programId } },
        { new: true }
      );
  
      return res.json({
        message: "Location removed from program successfully."
      });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error removing location from program."
      });
    }
  },
  

  // ✅
  getProgramById: (req, res) => {
    const { programId } = req.params;
    db.Program.findById(programId)
      .populate("location")          // Location ref
      .populate("teachers")          // User refs
      .then((program) => {
        if (!program) {
          return res.status(404).json({
            message: "Program not found.",
          });
        }
        return res.json(program);
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Error fetching program.", error: err });
      });
  },

  // ✅
  getAllPrograms: (req, res) => {
    db.Program.find()
      .populate("location")
      .populate("teachers")
      .populate("graduates")
      .populate("students.mailUser")
      .then((data) => {
        if (!data || data.length === 0) {
          return res.json({
            message: "There are no programs in the database.",
          });
        } else {
          return res.json(data);
        }
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Error fetching programs.", error: err });
      });
  },

  // ✅
  addStudentToProgram: async (req, res) => {
    const { programId, mailUser } = req.params;
    try {
      // 1. Ensure mailUser is provided
      if (!mailUser) {
        return res.status(400).json({
          message:
            "mailUser (Mail _id) is required to add a student to a program.",
        });
      }
      // 1a. Validate that mailUser is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(mailUser)) {
        return res.status(400).json({
          message: "mailUser must be a valid ObjectId.",
        });
      }
      // 1b. Ensure mailUser actually exists in the Mail collection
      const mailDoc = await db.Mail.findById(mailUser).select("_id");
      if (!mailDoc) {
        return res.status(400).json({
          message: "mailUser does not exist in the mail list.",
        });
      }
      // 2. Load the target program
      const program = await db.Program.findById(programId);
      if (!program) {
        return res
          .status(404)
          .json({ message: `Program with id ${programId} not found.` });
      }
      // 2b. GLOBAL RULE:
      // mailUser must not already be a student in ANY program.
      const existingEnrollment = await db.Program.findOne({
        "students.mailUser": mailUser,
      }).select("_id programName");
      if (existingEnrollment) {
        return res.status(400).json({
          message: "This mail user is already enrolled in a program.",
          details: {
            programId: existingEnrollment._id,
            programName: existingEnrollment.programName,
          },
        });
      }
      // 3. LOCAL RULES for this program only
      // 3a. Not already a student in THIS program
      const alreadyStudentHere = Array.isArray(program.students)
        ? program.students.some((student) => {
          const existingId = String(student.mailUser);
          const newId = String(mailUser);
          return existingId === newId;
        })
        : false;
      if (alreadyStudentHere) {
        return res.status(400).json({
          message: "This mail user is already enrolled in this program.",
          details: {
            programId: program._id,
            programName: program.programName,
          },
        });
      }
      // 3b. Not already a graduate in THIS program
      const alreadyGraduateHere = Array.isArray(program.graduates)
        ? program.graduates.some((grad) => {
          const existingId = String(grad.mailUser);
          const newId = String(mailUser);
          return existingId === newId;
        })
        : false;
      if (alreadyGraduateHere) {
        return res.status(400).json({
          message:
            "This mail user has already graduated from this program and cannot enroll again.",
          details: {
            programId: program._id,
            programName: program.programName,
          },
        });
      }
      // 4. Capacity check (using currentCapacity as "remaining seats")
      if (
        typeof program.currentCapacity === "number" &&
        program.currentCapacity <= 0
      ) {
        return res.status(400).json({
          message: "This program is already at full capacity.",
        });
      }
      // 5. startDate = day after we add the user (tomorrow at 00:00)
      const now = new Date();
      const start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // tomorrow
        0,
        0,
        0,
        0
      );
      // 6. lengthOfProgram is digits-only string due to your setter
      const daysStr = program.lengthOfProgram || "0";
      const days = parseInt(daysStr, 10) || 0;
      // endDate = startDate + lengthOfProgram (days)
      const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
      // 7. Push new student into Program.students
      program.students.push({
        mailUser, // this is the Mail _id
        startDate: start,
        endDate: end,
      });
      // 8. Recalculate currentCapacity = maxCapacity - students.length
      const studentsCount = Array.isArray(program.students)
        ? program.students.length
        : 0;
      const maxCapacity =
        typeof program.maxCapacity === "number" ? program.maxCapacity : 0;
      let newCurrentCapacity = maxCapacity - studentsCount;
      if (newCurrentCapacity < 0) {
        newCurrentCapacity = 0;
      }
      program.currentCapacity = newCurrentCapacity;
      // 9. Save Program
      const updatedProgram = await program.save();
      // 10. Update Mail: push programId into programsEnrolled
      await db.Mail.findByIdAndUpdate(
        mailUser,
        { $addToSet: { programsEnrolled: programId } },
        { new: true }
      );
      // 11. Return updated program
      return res.json(updatedProgram);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error adding student to program.",
        error: err,
      });
    }
  },

  // ✅
  removeStudentFromProgram: async (req, res) => {
    const { programId, studentId } = req.params;
    const { currentUserId } = req.body; // ✅ NOW COMES FROM FRONTEND
  
    try {
      // 1) Load acting user (optional)
      const actingUser = currentUserId
        ? await db.User.findById(currentUserId).lean()
        : null;
  
      // 2) Load student (Mail user)
      const mailUser = studentId
        ? await db.Mail.findById(studentId).lean()
        : null;
  
      // 3) Load program
      const program = await db.Program.findById(programId);
  
      if (!program) {
        return res.status(404).json({
          message: `Program with id ${programId} not found.`,
        });
      }
  
      // 4) Remove student (FIXED MATCHING LOGIC)
      const beforeCount = program.students?.length || 0;
  
      program.students = (program.students || []).filter((s) => {
        const matchId =
          s.mailUser ||
          s.studentId ||
          s._id;
  
        return String(matchId) !== String(studentId);
      });
  
      const afterCount = program.students.length;
  
      if (beforeCount === afterCount) {
        return res.status(404).json({
          message: "Student not found in this program's students list.",
        });
      }
  
      // 5) Update capacity
      const maxCapacity =
        typeof program.maxCapacity === "number" ? program.maxCapacity : 0;
  
      program.currentCapacity = Math.max(
        0,
        maxCapacity - program.students.length
      );
  
      const updatedProgram = await program.save();
  
      // 6) Update Mail record (best effort)
      try {
        await db.Mail.findByIdAndUpdate(studentId, {
          $pull: { programsEnrolled: programId },
        });
      } catch (err) {
        console.error("Mail update failed:", err);
      }
  
      // 7) Audit log (FIXED - NO AUTH REQUIRED)
      try {
        await db.AuditLog.create({
          action: "REMOVE_STUDENT_FROM_PROGRAM",
  
          performedBy: currentUserId || null,
          userMakingLog: currentUserId || "unknown",
  
          performedByFirstName: actingUser?.firstName || null,
  
          removedStudentId: mailUser?._id || studentId,
          removedStudentFirstName: mailUser?.firstName || null,
          removedStudentLastName: mailUser?.lastName || null,
          removedStudentEmail: mailUser?.email || null,
  
          auditLogStatus: "SUCCESS",
          aboutAuditLog: "Student removed from program",
  
          details: `Student ${
            mailUser
              ? `${mailUser.firstName || ""} ${mailUser.lastName || ""} <${mailUser.email || ""}> (${mailUser._id})`
              : studentId
          } removed from program ${programId} by ${
            actingUser
              ? `${actingUser.firstName || ""} ${actingUser.lastName || ""}`
              : currentUserId || "unknown user"
          }.`,
        });
      } catch (err) {
        console.error("Audit log error:", err);
      }
  
      return res.json(updatedProgram);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error removing student from program.",
        error: err,
      });
    }
  },

  // ✅
  addGraduate: async (req, res) => {
    const { programId, mailId } = req.params;
    const {
      gradImage,
      gradImageFileId,
      gradImageBucketName,
    } = req.body;
    try {
      // 1) Find program
      const program = await db.Program.findById(programId);
      if (!program) {
        return res
          .status(404)
          .json({ message: `Program with id ${programId} not found.` });
      }
      // 2) Find Mail document for this mailId
      const mailDoc = await db.Mail.findById(mailId).lean();
      if (!mailDoc) {
        return res.status(404).json({
          message: `Mail document with id ${mailId} not found.`,
        });
      }
      // 3) Get firstName/lastName from Mail document (top-level fields)
      const firstName = mailDoc.firstName;
      const lastName = mailDoc.lastName;
      if (!firstName || !lastName) {
        return res.status(400).json({
          message:
            'Mail record does not have firstName/lastName set, cannot create graduate entry.',
        });
      }
      // 4) (Optional) Find inmate number for state === 'Arizona'
      const inmateEntry = Array.isArray(mailDoc.inmateNumbers)
        ? mailDoc.inmateNumbers.find(
            (n) => String(n.state).toLowerCase() === 'arizona'
          )
        : null;
      // 5) Build graduate document to match Program.graduates schema
      const graduateDoc = {
        mailUser: mailId,
        firstName,
        lastName,
        gradImage: gradImage || undefined,
        gradImageFileId: gradImageFileId || null,
        gradImageBucketName: gradImageBucketName || null,
        gradDate: new Date().toISOString(),
      };
      // Only include inmateNumbers if we actually found one
      if (inmateEntry) {
        graduateDoc.inmateNumbers = [
          {
            number: inmateEntry.number,
            state: inmateEntry.state,
          },
        ];
      }
      // 6) Update Program in memory:
      //    - add to graduates
      //    - remove from students by mailUser
      program.graduates = Array.isArray(program.graduates)
        ? program.graduates
        : [];
      program.graduates.push(graduateDoc);
      program.students = (program.students || []).filter((student) => {
        const existingId = String(student.mailUser);
        const targetId = String(mailId);
        return existingId !== targetId;
      });
      // 7) Recalculate currentCapacity = maxCapacity - students.length
      const studentsCount = Array.isArray(program.students)
        ? program.students.length
        : 0;
      const maxCapacity =
        typeof program.maxCapacity === 'number' ? program.maxCapacity : 0;
      let newCurrentCapacity = maxCapacity - studentsCount;
      if (newCurrentCapacity < 0) {
        newCurrentCapacity = 0;
      }
      program.currentCapacity = newCurrentCapacity;
      // 8) Save Program
      const programResult = await program.save();
      // 9) Update Mail:
      //    - add programId to programsCompleted (no duplicates)
      //    - remove programId from programsEnrolled
      const mailResult = await db.Mail.updateOne(
        { _id: mailId },
        {
          $addToSet: { programsCompleted: programId },
          $pull: { programsEnrolled: programId },
        }
      );
      return res.json({
        message:
          "Graduate added successfully. Mail moved to programsCompleted, removed from students/programsEnrolled, and capacity updated. Inmate number is optional and included only if present for Arizona.",
        programUpdate: programResult,
        mailUpdate: mailResult,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Error adding graduate to program.',
        error: err,
      });
    } 
  },

  removeGraduate: async (req, res) => {
    const { programId, mailId } = req.params;
    const { currentUserId } = req.body; // who is performing the action
    try {
      // 1) Load actor (the user performing this action)
      const actor = await db.User.findById(currentUserId).lean();
      if (!actor) {
        return res.status(404).json({
          message: `User performing this action (currentUserId ${currentUserId}) not found.`,
        });
      }
      // 2) Find Program
      const program = await db.Program.findById(programId);
      if (!program) {
        return res
          .status(404)
          .json({ message: `Program with id ${programId} not found.` });
      }
      // 3) Find Mail document (this represents the affected user’s mail record)
      const mailDoc = await db.Mail.findById(mailId).lean();
      if (!mailDoc) {
        return res.status(404).json({
          message: `Mail document with id ${mailId} not found.`,
        });
      }
      // 4) Ensure this mail is actually a graduate for this program
      program.graduates = Array.isArray(program.graduates)
        ? program.graduates
        : [];
      const beforeCount = program.graduates.length;
      program.graduates = program.graduates.filter((grad) => {
        const gradMailId = String(grad.mailUser);
        const targetId = String(mailId);
        return gradMailId !== targetId;
      });
      const afterCount = program.graduates.length;
      if (beforeCount === afterCount) {
        return res.status(404).json({
          message: `No graduate entry found in program ${programId} for mailUser ${mailId}.`,
        });
      }
      // 5) Add the user back to students array (if desired)
      program.students = Array.isArray(program.students)
        ? program.students
        : [];
      const alreadyStudent = program.students.some((student) => {
        return String(student.mailUser) === String(mailId);
      });
      if (!alreadyStudent) {
        program.students.push({
          mailUser: mailId,
          firstName: mailDoc.firstName,
          lastName: mailDoc.lastName,
          // add any other fields your Program.students schema expects
        });
      }
      // 6) Recalculate currentCapacity = maxCapacity - students.length
      const studentsCount = Array.isArray(program.students)
        ? program.students.length
        : 0;
      const maxCapacity =
        typeof program.maxCapacity === 'number' ? program.maxCapacity : 0;
      let newCurrentCapacity = maxCapacity - studentsCount;
      if (newCurrentCapacity < 0) {
        newCurrentCapacity = 0;
      }
      program.currentCapacity = newCurrentCapacity;
      // 7) Save Program
      const programResult = await program.save();
      // 8) Update Mail:
      //    - remove programId from programsCompleted
      //    - add programId back to programsEnrolled (no duplicates)
      const mailResult = await db.Mail.updateOne(
        { _id: mailId },
        {
          $pull: { programsCompleted: programId },
          $addToSet: { programsEnrolled: programId },
        }
      );
      // 9) Create Audit Log entry
      //    currentUserId = actor
      //    mailId = affected user (via their mail record)
      const auditLogEntry = await db.AuditLog.create({
        action: "REMOVE_GRADUATE",
        performedBy: actor._id,
        performedByFirstName: actor.firstName || "",
        performedByLastName: actor.lastName || "",
        affectedUser: mailId, // mailId is the affected user in your design
        affectedUserAccountName:
          mailDoc.accountName ||
          `${mailDoc.firstName || ""} ${mailDoc.lastName || ""}`.trim(),
        userMakingLog: String(actor._id),
        auditLogStatus: "SUCCESS",
        aboutAuditLog: "Graduate status removed from program.",
        details: `User ${actor._id} removed graduation record for mailId ${mailId} from program ${programId}.`,
        // adminQuestionId can be set here if you have a relevant Question context
      });
      return res.json({
        message:
          "Graduate removed successfully. Mail moved back to programsEnrolled, removed from graduates, capacity updated, and audit log created.",
        programUpdate: programResult,
        mailUpdate: mailResult,
        auditLog: auditLogEntry,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Error removing graduate from program.',
        error: err,
      });
    }
  },

  updateGraduate: async (req, res) => {
    const { programId } = req.params;
    const {
      firstName,
      lastName,
      inmateNumber,
      inmateState,
      gradImage,
      gradDate,
      gradImageFileId,
      gradImageBucketName,
      mailId
    } = req.body;
    try {
      // 1) Find Program
      const program = await db.Program.findById(programId);
      if (!program) {
        return res.status(404).json({
          message: `Program with id ${programId} not found.`,
        });
      }
      // 2) Find graduate inside program.graduates
      const graduate = (program.graduates || []).find(
        (g) => String(g.mailUser) === String(mailId)
      );
      if (!graduate) {
        return res.status(404).json({
          message: `Graduate with mailUser ${mailId} not found in this program.`,
        });
      }
      // 3) Apply updates only for provided fields
      if (typeof firstName !== "undefined") {
        graduate.firstName = firstName;
      }
      if (typeof lastName !== "undefined") {
        graduate.lastName = lastName;
      }
      // inmate info must include both values
      if (
        typeof inmateNumber !== "undefined" ||
        typeof inmateState !== "undefined"
      ) {
        if (!inmateNumber || !inmateState) {
          return res.status(400).json({
            message:
              "To update inmate information you must provide both inmateNumber and inmateState.",
          });
        }
        graduate.inmateNumbers = [
          {
            number: inmateNumber,
            state: inmateState,
          },
        ];
      }
      if (typeof gradImage !== "undefined") {
        graduate.gradImage = gradImage;
      }
      if (typeof gradImageFileId !== "undefined") {
        graduate.gradImageFileId = gradImageFileId || null;
      }
      if (typeof gradImageBucketName !== "undefined") {
        graduate.gradImageBucketName = gradImageBucketName || null;
      }
      if (typeof gradDate !== "undefined") {
        graduate.gradDate = gradDate;
      }
      // 4) Save program
      const programResult = await program.save();
      return res.json({
        message: "Graduate updated successfully.",
        programUpdate: programResult,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error updating graduate in program.",
        error: err,
      });
    }
  },

  // ✅
  updateProgram: async (req, res) => {
    const { programId } = req.params;
    const allowedUpdates = [
      'programName',
      'descriptionOfProgramVideo',
      'openToPublic',
      'programType',
      'location',
      'maxCapacity',
      'descriptionOfProgram',
      'lengthOfProgram',
      'graduates',
    ];
    const safeBody = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedUpdates.includes(key))
    );
    try {
      const program = await db.Program.findById(programId);
      if (!program) {
        return res
          .status(404)
          .json({ message: `Program with id ${programId} not found.` });
      }
      // Apply allowed updates (including graduates array)
      Object.entries(safeBody).forEach(([key, value]) => {
        program[key] = value;
      });
      // programName normalization
      if (Object.prototype.hasOwnProperty.call(safeBody, 'programName')) {
        const rawName =
          typeof program.programName === 'string' ? program.programName : '';
        const normalizedName = rawName
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '');
        program.programNameNormalized = normalizedName;
      }
      // maxCapacity / currentCapacity logic
      if (Object.prototype.hasOwnProperty.call(safeBody, 'maxCapacity')) {
        const studentsCount = Array.isArray(program.students)
          ? program.students.length
          : 0;
        const newMaxCapacity = Number(program.maxCapacity);
        if (Number.isNaN(newMaxCapacity) || newMaxCapacity < 0) {
          return res.status(400).json({
            message: 'maxCapacity must be a non-negative number.',
          });
        }
        if (newMaxCapacity < studentsCount) {
          return res.status(400).json({
            message:
              'maxCapacity cannot be less than the number of enrolled students.',
            details: {
              studentsCount,
              attemptedMaxCapacity: newMaxCapacity,
            },
          });
        }
        let newCurrentCapacity = newMaxCapacity - studentsCount;
        if (newCurrentCapacity < 0) {
          newCurrentCapacity = 0;
        }
        program.currentCapacity = newCurrentCapacity;
      }
      const updatedProgram = await program.save();
      return res.json({
        ...updatedProgram.toObject(),
        message: 'Program updated successfully!',
      });
    } catch (err) {
      console.error(err);
      if (
        err.code === 11000 &&
        err.keyPattern &&
        err.keyPattern.programNameNormalized
      ) {
        return res.status(400).json({
          message: 'A program with this name already exists.',
          field: 'programName',
          type: 'duplicate',
        });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: 'Error updating program.', error: err });
    }
  },

  addProgramImage: async (req, res) => {
    try {
      const { programId } = req.params;
      const { imageFileId, imageBucketName, link, description } = req.body;
      const updatedProgram = await db.Program.findByIdAndUpdate(
        programId,
        {
          $push: {
            additionalImages: {
              imageFileId,
              imageBucketName,
              link: link || "",
              description: description || ""
            }
          }
        },
        { new: true }
      );
      if (!updatedProgram) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.json({
        message: "Program image added successfully",
        program: updatedProgram
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to add program image",
        error: error.message
      });
    }
  },

  deleteProgramImage: async (req, res) => {
    try {
      const { programId } = req.params;
      const { imageFileId, imageBucketName } = req.body;
      await deleteGridFsFileById(imageBucketName, imageFileId);
      const updatedProgram = await db.Program.findByIdAndUpdate(
        programId,
        {
          $pull: {
            additionalImages: { imageFileId }
          }
        },
        { new: true }
      );
      if (!updatedProgram) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.json({
        message: "Program image deleted successfully",
        program: updatedProgram
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to delete program image",
        error: error.message
      });
    }
  },

  // ✅
  deleteProgram: async (req, res) => {
    const { programId } = req.params;
    const currentUserId = req.userId || req.user?._id;
    try {
      // 0) Load acting user (optional, for audit)
      let actingUser = null;
      if (currentUserId) {
        actingUser = await db.User.findById(currentUserId).lean();
      }
      // 1) Delete the program (returns the deleted document)
      const deletedProgram = await db.Program.findByIdAndDelete(programId);
      if (!deletedProgram) {
        return res
          .status(404)
          .json({ message: `Program with id ${programId} not found.` });
      }
      // 2) Collect GridFS deletes for all stored files
      const gridfsDeletes = [];
      // graduates[].gradImageFileId / gradImageBucketName
      if (Array.isArray(deletedProgram.graduates)) {
        deletedProgram.graduates.forEach((grad) => {
          if (grad.gradImageFileId && grad.gradImageBucketName) {
            gridfsDeletes.push(
              deleteGridFsFileById(
                grad.gradImageBucketName,
                grad.gradImageFileId
              ).catch((err) =>
                console.error(
                  'Error deleting graduate image from GridFS:',
                  err.message
                )
              )
            );
          }
        });
      }
      // additionalImages[].imageFileId / imageBucketName
      if (Array.isArray(deletedProgram.additionalImages)) {
        deletedProgram.additionalImages.forEach((img) => {
          if (img.imageFileId && img.imageBucketName) {
            gridfsDeletes.push(
              deleteGridFsFileById(
                img.imageBucketName,
                img.imageFileId
              ).catch((err) =>
                console.error(
                  'Error deleting additional image from GridFS:',
                  err.message
                )
              )
            );
          }
        });
      }
      // 3) Clean up references
      const userUpdate = db.User.updateMany(
        { programsTeaching: programId },
        { $pull: { programsTeaching: programId } }
      );
      const locationUpdate = db.Location.updateMany(
        { programs: programId },
        { $pull: { programs: programId } }
      );
      const mailListUpdate = db.Mail.updateMany(
        {
          $or: [
            { programsEnrolled: programId },
            { programsCompleted: programId },
          ],
        },
        {
          $pull: {
            programsEnrolled: programId,
            programsCompleted: programId,
          },
        }
      );
      try {
        await Promise.all([
          userUpdate,
          locationUpdate,
          mailListUpdate,
          ...gridfsDeletes,
        ]);
      } catch (cleanupErr) {
        console.log(
          'Error cleaning up references or GridFS files (continuing):',
          cleanupErr
        );
      }
      // 4) Audit log (best-effort)
      try {
        await db.AuditLog.create({
          action: 'DELETE_PROGRAM',
          performedBy: actingUser ? actingUser?._id : null,
          performedByFirstName: actingUser?.accountName,
          auditLogStatus: 'SUCCESS',
          aboutAuditLog: 'Program deleted',
          details: `Program ${deletedProgram._id} (${deletedProgram.name || deletedProgram.title || 'no-name'
            }) deleted by ${actingUser
              ? `${actingUser.firstName || ''} ${actingUser.lastName || ''
              } (${actingUser?._id})`
              : 'unknown user'
            }. References and GridFS files cleanup attempted.`,
        });
      } catch (auditErr) {
        console.error('Error creating audit log for deleteProgram:', auditErr);
      }
      return res.json({
        message:
          'Program deleted successfully and references + GridFS files cleaned up (or attempted).',
        deleted: deletedProgram,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: 'Error deleting program.', error: err });
    }
  },

  // ✅
  addTeacherToProgram: async (req, res) => {
    const { userId, programId } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(programId)) {
        return res.status(400).json({ message: "Invalid userId or programId" });
      }
      const program = await db.Program.findById(programId);
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      if (program.teachers.includes(userId)) {
        return res.json({ message: "User is already a teacher for this program." });
      }
      await Promise.all([
        db.Program.findByIdAndUpdate(
          programId,
          { $addToSet: { teachers: userId } },
          { new: true }
        ),
        db.User.findByIdAndUpdate(
          userId,
          { $addToSet: { programsTeaching: programId } },
          { new: true }
        )
      ]);
      return res.json({ message: "Teacher added to program successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  },

  // ✅
  removeTeacherFromProgram: async (req, res) => {
    const { userId, programId } = req.params;
    try {
      // Validate ObjectIds
      if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(programId)) {
        return res.status(400).json({ message: "Invalid userId or programId" });
      }
      const [user, program] = await Promise.all([
        db.User.findById(userId),
        db.Program.findById(programId),
      ]);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      // Reverse of addTeacherToProgram: pull IDs from both arrays
      await Promise.all([
        db.Program.findByIdAndUpdate(
          programId,
          { $pull: { teachers: user?._id } },
          { new: true }
        ),
        db.User.findByIdAndUpdate(
          userId,
          { $pull: { programsTeaching: program._id } },
          { new: true }
        ),
      ]);
      return res.status(200).json({ message: "Teacher removed from program successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  },


  // ✅
  getAllTeachers: (req, res) => {
    const { programId } = req.params;
    db.Program.findById(programId)
      .populate("teachers") // teachers are User refs
      .then((program) => {
        if (!program) {
          return res
            .status(404)
            .json({ message: `Program with id ${programId} not found.` });
        }
        return res.json({
          programId: program._id,
          programName: program.programName,
          teachers: program.teachers, // populated User docs
        });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Error getting teachers.", error: err });
      });
  },

  // ✅
  getAllStudents: (req, res) => {
    const { programId } = req.params;
    db.Program.findById(programId)
      .populate("students.mailUser") // students.mailUser is a Mail ref
      .then((program) => {
        if (!program) {
          return res
            .status(404)
            .json({ message: `Program with id ${programId} not found.` });
        }
        return res.json({
          programId: program._id,
          programName: program.programName,
          students: program.students, // each has mailUser, startDate, endDate
        });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Error getting students.", error: err });
      });
  },

  // ✅
  getAllGraduates: (req, res) => {
    db.Program.find({})
      .populate("graduates.mailUser")
      .then((programs) => {
        const allGraduates = [];
        programs.forEach(program => {
          program.graduates.forEach(grad => {
            allGraduates.push({
              programId: program._id,
              programName: program.programName,
              ...grad.toObject()
            });
          });
        });
        return res.json({
          graduates: allGraduates
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          message: "Error getting graduates.",
          error: err
        });
      });
  },

  // ✅
  deleteLocation: async (req, res) => {
    const { locationId } = req.params;
    try {
      // 1. Delete the Location document
      const deletedLocation = await db.Location.findByIdAndDelete(locationId);
      if (!deletedLocation) {
        return res.status(404).json({ message: "Location not found." });
      }
      // 2. Best-effort: delete all additionalImages GridFS files
      if (Array.isArray(deletedLocation.additionalImages)) {
        for (const img of deletedLocation.additionalImages) {
          try {
            await deleteGridFsFileById(img.imageBucketName, img.imageFileId);
          } catch (err) {
            console.warn(
              "Failed to delete GridFS file for additionalImages entry",
              img.imageFileId,
              err.message
            );
          }
        }
      }
      // 3. Clean up all references in other collections
      await db.Program.updateMany(
        { location: locationId },
        { $pull: { location: locationId } }
      );
      await db.User.updateMany(
        { workLocation: locationId },
        { $pull: { workLocation: locationId } }
      );
      await db.Mail.updateMany(
        { programLocation: locationId },
        { $unset: { programLocation: "" } }
      );
      await db.Mail.updateMany(
        { livingLocation: locationId },
        { $pull: { livingLocation: locationId } }
      );
      await db.Event.updateMany(
        { upcomingEvent: locationId },
        { $pull: { upcomingEvent: locationId } }
      );
      return res.json({
        message: "Location deleted and all references cleaned up.",
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Error deleting location." });
    }
  },

  addAdditionalImagesPro: async (req, res) => {
    const { id } = req.params;
    const { additionalImages } = req.body;
    if (!additionalImages) {
      return res.status(400).json({ message: "additionalImages is required." });
    }
    try {
      const program = await db.Program.findById(id);
      if (!program) {
        return res.status(404).json({ message: "Program not found." });
      }
      let newImages = [];
      if (Array.isArray(additionalImages)) {
        newImages = additionalImages
          .map((img) => {
            if (!img) return null;
            return {
              link: (img.link || "").trim(),
              imageFileId: img.imageFileId || null,
              imageBucketName: img.imageBucketName || null,
              description: (img.description || "").trim(),
            };
          })
          .filter((img) => img && (img.link || img.imageFileId));
      } else {
        return res.status(400).json({
          message: "additionalImages must be an array.",
        });
      }
      // Remove duplicates within the incoming payload
      const seenNew = new Set();
      newImages = newImages.filter((img) => {
        const key = img.link || String(img.imageFileId);
        if (seenNew.has(key)) return false;
        seenNew.add(key);
        return true;
      });
      const existingImages = Array.isArray(program.additionalImages)
        ? program.additionalImages
        : [];
      // Merge existing + new without duplicating by link or imageFileId
      const imageMap = new Map();
      for (const img of existingImages) {
        const key = img.link || String(img.imageFileId);
        if (!key) continue;
        imageMap.set(key, img);
      }
      for (const img of newImages) {
        const key = img.link || String(img.imageFileId);
        const existing = imageMap.get(key);
        if (existing) {
          imageMap.set(key, {
            link: img.link || existing.link || "",
            imageFileId: img.imageFileId || existing.imageFileId || null,
            imageBucketName: img.imageBucketName || existing.imageBucketName || null,
            description: img.description || existing.description || "",
          });
        } else {
          imageMap.set(key, img);
        }
      }
      program.additionalImages = Array.from(imageMap.values());
      const updatedProgram = await program.save();
      return res.json({
        ...updatedProgram.toObject(),
        message: "Additional images added successfully!",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error adding additional images.",
      });
    }
  },

  removeAdditionalImages: async (req, res) => {
    const { id } = req.params;
    const { link, imageFileId } = req.body;
    if (!link && !imageFileId) {
      return res.status(400).json({
        message: "link or imageFileId is required."
      });
    }
    try {
      const program = await db.Program.findById(id);
      if (!program) {
        return res.status(404).json({ message: "Program not found." });
      }
      const existingImages = Array.isArray(program.additionalImages)
        ? program.additionalImages
        : [];
      const imageToDelete = existingImages.find((img) =>
        (link && img.link === link) ||
        (imageFileId &&
          img.imageFileId &&
          String(img.imageFileId) === String(imageFileId))
      );
      if (imageToDelete?.imageFileId) {
        await deleteGridFsFileById("images", imageToDelete.imageFileId);
      }
      const updatedImages = existingImages.filter((img) => {
        if (link && img.link === link) return false;
        if (
          imageFileId &&
          img.imageFileId &&
          String(img.imageFileId) === String(imageFileId)
        ) {
          return false;
        }
        return true;
      });
      program.additionalImages = updatedImages;
      const updatedProgram = await program.save();
      return res.json({
        ...updatedProgram.toObject(),
        message: "Selected image removed successfully!"
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error removing additional images."
      });
    }
  },

};

export default ProgramController;
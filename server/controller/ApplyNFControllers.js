import db from "../db/index.js";

const applyNFControllers = {

  // ✅
  addApplication: async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      applyingMentor,
      applyingVolunteer,
      fullOrPart,
      startDate,
    } = req.body;
    // Regex patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usPhoneRegex =
      /^(?:\+?1[\s-]?)?(?:\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;
    try {
      // Normalize email: trim + lowercase
      const normalizedEmail = typeof email === "string"
        ? email.trim().toLowerCase()
        : "";
      // Basic presence check (optional, but usually desired)
      if (!normalizedEmail || !phone) {
        return res
          .status(400)
          .json({ message: "Email and phone are required." });
      }
      // Validate email format
      if (!emailRegex.test(normalizedEmail)) {
        return res
          .status(400)
          .json({ message: "Please provide a valid email address." });
      }
      // Validate US phone format
      if (!usPhoneRegex.test(phone)) {
        return res
          .status(400)
          .json({ message: "Please provide a valid US phone number." });
      }
      const newApplication = new db.AppNF({
        firstName,
        lastName,
        email: normalizedEmail, // store normalized email
        phone,
        applyingMentor,
        applyingVolunteer,
        fullOrPart,
        startDate,
        // status, timestamps, etc. will use schema defaults
      });
      const savedApplication = await newApplication.save();
      return res.status(201).json({
        ...savedApplication.toObject(),
        message: "Volunteer application created successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Error creating volunteer application" });
    }
  },

  // ✅
  // Basic update for a volunteer application
  updateApplication: async (req, res) => {
    const { id } = req.params;
    let {
      firstName,
      lastName,
      email,
      phone,
      applyingMentor,
      applyingVolunteer,
      fullOrPart,
      startDate,
    } = req.body;
    // Regex patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usPhoneRegex =
      /^(?:\+?1[\s-]?)?(?:\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;
    try {
      const application = await db.AppNF.findById(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      // Normalize & validate email if provided
      if (email !== undefined) {
        const normalizedEmail =
          typeof email === "string" ? email.trim().toLowerCase() : "";
        if (!normalizedEmail) {
          return res
            .status(400)
            .json({ message: "Email cannot be empty if provided." });
        }
        if (!emailRegex.test(normalizedEmail)) {
          return res
            .status(400)
            .json({ message: "Please provide a valid email address." });
        }
        application.email = normalizedEmail;
      }
      // Validate phone if provided
      if (phone !== undefined) {
        if (!phone) {
          return res
            .status(400)
            .json({ message: "Phone cannot be empty if provided." });
        }
        if (!usPhoneRegex.test(phone)) {
          return res
            .status(400)
            .json({ message: "Please provide a valid US phone number." });
        }
        application.phone = phone;
      }
      // Only update other fields if they are provided
      if (firstName !== undefined) application.firstName = firstName;
      if (lastName !== undefined) application.lastName = lastName;
      if (applyingMentor !== undefined)
        application.applyingMentor = applyingMentor;
      if (applyingVolunteer !== undefined)
        application.applyingVolunteer = applyingVolunteer;
      if (fullOrPart !== undefined) application.fullOrPart = fullOrPart;
      if (startDate !== undefined) application.startDate = startDate;
      const savedApplication = await application.save();
      return res.status(200).json({
        ...savedApplication.toObject(),
        message: "Volunteer application updated successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Error updating volunteer application" });
    }
  },

  // ✅
  deleteApplication: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedApplication = await db.AppNF.findByIdAndDelete(id);
      if (!deletedApplication) {
        return res.status(404).json({ message: "Application not found" });
      }
      return res.status(200).json({
        ...deletedApplication.toObject(),
        message: "Volunteer application deleted successfully!",
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Error deleting volunteer application" });
    }
  },

  // ✅
  addApplicationReview: async (req, res) => {
    const { id } = req.params;
    const {
      userId,
      name,
      role,
      comment,
      status, // optional status change
    } = req.body;
    try {
      const application = await db.AppNF.findById(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      // Add a new review entry
      application.reviewedBy.push({
        userId,
        name,
        role,
        comment,
        // createdAt will default from schema
      });
      // Optionally update overall status if provided
      if (status !== undefined) {
        application.status = status;
      }
      const savedApplication = await application.save();
      return res.status(200).json({
        ...savedApplication.toObject(),
        message: "Review added and application updated successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Error adding review to application" });
    }
  },

  // ✅
  addApplicationInterview: async (req, res) => {
    const { id } = req.params;
    const {
      scheduledAt,
      interviewer,
      location,
      locationId,
      type,
      notes,
      applicationStatus, // interview-level status (per schema)
    } = req.body;
    try {
      const application = await db.AppNF.findById(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      // Push interview subdocument that matches the schema
      application.interviews.push({
        scheduledAt,
        interviewer,
        location,
        locationId,
        type,              // must be "phone" | "video" | "onsite" if provided
        notes,
        applicationStatus, // if omitted, defaults to "scheduled" per schema
        // createdAt will use schema default
      });
      // Set the overall application status
      application.status = "interview_scheduled";
      const savedApplication = await application.save();
      return res.status(200).json({
        ...savedApplication.toObject(),
        message: "Interview added and application updated successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Error adding interview to application" });
    }
  },

  // ✅   
  updateApplicationStatus: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const application = await db.AppNF.findById(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      // Set the new status (Mongoose will validate enum)
      application.status = status;
      const savedApplication = await application.save();
      return res.status(200).json({
        ...savedApplication.toObject(),
        message: "Application status updated successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Error updating application status" });
    }
  },

// ✅  
  addWorkEthicNote: async (req, res) => {
    const { id } = req.params;
    const {
      userId,
      referringEmployment,
      // workDone removed on purpose – added via separate flow
    } = req.body;
    try {
      const application = await db.AppNF.findById(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      application.workEthicNotes.push({
        userId,
        referringEmployment,
        // no workDone here
      });
      const savedApplication = await application.save();
      return res.status(200).json({
        ...savedApplication.toObject(),
        message: "Work ethic note added successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Error adding work ethic note" });
    }
  },

  // ✅  
  updateWorkEthicNote: async (req, res) => {
    const { id, noteId } = req.params;
    const {
      userId,
      referringEmployment,
      workDone, // optional; if provided, replaces the existing array
    } = req.body;
    try {
      const application = await db.AppNF.findById(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      // Find the specific workEthicNotes subdocument
      const note = application.workEthicNotes.id(noteId);
      if (!note) {
        return res.status(404).json({ message: "Work ethic note not found" });
      }
      // Only update fields that are provided
      if (userId !== undefined) {
        note.userId = userId;
      }
      if (referringEmployment !== undefined) {
        note.referringEmployment = referringEmployment;
      }
      if (workDone !== undefined) {
        // Replace the entire workDone array with the one from req.body
        note.workDone = workDone;
      }
      const savedApplication = await application.save();
      return res.status(200).json({
        ...savedApplication.toObject(),
        message: "Work ethic note updated successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Error updating work ethic note" });
    }
  },

  // ✅  
  addWorkDoneEntry: async (req, res) => {
    const { id, noteId } = req.params;
    const {
      userWhoMadeJobPlacement,
      placement,
      hours,
      goodJobConducted,
      commentAboutJob,
    } = req.body;
    try {
      const application = await db.AppNF.findById(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      const note = application.workEthicNotes.id(noteId);
      if (!note) {
        return res.status(404).json({ message: "Work ethic note not found" });
      }
      note.workDone.push({
        userWhoMadeJobPlacement,
        placement,
        hours,
        goodJobConducted,
        commentAboutJob,
      });
      const savedApplication = await application.save();
      return res.status(200).json({
        ...savedApplication.toObject(),
        message: "Work done entry added successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Error adding work done entry" });
    }
  },

  // ✅  
  updateWorkDoneEntry: async (req, res) => {
    const { id, noteId, workDoneId } = req.params;
    const {
      placement,
      hours,
      goodJobConducted,
      commentAboutJob,
    } = req.body;
    try {
      const application = await db.AppNF.findById(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      const note = application.workEthicNotes.id(noteId);
      if (!note) {
        return res.status(404).json({ message: "Work ethic note not found" });
      }
      const workDoneEntry = note.workDone.id(workDoneId);
      if (!workDoneEntry) {
        return res.status(404).json({ message: "Work done entry not found" });
      }
      // Only update fields that are provided
      if (placement !== undefined) {
        workDoneEntry.placement = placement;
      }
      if (hours !== undefined) {
        workDoneEntry.hours = hours;
      }
      if (goodJobConducted !== undefined) {
        workDoneEntry.goodJobConducted = goodJobConducted;
      }
      if (commentAboutJob !== undefined) {
        workDoneEntry.commentAboutJob = commentAboutJob;
      }
      const savedApplication = await application.save();
      return res.status(200).json({
        ...savedApplication.toObject(),
        message: "Work done entry updated successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Error updating work done entry" });
    }
  },

// ✅ 
deleteWorkDoneEntry: async (req, res) => {
  const { id, noteId, workDoneId } = req.params;
  try {
    const application = await db.AppNF.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    const note = application.workEthicNotes.id(noteId);
    if (!note) {
      return res.status(404).json({ message: "Work ethic note not found" });
    }
    const workDoneEntry = note.workDone.id(workDoneId);
    if (!workDoneEntry) {
      return res.status(404).json({ message: "Work done entry not found" });
    }
    // Remove the subdocument from the array
    workDoneEntry.deleteOne(); // equivalent to note.workDone.pull(workDoneId)
    const savedApplication = await application.save();
    return res.status(200).json({
      ...savedApplication.toObject(),
      message: "Work done entry deleted successfully!",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error deleting work done entry" });
  }
},

  // ✅ 
  getAllApplications: async (req, res) => {
    try {
      const applications = await db.AppNF.find({})
        // optionally sort newest first if you use timestamps
        .sort({ createdAt: -1 })
        .exec();
      return res.status(200).json({
        count: applications.length,
        applications,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error fetching volunteer applications",
      });
    }
  },

};

export default applyNFControllers;
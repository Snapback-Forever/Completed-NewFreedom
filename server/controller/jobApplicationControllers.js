import db from "../db/index.js";

const jobApplicationController = {

  // ✅
  addJobListing: async (req, res) => {
    const {
      userId,
      title,
      location,
      description,
      requirements,
      responsibilities,
      jobType,
      seniority,
      salaryMin,
      salaryMax,
      isActive,
      salaryCurrency,      // optional, will default to "USD"
    } = req.body;
    try {
      const newJobListing = new db.JobList({
        userId,
        title,
        location,
        description,
        requirements,
        responsibilities,
        jobType,
        seniority,
        salaryMin,
        salaryMax,
        isActive,
        salaryCurrency,     // optional
        // applicationsAttached will default to []
      });
      const savedJobListing = await newJobListing.save();
      return res.status(201).json({
        ...savedJobListing.toObject(),
        message: "Job listing created successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error creating job listing" });
    }
  },

  getSingleJobListing: async (req, res) => {
    const { id } = req.params; // assuming route: /job-listings/:id
    try {
      const job = await db.JobList.findById(id)
        .populate("userId")
        .populate("applicationsAttached");
      if (!job) {
        return res.status(404).json({
          message: "Job listing not found.",
        });
      }
      return res.json(job);
    } catch (err) {
      console.error(err);
      // covers invalid ObjectId and other errors
      return res.status(500).json({
        message: "Error fetching job listing.",
        error: err,
      });
    }
  },

  // ✅
  getAllJobListings: (req, res) => {
    db.JobList.find()
      .populate("userId")              // if you want to expand the listing owner
      .populate("applicationsAttached") // if JobApp is referenced here
      .then((data) => {
        if (!data || data.length === 0) {
          return res.json({
            message: "There are no job listings in the database.",
          });
        }
        return res.json(data);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          message: "Error fetching job listings.",
          error: err,
        });
      });
  },

  // ✅
  updateJobListing: async (req, res) => {
    const { jobListingId } = req.params;
    const {
      // userId,  // <-- not updatable here
      title,
      location,
      description,
      requirements,
      responsibilities,
      jobType,
      seniority,
      salaryMin,
      salaryMax,
      isActive,
    } = req.body;
    try {
      // 1. Find the existing job listing by id
      const jobListing = await db.JobList.findById(jobListingId);
      if (!jobListing) {
        return res.status(404).json({
          message: `Job listing with id ${jobListingId} not found.`,
        });
      }
      // 2. Update only the fields that were provided
      if (title !== undefined) jobListing.title = title;
      if (location !== undefined) jobListing.location = location;
      if (description !== undefined) jobListing.description = description;
      if (requirements !== undefined) jobListing.requirements = requirements;
      if (responsibilities !== undefined) jobListing.responsibilities = responsibilities;
      if (jobType !== undefined) jobListing.jobType = jobType;
      if (seniority !== undefined) jobListing.seniority = seniority;
      if (salaryMin !== undefined) jobListing.salaryMin = salaryMin;
      if (salaryMax !== undefined) jobListing.salaryMax = salaryMax;
      if (isActive !== undefined) jobListing.isActive = isActive;
      // 3. Save to trigger full Mongoose validation and middleware
      const updatedJobListing = await jobListing.save();
      return res.json({
        ...updatedJobListing.toObject(),
        message: "Job listing updated successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({
        message: "Error updating job listing",
      });
    }
  },

  // ✅
  deleteJobListingAndApplications: async (req, res) => {
    const { jobId } = req.params; // this is the _id of JobList
    try {
      // 1. Delete the JobList document
      const deletedJob = await db.JobList.findByIdAndDelete(jobId);
      if (!deletedJob) {
        return res.status(404).json({
          message: `Job listing with id ${jobId} not found.`,
        });
      }
      // 2. Delete all JobApp docs that reference this job
      const deleteResult = await db.JobApp.deleteMany({ jobId });
      return res.json({
        message: "Job listing and related applications deleted successfully.",
        deletedJob: deletedJob.toObject(),
        deletedApplicationsCount: deleteResult.deletedCount,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error deleting job listing and applications.",
      });
    }
  },


  // JOB APPLICATION CONTROLLERS
  // ✅ status is set to "submitted"
  addJobApplicationToJob: async (req, res) => {
    const { jobId } = req.params;
    let {
      firstName,
      lastName,
      email,
      phone,
      resumeUrl,
      resumeFileId,
      resumeBucketName,
      coverLetter,
      resume,
    } = req.body;
  
    try {
      const usPhoneRegex =
        /^(?:\+?1[\s-]?)?(?:\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      // Normalize empty strings
      if (resumeFileId === "") resumeFileId = null;
      if (resumeBucketName === "") resumeBucketName = null;
      if (resumeUrl === "") resumeUrl = null;
  
      if (typeof email === "string") {
        email = email.trim().toLowerCase();
      }
  
      if (typeof phone === "string") {
        phone = phone.trim();
      }
  
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
  
      if (!phone || !usPhoneRegex.test(phone)) {
        return res.status(400).json({ message: "Invalid US phone number format" });
      }
  
      const job = await db.JobList.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
  
      const newJobApplication = new db.JobApp({
        jobId,
        firstName,
        lastName,
        email,
        phone,
        resumeUrl,
        resumeFileId,
        resumeBucketName,
        coverLetter,
        resume,
  
        // explicitly mark as unseen when created
        seenByAuthor: false,
        seenAt: null,
        seenByUserId: null,
      });
  
      const savedJobApplication = await newJobApplication.save();
  
      await db.JobList.findByIdAndUpdate(
        jobId,
        { $addToSet: { applicationsAttached: savedJobApplication._id } },
        { new: true }
      );
  
      return res.json({
        ...savedJobApplication.toObject(),
        message: "Job application created successfully!",
      });
    } catch (err) {
      console.error(err);
  
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
  
      return res.status(500).json({ message: "Error creating job application" });
    }
  },
  

  toggleJobApplicationSeenStatus: async (req, res) => {
    const { applicationId } = req.params;
  
    try {
      const application = await db.JobApp.findById(applicationId);
  
      if (!application) {
        return res.status(404).json({
          message: "Job application not found",
        });
      }
  
      // Flip the boolean
      application.seenByAuthor = !application.seenByAuthor;
  
      // If now seen, add date and user
      if (application.seenByAuthor) {
        application.seenAt = new Date();
        application.seenByUserId = req.user?._id || null;
      } else {
        // If now unseen, clear date and user
        application.seenAt = null;
        application.seenByUserId = null;
      }
  
      const updatedApplication = await application.save();
  
      return res.status(200).json({
        message: application.seenByAuthor
          ? "Application marked as seen"
          : "Application marked as unseen",
        application: updatedApplication,
      });
    } catch (err) {
      console.error(err);
  
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
  
      return res.status(500).json({
        message: "Error toggling application seen status",
      });
    }
  },
  

  // ✅ 
  addReviewerToJobApplication: async (req, res) => {
    const { jobAppId } = req.params;
    const { userId, comment } = req.body;
  
    if (!userId) {
      return res.status(400).json({ message: "You must provide a 'userId' for the reviewer." });
    }
  
    try {
      const user = await db.User.findById(userId).select("accountName staffPosition");
  
      if (!user) {
        return res.status(404).json({ message: `User with id ${userId} not found.` });
      }
  
      const reviewerToAdd = {
        userId: user._id,
        name: user.accountName,
        role: user.staffPosition,
        comment,
      };
  
      const updatedJobApp = await db.JobApp.findByIdAndUpdate(
        jobAppId,
        {
          $push: { reviewedBy: reviewerToAdd },
          $set: { status: "in_review" },
        },
        { new: true, runValidators: true }
      );
  
      if (!updatedJobApp) {
        return res.status(404).json({ message: `Job application with id ${jobAppId} not found.` });
      }
  
      return res.json({
        ...updatedJobApp.toObject(),
        message: "Reviewer added successfully!",
      });
    } catch (err) {
      console.error(err);
  
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
  
      return res.status(500).json({ message: "Error adding reviewer to job application" });
    }
  },
  

  // ✅ 
  updateJobApplicationStatus: async (req, res) => {
    const { jobAppId } = req.params;
    const { status } = req.body;

    // console.log("status", status);
    // console.log("hello");
    // Require status
    if (typeof status === "undefined") {
      return res.status(400).json({
        message: "Status is required to update the job application.",
      });
    }
    // Local whitelist to fail fast
    const allowedStatuses = [
      "submitted",
      "in_review",
      "interview scheduled",
      "rejected",
      "hired",
    ];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
      });
    }
    try {
      const updatedJobApp = await db.JobApp.findByIdAndUpdate(
        jobAppId,
        { $set: { status } },
        {
          new: true,
          runValidators: true, // also enforces the enum in the schema
        }
      );
      if (!updatedJobApp) {
        return res.status(404).json({
          message: `Job application with id ${jobAppId} not found.`,
        });
      }
      return res.json({
        ...updatedJobApp.toObject(),
        message: "Job application status updated successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({
        message: "Error updating job application status",
      });
    }
  },

  // ✅ 
  deleteJobApplicationsByJob: async (req, res) => {
    const { jobAppId } = req.params;
    try {
      // 1. Find and delete the single JobApp
      const deletedApp = await db.JobApp.findByIdAndDelete(jobAppId);
      if (!deletedApp) {
        return res.status(404).json({
          message: `Job application with id ${jobAppId} not found.`,
        });
      }
      // 2. Remove this application from the related JobList.applicationsAttached
      // assuming JobApp has a jobId field that references JobList
      await db.JobList.findByIdAndUpdate(
        deletedApp.jobId,                 // the JobList this app belonged to
        { $pull: { applicationsAttached: deletedApp._id } },
        { new: true }
      );
      return res.json({
        message: "Job application deleted successfully.",
        deletedApplicationId: deletedApp._id,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error deleting job application.",
      });
    }
  },

  getSingleJobApplication: async (req, res) => {
    const { applicationId } = req.params; // assuming route: /jobs/:jobId/applications/:applicationId
    try {
      if (!applicationId) {
        return res.status(400).json({ message: "applicationId is required" });
      }
      const application = await db.JobApp.findById(applicationId)
        // Uncomment if you have refs on JobApp
        // .populate("jobId")
        // .populate("reviewedBy")
        // .populate("interviews")
        .exec();
      if (!application) {
        return res.status(404).json({
          message: "Job application not found",
        });
      }
      return res.json(application);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error fetching job application",
        error: err,
      });
    }
  },

  getSingleJobApplicationsToJob: async (req, res) => {
    const { jobId, applicationId } = req.params;
    try {
      if (!jobId) {
        return res.status(400).json({ message: "jobId is required" });
      }
      if (!applicationId) {
        return res.status(400).json({ message: "applicationId is required" });
      }
      // Ensure the application belongs to this job
      const application = await db.JobApp.findOne({
        _id: applicationId,
        jobId: jobId,
      })
        // optionally populate any refs
        // .populate("reviewedBy")
        // .populate("interviews")
        .exec();
      if (!application) {
        return res.status(404).json({
          message: "Job application not found for this job",
        });
      }
      return res.json(application);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error fetching job application for this job",
      });
    }
  },

  // ✅ 
  getAllJobApplicationsToJob: async (req, res) => {
    const { jobId } = req.params; // or req.body, depending on your route
    try {
      if (!jobId) {
        return res.status(400).json({ message: "jobId is required" });
      }
      // Get all job applications that reference this jobId
      const applications = await db.JobApp.find({ jobId })
        // optionally populate any refs (uncomment if you have refs)
        // .populate("reviewedBy")
        // .populate("interviews")
        .exec();
      return res.json({
        jobId,
        count: applications.length,
        applications,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error fetching job applications for this job",
      });
    }
  },

  // ✅
  addInterviewToJobApplication: async (req, res) => {
    const { jobAppId } = req.params;
    const { scheduledAt, interviewer, locationId, type, notes, status } = req.body;
  
    if (!scheduledAt || !interviewer || !locationId) {
      return res.status(400).json({ message: "You must provide 'scheduledAt', 'interviewer', and 'locationId' for the interview." });
    }
  
    const scheduledDate = new Date(scheduledAt);
    const now = new Date();
  
    if (isNaN(scheduledDate.getTime())) {
      return res.status(400).json({ message: "'scheduledAt' must be a valid date." });
    }
  
    if (scheduledDate <= now) {
      return res.status(400).json({ message: "Interview date must be in the future." });
    }
  
    try {
      const location = await db.Location.findById(locationId).select("locationName name");
      if (!location) {
        return res.status(404).json({ message: `Location with id ${locationId} not found.` });
      }
  
      const interviewToAdd = {
        scheduledAt: scheduledDate,
        interviewer,
        locationId: location._id,
        location: location.locationName || location.name,
        type,
        notes,
        status,
      };
  
      const updatedJobApp = await db.JobApp.findByIdAndUpdate(
        jobAppId,
        {
          $push: { interviews: interviewToAdd },
          $set: { status: "interview scheduled" },
        },
        { new: true, runValidators: true }
      );
  
      if (!updatedJobApp) {
        return res.status(404).json({ message: `Job application with id ${jobAppId} not found.` });
      }
  
      return res.json({
        ...updatedJobApp.toObject(),
        message: "Interview added successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error adding interview to job application" });
    }
  },
  
  

  // ✅
  updateInterviewToJobApplication: async (req, res) => {
    const { jobAppId, interviewId } = req.params;
    const { scheduledAt, interviewer, locationId, type, notes, status } = req.body;
  
    try {
      const jobApp = await db.JobApp.findById(jobAppId);
      if (!jobApp) {
        return res.status(404).json({ message: `Job application with id ${jobAppId} not found.` });
      }
  
      const interview = jobApp.interviews.id(interviewId);
      if (!interview) {
        return res.status(404).json({ message: `Interview with id ${interviewId} not found on this job application.` });
      }
  
      if (typeof scheduledAt !== "undefined") {
        const scheduledDate = new Date(scheduledAt);
        const now = new Date();
  
        if (isNaN(scheduledDate.getTime())) {
          return res.status(400).json({ message: "'scheduledAt' must be a valid date." });
        }
  
        if (scheduledDate <= now) {
          return res.status(400).json({ message: "Interview date must be in the future." });
        }
  
        interview.scheduledAt = scheduledDate;
      }
  
      if (typeof interviewer !== "undefined") {
        interview.interviewer = interviewer;
      }
  
      if (typeof locationId !== "undefined") {
        const location = await db.Location.findById(locationId).select("locationName name");
        if (!location) {
          return res.status(404).json({ message: `Location with id ${locationId} not found.` });
        }
  
        interview.locationId = location._id;
        interview.location = location.locationName || location.name;
      }
  
      if (typeof type !== "undefined") {
        interview.type = type;
      }
  
      if (typeof notes !== "undefined") {
        interview.notes = notes;
      }
  
      if (typeof status !== "undefined") {
        interview.status = status;
      }
  
      const savedJobApp = await jobApp.save();
  
      return res.json({
        ...savedJobApp.toObject(),
        message: "Interview updated successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error updating interview" });
    }
  },
  

  // ✅
  getAllInterviews: async (req, res) => {
    try {
      const results = await db.JobApp.aggregate([
        {
          // only job apps that have at least one interview
          $match: {
            interviews: { $exists: true, $ne: [] },
          },
        },
        {
          // one document per interview
          $unwind: "$interviews",
        },
        {
          // shape each document: include job app info + interview info
          $project: {
            _id: 0,
            jobAppId: "$_id",
            positionTitle: 1,
            company: 1,
            jobAppStatus: "$status",
            interview: "$interviews",
          },
        },
        {
          // optional: sort by interview date
          $sort: { "interview.scheduledAt": 1 },
        },
      ]);
      return res.json({
        data: results,
        message: "All interviews retrieved successfully.",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error retrieving interviews.",
      });
    }
  },

  getSingleInterview: async (req, res) => {
    const { jobAppId, interviewId } = req.params;
    // e.g. route: /job-applications/:jobAppId/interviews/:interviewId
    try {
      if (!jobAppId) {
        return res.status(400).json({ message: "jobAppId is required" });
      }
      if (!interviewId) {
        return res.status(400).json({ message: "interviewId is required" });
      }
      // Get the job application that owns this interview
      const jobApp = await db.JobApp.findById(jobAppId).exec();
      if (!jobApp) {
        return res.status(404).json({ message: "Job application not found." });
      }
      if (!jobApp.interviews || jobApp.interviews.length === 0) {
        return res.status(404).json({ message: "No interviews found for this job application." });
      }
      // Find the specific interview in the array
      const interview = jobApp.interviews.id(interviewId); // works if interviews is a subdocument array
      if (!interview) {
        return res.status(404).json({
          message: "Interview not found for this job application.",
        });
      }
      // Shape response similar to getAllInterviews (optional)
      return res.json({
        jobAppId: jobApp._id,
        positionTitle: jobApp.positionTitle,
        company: jobApp.company,
        jobAppStatus: jobApp.status,
        interview,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error retrieving interview.",
      });
    }
  },



  searchJobs: async (req, res) => {
    try {
      const { q } = req.query;
      console.log("q:", q);
  
      if (!q || !q.trim()) {
        const results = await db.JobList.find({}).lean();
        return res.status(200).json({
          message: "All job listings returned.",
          count: results.length,
          results,
        });
      }
  
      const raw = q.trim();
      const term = raw.toLowerCase();
  
      const orConditions = [];
  
      const escapeRegex = (str) =>
        str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  
      const regexCond = (field, safe) => ({
        [field]: { $regex: safe, $options: "i" },
      });
  
      const safe = escapeRegex(term);
  
      const termNoSpaces = term.replace(/\s+/g, "");
      if (termNoSpaces.length > 0) {
        orConditions.push(
          regexCond("jobType", escapeRegex(termNoSpaces))
        );
      }
  
      orConditions.push(
        regexCond("title", safe),
        regexCond("description", safe),
        regexCond("location", safe),
        regexCond("jobType", safe),
        regexCond("seniority", safe),
        regexCond("salaryCurrency", safe),
        regexCond("salaryMin", safe),
        regexCond("salaryMax", safe)
      );
  
      orConditions.push(
        { requirements: { $regex: safe, $options: "i" } },
        { responsibilities: { $regex: safe, $options: "i" } }
      );
  
      const filter = {
        $or: orConditions,
      };
  
      const results = await db.JobList.find(filter).lean();
  
      if (!results.length) {
        return res.status(200).json({
          message: `No Job Listings Found With "${raw}"`,
          count: 0,
          results: [],
        });
      }
  
      return res.status(200).json({
        message: `Found ${results.length} job listing(s) matching "${raw}"`,
        count: results.length,
        results,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error searching job listings" });
    }
  },
  
  
  

}

export default jobApplicationController
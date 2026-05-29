import db from "../db/index.js";
import mongoose from "mongoose";

const menteeController = {

  // ✅
  addMailUser: async (req, res) => {
    try {
      const {
        menteeImage,
        menteeImageFileId,
        menteeImageBucketName,
        inmateNumbers,
        firstName,
        lastName,
        currentLocation,
        sex,
        email: rawEmail,
        phoneNumber: rawPhoneNumber,
        dateOfBirth,
        projectedReleaseDate,
        maxReleaseDate,
        currentCharge,
        currentInsurance,
        lastContact,
        completedRequiredPaperwork,
        status,
        programStatus,
      } = req.body;
      // 1) Normalize and validate email
      let email = rawEmail;
      if (email != null) {
        email = email.toLowerCase().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.length > 0 && !emailRegex.test(email)) {
          return res.status(400).json({ message: "Invalid email format" });
        }
      }
      // 2) Normalize and validate US phone number (optional)
      let phoneNumber = rawPhoneNumber;
      if (phoneNumber != null) {
        // remove leading/trailing spaces
        phoneNumber = phoneNumber.trim();
        // remove all remaining spaces inside the string
        phoneNumber = phoneNumber.replace(/\s+/g, "");
        const usPhoneRegex = /^(?:\+?1[\s-]?)?(?:\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;
        if (phoneNumber.length > 0 && !usPhoneRegex.test(phoneNumber)) {
          return res
            .status(400)
            .json({ message: "Invalid phone number format" });
        }
      }
      // 3) Validate inmateNumbers uniqueness by (state, number) across all Mail docs
      if (Array.isArray(inmateNumbers) && inmateNumbers.length > 0) {
        // Optionally, also check for duplicates in the payload itself
        const seen = new Set();
        for (const entry of inmateNumbers) {
          if (!entry || !entry.number || !entry.state) continue;
          const key = `${entry.state}::${entry.number}`;
          if (seen.has(key)) {
            return res.status(400).json({
              message:
                "Duplicate inmate number/state combination in request body.",
            });
          }
          seen.add(key);
        }
        // For each inmateNumber in the request, check if it is already used
        for (const entry of inmateNumbers) {
          if (!entry || !entry.number || !entry.state) continue;
          const existing = await db.Mail.findOne({
            inmateNumbers: {
              $elemMatch: {
                number: entry.number,
                state: entry.state,
              },
            },
          }).lean();
          if (existing) {
            return res.status(400).json({
              message: `Inmate number ${entry.number} is already used in state ${entry.state}.`,
            });
          }
        }
      }
      // 4) Create the new Mail document
      const newMailUser = new db.Mail({
        menteeImage,
        menteeImageFileId,
        menteeImageBucketName,
        inmateNumbers,
        firstName,
        lastName,
        currentLocation,
        sex,
        email,
        phoneNumber,
        dateOfBirth,
        projectedReleaseDate,
        maxReleaseDate,
        currentCharge,
        currentInsurance,
        lastContact,
        completedRequiredPaperwork,
        status,
        programStatus,
      });
      const savedMailUser = await newMailUser.save();
      return res.json({
        ...savedMailUser.toObject(),
        message: "Mail user created successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error creating mail user" });
    }
  },


  // ✅ 
  // UPDATE - Update a mailing list entry by id
  updateMailEntry: async (req, res) => {
    const { mailId } = req.params;
    const {
      menteeImage,
      menteeImageFileId,
      menteeImageBucketName,
      programLocation,
      inmateNumbers,
      firstName,
      lastName,
      currentLocation,
      sex,
      email: rawEmail,
      phoneNumber: rawPhoneNumber,
      dateOfBirth,
      projectedReleaseDate,
      maxReleaseDate,
      currentCharge,
      currentInsurance,
      lastContact,
      status,
      programStatus,
      userId,
    } = req.body || {};

    try {
      const mailDoc = await db.Mail.findById(mailId);
      if (!mailDoc) {
        return res
          .status(404)
          .json({ message: `Mail entry with id ${mailId} not found.` });
      }
      let email = rawEmail;
      if (email != null) {
        email = email.toLowerCase().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.length > 0 && !emailRegex.test(email)) {
          return res.status(400).json({ message: "Invalid email format" });
        }
      }
      let phoneNumber = rawPhoneNumber;
      if (phoneNumber != null) {
        phoneNumber = phoneNumber.trim().replace(/\s+/g, "");
        const usPhoneRegex =
          /^(?:\+?1[\s-]?)?(?:\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;
        if (phoneNumber.length > 0 && !usPhoneRegex.test(phoneNumber)) {
          return res
            .status(400)
            .json({ message: "Invalid phone number format" });
        }
      }
      if (Array.isArray(inmateNumbers) && inmateNumbers.length > 0) {
        const seen = new Set();
        for (const entry of inmateNumbers) {
          if (!entry || !entry.number || !entry.state) continue;
          const key = `${entry.state}::${entry.number}`;
          if (seen.has(key)) {
            return res.status(400).json({
              message:
                "Duplicate inmate number/state combination in request body.",
            });
          }
          seen.add(key);
        }
        for (const entry of inmateNumbers) {
          if (!entry || !entry.number || !entry.state) continue;
          const conflict = await db.Mail.findOne({
            _id: { $ne: mailId },
            inmateNumbers: {
              $elemMatch: {
                number: entry.number,
                state: entry.state,
              },
            },
          }).lean();
          if (conflict) {
            return res.status(400).json({
              message: `Inmate number ${entry.number} is already used in state ${entry.state}.`,
            });
          }
        }
      }
      const nonCustodyStatuses = [
        "attendingProgram",
        "Did-Not-Arrive",
        "removedFromProgram",
        "quitProgram",
        "completedProgram",
      ];
      const isRemovalStatus =
        programStatus === "removedFromProgram" ||
        programStatus === "quitProgram" ||
        programStatus === "completedProgram";
      const isLeavingLocation =
        programStatus === "removedFromProgram" ||
        programStatus === "quitProgram";
      const isRejectedStatus =
        programStatus === "removedFromProgram" ||
        programStatus === "quitProgram";
      if (programStatus === "incarcerated") {
        if (!projectedReleaseDate || !maxReleaseDate) {
          return res.status(400).json({
            message:
              "When programStatus is 'incarcerated', projectedReleaseDate and maxReleaseDate are required.",
          });
        }
      }
      // Field updates
      if (menteeImage !== undefined) mailDoc.menteeImage = menteeImage;
      // NEW fields hooked into controller
      if (menteeImageFileId !== undefined) {
        mailDoc.menteeImageFileId = menteeImageFileId;
      }
      if (menteeImageBucketName !== undefined) {
        mailDoc.menteeImageBucketName = menteeImageBucketName;
      }
      if (programLocation !== undefined)
        mailDoc.programLocation = programLocation;
      if (inmateNumbers !== undefined) mailDoc.inmateNumbers = inmateNumbers;
      if (firstName !== undefined) mailDoc.firstName = firstName;
      if (lastName !== undefined) mailDoc.lastName = lastName;
      if (currentLocation !== undefined)
        mailDoc.currentLocation = currentLocation;
      if (sex !== undefined) mailDoc.sex = sex;
      if (rawEmail !== undefined) mailDoc.email = email;
      if (rawPhoneNumber !== undefined) mailDoc.phoneNumber = phoneNumber;
      if (dateOfBirth !== undefined) mailDoc.dateOfBirth = dateOfBirth;
      if (projectedReleaseDate !== undefined)
        mailDoc.projectedReleaseDate = projectedReleaseDate;
      if (maxReleaseDate !== undefined) mailDoc.maxReleaseDate = maxReleaseDate;
      if (currentCharge !== undefined) mailDoc.currentCharge = currentCharge;
      if (currentInsurance !== undefined)
        mailDoc.currentInsurance = currentInsurance;
      if (lastContact !== undefined) mailDoc.lastContact = lastContact;
      if (status !== undefined) mailDoc.status = status;
      if (programStatus !== undefined && programStatus !== mailDoc.programStatus) {
        mailDoc.programStatus = programStatus;
        if (nonCustodyStatuses.includes(programStatus)) {
          mailDoc.projectedReleaseDate = undefined;
          mailDoc.maxReleaseDate = undefined;
        }
        if (isRemovalStatus) {
          if (programStatus === "removedFromProgram") {
            mailDoc.status = "removedFromProgram";
          } else if (programStatus === "quitProgram") {
            mailDoc.status = "quitProgram";
          } else if (programStatus === "completedProgram") {
            mailDoc.status = "completed";
          }
          const message =
            programStatus === "quitProgram" ||
              programStatus === "completedProgram"
              ? "completed program"
              : "removed from program";
          mailDoc.lastContact = `User ${message}`;
        }
        if (
          isLeavingLocation &&
          Array.isArray(mailDoc.livingLocation) &&
          mailDoc.livingLocation.length > 0
        ) {
          await db.Location.updateMany(
            { _id: { $in: mailDoc.livingLocation } },
            {
              $pull: { locationMentee: mailDoc._id },
              $inc: { currentCapacity: 1 },
            }
          );
        }
        if (
          programStatus === "completedProgram" &&
          Array.isArray(mailDoc.livingLocation) &&
          mailDoc.livingLocation.length > 0
        ) {
          await db.Location.updateMany(
            { _id: { $in: mailDoc.livingLocation } },
            {
              $pull: { locationMentee: mailDoc._id },
              $inc: { currentCapacity: 1 },
            }
          );
          mailDoc.livingLocation = [];
        }
        if (
          programStatus === "completedProgram" &&
          Array.isArray(mailDoc.programsEnrolled) &&
          mailDoc.programsEnrolled.length > 0
        ) {
          await db.Program.updateMany(
            { _id: { $in: mailDoc.programsEnrolled } },
            {
              $pull: { students: { mailUser: mailDoc._id } },
              $inc: { currentCapacity: 1 },
            }
          );
          mailDoc.programsEnrolled = [];
        }
        if (programStatus === "completedProgram" && mailDoc.programLocation) {
          await db.Location.updateOne(
            { _id: mailDoc.programLocation },
            {
              $pull: { locationMentee: mailDoc._id },
              $inc: { currentCapacity: 1 },
            }
          );
          mailDoc.programLocation = null;
        }
        if (mailDoc.mentor) {
          await db.User.updateOne(
            { _id: mailDoc.mentor },
            { $pull: { currentMentee: mailDoc._id } }
          );
        }
        if (
          Array.isArray(mailDoc.mentorAttached) &&
          mailDoc.mentorAttached.length > 0
        ) {
          const mentorIds = [
            ...new Set(
              mailDoc.mentorAttached
                .map((entry) => entry.mentorId)
                .filter(Boolean)
            ),
          ];
          if (mentorIds.length > 0) {
            await db.User.updateMany(
              { _id: { $in: mentorIds } },
              { $pull: { currentMentee: mailDoc._id } }
            );
          }
          mailDoc.mentorAttached = [];
        }
        if (
          Array.isArray(mailDoc.programsEnrolled) &&
          mailDoc.programsEnrolled.length > 0
        ) {
          await db.Program.updateMany(
            { _id: { $in: mailDoc.programsEnrolled } },
            {
              $pull: { students: { mailUser: mailDoc._id } },
              $inc: { currentCapacity: 1 },
            }
          );
          mailDoc.programsEnrolled = [];
        }
        mailDoc.programLocation = null;
        if (mailDoc.approvedAcceptance) {
          mailDoc.approvedAcceptance.isApproved = false;
          if (programStatus === "removedFromProgram") {
            mailDoc.approvedAcceptance.notes = "Removed from program";
          } else if (programStatus === "quitProgram") {
            mailDoc.approvedAcceptance.notes = "Quit program";
          } else if (programStatus === "completedProgram") {
            mailDoc.approvedAcceptance.notes = "Completed program";
          }
        }
        if (isRejectedStatus) {
          if (!mailDoc.rejectedAcceptance) {
            mailDoc.rejectedAcceptance = {};
          }
          mailDoc.rejectedAcceptance.isRejected = true;
          let performedByUser = null;
          if (req.user) {
            performedByUser = req.user;
          } else if (userId) {
            performedByUser = await db.User.findById(userId).lean();
          }
          mailDoc.rejectedAcceptance.rejectedBy =
            performedByUser?._id || mailDoc.rejectedAcceptance.rejectedBy;
          mailDoc.rejectedAcceptance.rejectedAt = new Date();
          if (programStatus === "removedFromProgram") {
            mailDoc.rejectedAcceptance.reason =
              "User removed from program";
          } else if (programStatus === "quitProgram") {
            mailDoc.rejectedAcceptance.reason = "User quit program";
          }
        }
        if (programStatus === "removedFromProgram") {
          let performedByUser = null;
          if (req.user) {
            performedByUser = req.user;
          } else if (userId) {
            performedByUser = await db.User.findById(userId).lean();
          }
          const affectedFirstName = mailDoc.firstName || "";
          const affectedLastName = mailDoc.lastName || "";
          const affectedFullName = `${affectedFirstName} ${affectedLastName}`.trim();
          await db.AuditLog.create({
            action: "REMOVE_USER_FROM_PROGRAM",
            performedBy: performedByUser?._id || null,
            performedByFirstName: performedByUser?.firstName || "",
            performedByLastName: performedByUser?.lastName || "",
            affectedUser: mailDoc.userId || mailDoc._id,
            affectedUserAccountName: affectedFullName,
            auditLogStatus: "mailUser was removed from program",
            aboutAuditLog: "mailUser was removed from program",
            details: `User ${affectedFullName || mailDoc._id} was removed from the program.`,
          });
          mailDoc.livingLocation = [];
          mailDoc.mentor = null;
        }
      }
      await mailDoc.save();
      return res.json({
        ...mailDoc.toObject(),
        message: "Mail entry updated successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({
        message: "Error updating mail entry.",
      });
    }
  },

  // ✅ 
  addMentorAttached: async (req, res) => {
    const { mailId } = req.params;
    const { mentorId } = req.body;
    try {
      const mailUser = await db.Mail.findById(mailId);
      if (!mailUser) {
        return res.status(404).json({ message: "Mail user not found" });
      }
      // 1) Deactivate any currently active mentorAttached entries for this mail user
      await db.Mail.updateOne(
        { _id: mailId },
        {
          $set: {
            "mentorAttached.$[activeEntry].active": false,
            "mentorAttached.$[activeEntry].unassignedAt": new Date(),
            // optional: "mentorAttached.$[activeEntry].reason": "reassigned",
          },
        },
        {
          arrayFilters: [{ "activeEntry.active": true }],
        }
      );
      // 2) Push new active mentorAttached entry and set top-level mentor
      const updatedMailUser = await db.Mail.findOneAndUpdate(
        { _id: mailId },
        {
          $push: {
            mentorAttached: {
              mentorId,
              assignedAt: new Date(), // or rely on schema default
              active: true,
            },
          },
          $set: {
            mentor: mentorId,
          },
        },
        { new: true }
      );
      if (!updatedMailUser) {
        return res.status(404).json({ message: "Mail user not found after update" });
      }
      // 3) Push this mail user into the mentor's currentMentee[]
      await db.User.findByIdAndUpdate(
        mentorId,
        { $addToSet: { currentMentee: updatedMailUser?._id } }, // $addToSet avoids duplicates
        { new: true }
      );
      return res.json({
        ...updatedMailUser.toObject(),
        message:
          "Mentor attached successfully, previous active mentor deactivated, and mentor's currentMentee updated.",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error attaching mentor" });
    }
  },

  // ✅
  removeMentor: async (req, res) => {
    const { mailId } = req.params;
    const { mentorId, reason } = req.body; // reason comes from client
    try {
      // 1) Find the mail user
      const mailUser = await db.Mail.findById(mailId);
      if (!mailUser) {
        return res.status(404).json({ message: "Mail user not found" });
      }
      // Optional safety check
      if (mentorId && mailUser.mentor && mailUser.mentor.toString() !== mentorId) {
        return res.status(400).json({
          message:
            "Provided mentorId does not match the current mentor for this mail user",
        });
      }
      const effectiveMentorId = mentorId || mailUser.mentor;
      // 2) Remove this mail user from the mentor's currentMentee[]
      if (effectiveMentorId) {
        await db.User.findByIdAndUpdate(
          effectiveMentorId,
          { $pull: { currentMentee: mailUser?._id } },
          { new: true }
        );
      }
      // 3) Update mentorAttached history entry and clear current mentor
      const updatedMailUser = await db.Mail.findOneAndUpdate(
        {
          _id: mailId,
          "mentorAttached.mentorId": effectiveMentorId, // match the right entry
        },
        {
          $set: {
            "mentorAttached.$.unassignedAt": new Date(),
            "mentorAttached.$.reason": reason,
            "mentorAttached.$.active": false, // flip the boolean
          },
          $unset: {
            mentor: "", // clear current mentor reference
          },
        },
        { new: true }
      );
      if (!updatedMailUser) {
        return res.status(404).json({
          message:
            "Mail user not found or no mentorAttached entry for this mentor",
        });
      }
      return res.json({
        ...updatedMailUser.toObject(),
        message:
          "Mentor removed successfully, mentor history updated, and currentMentee updated.",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error removing mentor" });
    }
  },

  // ✅ 
  addInmateNumber: async (req, res) => {
    const { mailId } = req.params;
    const { inmateNumbers } = req.body;
    try {
      const entries = Array.isArray(inmateNumbers)
        ? inmateNumbers
        : [inmateNumbers];
      const invalid = entries.some(
        (e) => !e || typeof e.number !== "string" || typeof e.state !== "string"
      );
      if (invalid) {
        return res.status(400).json({
          message: "Each inmateNumbers entry must have number and state",
        });
      }
      // Load the target mailList user
      const mailDoc = await db.Mail.findById(mailId);
      if (!mailDoc) {
        return res.status(404).json({ message: "Mail user not found" });
      }
      // Build a set of existing pairs in this mailDoc to avoid duplicates in the same list
      const existingPairs = new Set(
        (mailDoc.inmateNumbers || []).map(
          (e) => `${e.number.trim()}|${e.state.trim()}`
        )
      );
      const newPairs = new Set();
      // First pass: check for duplicates inside this mailDoc
      for (const e of entries) {
        const num = e.number.trim();
        const st = e.state.trim();
        const key = `${num}|${st}`;
        if (existingPairs.has(key)) {
          return res.status(400).json({
            message:
              "This inmate number and state already exist on this mail user.",
          });
        }
        if (newPairs.has(key)) {
          return res.status(400).json({
            message:
              "Duplicate inmate number and state in the same request is not allowed.",
          });
        }
        newPairs.add(key);
      }
      // Second pass: check for conflicts with OTHER mailList users
      // We only need to find the first conflict and return its info.
      for (const e of entries) {
        const num = e.number.trim();
        const st = e.state.trim();
        const conflictingMail = await db.Mail.findOne(
          {
            _id: { $ne: mailId }, // some other mailList
            "inmateNumbers.number": num,
            "inmateNumbers.state": st,
          },
          {
            _id: 1,
            firstName: 1,
            lastName: 1,
          }
        );
        if (conflictingMail) {
          return res.status(400).json({
            message:
              "This inmate number and state are already used by another mail user.",
            conflictingMailList: {
              mailListId: conflictingMail._id,
              firstName: conflictingMail.firstName,
              lastName: conflictingMail.lastName,
            },
          });
        }
      }
      // If we got here:
      // - No duplicates inside this mailDoc
      // - No duplicates across other mailDocs
      const updatedMailUser = await db.Mail.findByIdAndUpdate(
        mailId,
        {
          $addToSet: {
            inmateNumbers: { $each: entries },
          },
        },
        { new: true }
      );
      if (!updatedMailUser) {
        return res.status(404).json({ message: "Mail user not found" });
      }
      return res.json({
        ...updatedMailUser.toObject(),
        message: "Inmate number(s) added successfully!",
      });
    } catch (err) {
      console.error(err);
      // Fallback: if a unique index still catches a race condition
      if (err.code === 11000) {
        return res.status(400).json({
          message:
            "This inmate number and state are already used by another mail user.",
        });
      }
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error adding inmate number(s)" });
    }
  },

  // ✅ 
  removeInmateNumber: async (req, res) => {
    const { mailId } = req.params;
    const { inmateNumberIds } = req.body;
    // inmateNumberIds can be: "698611503a8bf5e3e0d74db6" OR ["id1", "id2", ...]
    try {
      // Normalize to an array
      const ids = Array.isArray(inmateNumberIds)
        ? inmateNumberIds
        : [inmateNumberIds];
      // Basic validation
      const invalid = !ids.length || ids.some((id) => typeof id !== "string");
      if (invalid) {
        return res.status(400).json({
          message:
            "You must provide one or more inmateNumberIds as strings to remove.",
        });
      }
      // Remove subdocuments by their _id from inmateNumbers array
      const updatedMailUser = await db.Mail.findByIdAndUpdate(
        mailId,
        {
          $pull: {
            inmateNumbers: {
              _id: { $in: ids },
            },
          },
        },
        { new: true }
      );
      if (!updatedMailUser) {
        return res.status(404).json({ message: "Mail user not found" });
      }
      return res.json({
        ...updatedMailUser.toObject(),
        message: "Inmate number(s) removed successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Error removing inmate number(s)" });
    }
  },

  // ✅
  searchMailList: async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || !q.trim()) {
        return res.status(400).json({
          message: "Search term (q) is required.",
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
      const parseMonthTerm = (input) => {
        if (!input) return null;
        const trimmed = input.trim();
        const lower = trimmed.toLowerCase();
        const monthMap = {
          jan: "01", january: "01",
          feb: "02", february: "02",
          mar: "03", march: "03",
          apr: "04", april: "04",
          may: "05",
          jun: "06", june: "06",
          jul: "07", july: "07",
          aug: "08", august: "08",
          sep: "09", sept: "09", september: "09",
          oct: "10", october: "10",
          nov: "11", november: "11",
          dec: "12", december: "12",
        };
        const numericWithSep = trimmed.match(/^(\d{1,2})[\/\-]/);
        if (numericWithSep) {
          const m = numericWithSep[1].padStart(2, "0");
          if (Number(m) >= 1 && Number(m) <= 12) return m;
        }
        const pureNumeric = trimmed.match(/^(\d{1,2})$/);
        if (pureNumeric) {
          const m = pureNumeric[1].padStart(2, "0");
          if (Number(m) >= 1 && Number(m) <= 12) return m;
        }
        if (monthMap[lower]) return monthMap[lower];
        return null;
      };
      const stateMap = { /* unchanged state map */ };
      const parseStateCode = (input) => {
        if (!input) return null;
        const trimmed = input.trim();
        const lower = trimmed.toLowerCase();
        if (/^[a-z]{2}$/i.test(trimmed)) {
          return trimmed.toUpperCase();
        }
        if (stateMap[lower]) {
          return stateMap[lower];
        }
        return null;
      };
      const monthCode = parseMonthTerm(raw);
      const stateCode = parseStateCode(raw);
      const safe = escapeRegex(term);
      // -----------------------------
      // Mentor searches
      // -----------------------------
      if (term === "no mentor" || term === "nomentor" || term === "no-mentor") {
        orConditions.push({
          $or: [
            { mentorAttached: { $exists: false } },
            { mentorAttached: { $size: 0 } },
            {
              mentorAttached: {
                $not: { $elemMatch: { active: true } },
              },
            },
          ],
        });
      } else if (
        term === "has mentor" ||
        term === "hasmentor" ||
        term === "mentor"
      ) {
        orConditions.push({
          mentorAttached: {
            $elemMatch: { active: true },
          },
        });
      }
      // -----------------------------
      // NEW: Birthday search
      // -----------------------------
      if (term === "birthday" || term === "birthday today") {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const birthdayPattern = `-${month}-${day}`;
        orConditions.push({
          dateOfBirth: {
            $regex: birthdayPattern,
            $options: "i",
          },
        });
      }
      // -----------------------------
      // Gender synonyms
      // -----------------------------
      const maleSynonyms = new Set(["male","man","men","boy","boys","guy","guys"]);
      const femaleSynonyms = new Set(["female","woman","women","girl","girls","lady","ladies"]);
      if (maleSynonyms.has(term)) {
        orConditions.push({ sex: "male" });
      } else if (femaleSynonyms.has(term)) {
        orConditions.push({ sex: "female" });
      }
      // inmateNumbers search
      orConditions.push(
        { "inmateNumbers.number": { $regex: safe, $options: "i" } },
        { "inmateNumbers.state": { $regex: safe, $options: "i" } }
      );
      // State recognition
      if (stateCode) {
        orConditions.push(
          { "inmateNumbers.state": stateCode },
          regexCond("currentLocation", escapeRegex(stateCode))
        );
      }
      // Generic fields
      orConditions.push(
        regexCond("firstName", safe),
        regexCond("lastName", safe),
        regexCond("phoneNumber", safe),
        regexCond("currentLocation", safe),
        regexCond("email", safe),
        regexCond("currentCharge", safe),
        regexCond("currentInsurance", safe),
        regexCond("lastContact", safe)
      );
      if (monthCode) {
        const monthPattern = `-${escapeRegex(monthCode)}-`;
        orConditions.push(
          { dateOfBirth: { $regex: monthPattern, $options: "i" } },
          { projectedReleaseDate: { $regex: monthPattern, $options: "i" } },
          { maxReleaseDate: { $regex: monthPattern, $options: "i" } }
        );
      } else {
        orConditions.push(
          regexCond("dateOfBirth", safe),
          regexCond("projectedReleaseDate", safe),
          regexCond("maxReleaseDate", safe)
        );
      }
      orConditions.push(
        regexCond("programStatus", safe),
        regexCond("status", safe)
      );
      const filter = { $or: orConditions };
      const results = await db.Mail.find(filter).lean();
      if (!results.length) {
        return res.status(200).json({
          message: `No Mentee Found With "${raw}"`,
          count: 0,
          results: [],
        });
      }
      return res.status(200).json({
        message: `Found ${results.length} mentee(s) matching "${raw}"`,
        count: results.length,
        results,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error searching mail list users",
      });
    }
  },

  // ✅ 
  addPastCharges: async (req, res) => {
    const { mailId } = req.params;
    const { pastCharges } = req.body;
    // pastCharges can be a single object or an array of objects:
    // { charge, dateOfCharge, releaseDate, disposition, state, city, notes }
    // OR [{ ... }, { ... }, ...]
    try {
      // Normalize to array so we can add one or many
      const entries = Array.isArray(pastCharges) ? pastCharges : [pastCharges];
      // Basic shape check: require `charge` at minimum
      const invalid = entries.some(
        (e) => !e || typeof e.charge !== "string" || !e.charge.trim()
      );
      if (invalid) {
        return res.status(400).json({
          message: "Each pastCharges entry must include a non-empty 'charge' field",
        });
      }
      const updatedMailUser = await db.Mail.findByIdAndUpdate(
        mailId,
        {
          $push: {
            pastCharges: { $each: entries },
          },
        },
        { new: true }
      );
      if (!updatedMailUser) {
        return res.status(404).json({ message: "Mail user not found" });
      }
      return res.json({
        ...updatedMailUser.toObject(),
        message: "Past charge(s) added successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error adding past charge(s)" });
    }
  },

  // ✅
  removePastCharges: async (req, res) => {
    const { mailId } = req.params;
    const { pastChargeIds } = req.body;
    try {
      const ids = Array.isArray(pastChargeIds) ? pastChargeIds : [pastChargeIds];
      const invalid = ids.some((id) => typeof id !== "string" || !id.trim());
      if (invalid) {
        return res.status(400).json({
          message: "Each pastChargeIds entry must be a non-empty string",
        });
      }
      const updatedMailUser = await db.Mail.findByIdAndUpdate(
        mailId,
        {
          $pull: {
            pastCharges: { _id: { $in: ids } },
          },
        },
        { new: true }
      );
      if (!updatedMailUser) {
        return res.status(404).json({ message: "Mail user not found" });
      }
      return res.json({
        ...updatedMailUser.toObject(),
        message: "Past charge(s) removed successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Error removing past charge(s)" });
    }
  },

  // ✅
  addPendingCharges: async (req, res) => {
    const { mailId } = req.params;
    const { pendingCharges } = req.body;
    // pendingCharges can be:
    // { charge, dateOfCharge, courtDate, facility, state, city, notes }
    // OR [{ ... }, { ... }, ...]
    try {
      // Normalize to array so we can add one or many
      const entries = Array.isArray(pendingCharges)
        ? pendingCharges
        : [pendingCharges];
      // Basic shape check: require `charge` at minimum
      const invalid = entries.some(
        (e) => !e || typeof e.charge !== "string" || !e.charge.trim()
      );
      if (invalid) {
        return res.status(400).json({
          message:
            "Each pendingCharges entry must include a non-empty 'charge' field",
        });
      }
      const updatedMailUser = await db.Mail.findByIdAndUpdate(
        mailId,
        {
          $push: {
            pendingCharges: { $each: entries },
          },
        },
        { new: true }
      );
      if (!updatedMailUser) {
        return res.status(404).json({ message: "Mail user not found" });
      }
      return res.json({
        ...updatedMailUser.toObject(),
        message: "Pending charge(s) added successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Error adding pending charge(s)" });
    }
  },

  // ✅
  removePendingCharges: async (req, res) => {
    const { mailId } = req.params;
    const { pendingChargeIds } = req.body;
    try {
      const ids = Array.isArray(pendingChargeIds)
        ? pendingChargeIds
        : [pendingChargeIds];
      const invalid = ids.some((id) => typeof id !== "string" || !id.trim());
      if (invalid) {
        return res.status(400).json({
          message: "Each pendingChargeIds entry must be a non-empty string",
        });
      }
      const updatedMailUser = await db.Mail.findByIdAndUpdate(
        mailId,
        {
          $pull: {
            pendingCharges: { _id: { $in: ids } },
          },
        },
        { new: true }
      );
      if (!updatedMailUser) {
        return res.status(404).json({ message: "Mail user not found" });
      }
      return res.json({
        ...updatedMailUser.toObject(),
        message: "Pending charge(s) removed successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Error removing pending charge(s)" });
    }
  },

  // ✅
  addReceivedMsg: async (req, res) => {
    const { mailId } = req.params;
    const {
      msgBody,
      msgResponse,
      createdBy,
      channel,
      timestamp,
    } = req.body;
    try {
      // Build the subdocument to push into receivedMsgs
      const msgEntry = {
        msgBody,
        msgResponse,
        createdBy,
        channel,
      };
      // Only set timestamp if provided; otherwise schema default applies
      if (timestamp) {
        msgEntry.timestamp = timestamp;
      }
      const updateDoc = {
        $push: {
          receivedMsgs: msgEntry,
        },
      };
      // If there was a response, increment msgSentCount
      if (msgResponse) {
        updateDoc.$inc = { msgSentCount: 1 };
      }
      // IMPORTANT: mailId must be the _id of the Mail document, not an email string
      const updatedMailUser = await db.Mail.findByIdAndUpdate(
        mailId,
        updateDoc,
        {
          new: true,          // return updated document
          // runValidators: true, // optional: enforce schema validation on update
        }
      );
      if (!updatedMailUser) {
        return res.status(404).json({ message: "Mail user not found" });
      }
      return res.json({
        ...updatedMailUser.toObject(),
        message: "Message added to receivedMsgs successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Error adding message to receivedMsgs" });
    }
  },

  // ✅
  updateReceivedMsg: async (req, res) => {
    const { mailId, msgId } = req.params;
    const {
      msgBody,
      msgResponse,
      createdBy,
      channel,
      timestamp,
    } = req.body;
    try {
      // Build the $set object only with fields you want to update
      const setFields = {};
      if (msgBody !== undefined) setFields["receivedMsgs.$.msgBody"] = msgBody;
      if (msgResponse !== undefined) setFields["receivedMsgs.$.msgResponse"] = msgResponse;
      if (createdBy !== undefined) setFields["receivedMsgs.$.createdBy"] = createdBy;
      if (channel !== undefined) setFields["receivedMsgs.$.channel"] = channel;
      if (timestamp !== undefined) setFields["receivedMsgs.$.timestamp"] = timestamp;
      const updatedMailUser = await db.Mail.findOneAndUpdate(
        {
          _id: mailId,
          "receivedMsgs._id": msgId, // find the specific subdocument
        },
        {
          $set: setFields,
          // IMPORTANT: no $inc here, we do NOT touch msgSentCount
        },
        { new: true }
      );
      if (!updatedMailUser) {
        return res.status(404).json({ message: "Mail user or message not found" });
      }
      return res.json({
        ...updatedMailUser.toObject(),
        message: "receivedMsgs entry updated successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Error updating message in receivedMsgs" });
    }
  },

  getSingleReceivedMsg: async (req, res) => {
    const { mailId, msgId } = req.params;
    try {
      const mailDoc = await db.Mail.findOne(
        { _id: mailId, "receivedMsgs._id": msgId },
        { "receivedMsgs.$": 1 } // only the matched subdocument
      );
      if (!mailDoc || !mailDoc.receivedMsgs || mailDoc.receivedMsgs.length === 0) {
        return res
          .status(404)
          .json({ message: "Mail user or message not found" });
      }
      const msg = mailDoc.receivedMsgs[0];
      return res.json({
        ...msg.toObject?.() ?? msg,
        message: "Message fetched successfully",
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Error fetching message from receivedMsgs" });
    }
  },

  // ✅
  deleteReceivedMsg: async (req, res) => {
    const { mailId, msgId } = req.params; // msgId = "698b4ca8d0a2b59a4b003cf6"
    try {
      const updatedMailUser = await db.Mail.findByIdAndUpdate(
        mailId,
        {
          $pull: {
            receivedMsgs: { _id: msgId }, // remove the subdocument with this _id
          },
        },
        { new: true }
      );
      if (!updatedMailUser) {
        return res
          .status(404)
          .json({ message: "Mail user not found or message not found" });
      }
      return res.json({
        ...updatedMailUser.toObject(),
        message: "Message removed from receivedMsgs successfully!",
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Error deleting message from receivedMsgs" });
    }
  },

  // ✅
  updatePaperwork: async (req, res) => {
    const { mailId } = req.params;
    const { missingPaperwork, completedRequiredPaperwork } = req.body;
    try {
      const update = {};
      const pushOps = {};
      const setOps = {};
      // Start with whatever frontend sent (if anything),
      // but we will override based on missingPaperwork content.
      let resolvedCompleted = completedRequiredPaperwork;
      // Normalize missingPaperwork to an array and validate
      if (missingPaperwork) {
        const entries = Array.isArray(missingPaperwork)
          ? missingPaperwork
          : [missingPaperwork];
        const invalid = entries.some(
          (e) => !e || typeof e.name !== "string" || !e.name.trim()
        );
        if (invalid) {
          return res.status(400).json({
            message:
              "Each missingPaperwork entry must include a non-empty 'name' field",
          });
        }
        // Server-side rules:
        // 1. If any entry is "Marked Paper Work Completed" => paperwork is completed (true)
        // 2. If any other paperwork is added => paperwork is not completed (false)
        const hasCompletedMarker = entries.some(
          (e) => e.name === "Marked Paper Work Completed"
        );
        const hasOtherPaperwork = entries.some(
          (e) => e.name !== "Marked Paper Work Completed"
        );
        if (hasCompletedMarker && !hasOtherPaperwork) {
          // Only the "completed" marker present
          resolvedCompleted = true;
        } else if (hasOtherPaperwork) {
          // Any other paperwork means requirements are not fully completed
          resolvedCompleted = false;
        }
        // Append entries to the existing array
        pushOps.missingPaperwork = { $each: entries };
      }
      // Apply the resolvedCompleted flag if we have a boolean
      if (typeof resolvedCompleted === "boolean") {
        setOps.completedRequiredPaperwork = resolvedCompleted;
      }
      if (Object.keys(pushOps).length > 0) {
        update.$push = pushOps; // add items, do NOT overwrite the array
      }
      if (Object.keys(setOps).length > 0) {
        update.$set = setOps;
      }
      // If nothing to update, return 400
      if (Object.keys(update).length === 0) {
        return res.status(400).json({
          message:
            "Provide missingPaperwork to add items and/or completedRequiredPaperwork to update status",
        });
      }
      const updatedMailUser = await db.Mail.findByIdAndUpdate(mailId, update, {
        new: true,
        // runValidators: true, // optional
      });
      if (!updatedMailUser) {
        return res.status(404).json({ message: "Mail user not found" });
      }
      return res.json({
        ...updatedMailUser.toObject(),
        message: "Paperwork updated successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error updating paperwork" });
    }
  },

  // ✅
  deletePaperwork: async (req, res) => {
    const { mailId, paperworkId } = req.params;
    try {
      // 1) Remove the specific missingPaperwork item and get the updated document
      const updatedMailUser = await db.Mail.findByIdAndUpdate(
        mailId,
        {
          $pull: {
            missingPaperwork: { _id: paperworkId },
          },
        },
        { new: true }
      );
      if (!updatedMailUser) {
        return res
          .status(404)
          .json({ message: "Mail user not found or paperwork item not found" });
      }
      // 2) Determine completedRequiredPaperwork based on remaining missingPaperwork
      const missing = Array.isArray(updatedMailUser.missingPaperwork)
        ? updatedMailUser.missingPaperwork
        : [];
      let completedRequiredPaperwork = false;
      if (missing.length === 0) {
        // No missing paperwork left => completed
        completedRequiredPaperwork = true;
      } else {
        // Check the last entry's name
        const lastEntry = missing[missing.length - 1];
        if (lastEntry?.name === "Marked Paper Work Completed") {
          completedRequiredPaperwork = true;
        } else {
          completedRequiredPaperwork = false;
        }
      }
      // 3) If the flag changed or needs to be enforced, update it
      if (updatedMailUser.completedRequiredPaperwork !== completedRequiredPaperwork) {
        updatedMailUser.completedRequiredPaperwork = completedRequiredPaperwork;
        await updatedMailUser.save();
      }
      return res.json({
        ...updatedMailUser.toObject(),
        message: "Missing paperwork item removed successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Error removing missing paperwork item" });
    }
  },

  // ✅
  updateApprovedAcceptance: async (req, res) => {
    const { mailId } = req.params;
    const { isApproved, approvedBy, approvedAt, notes } = req.body;
    try {
      // Require a valid ObjectId
      if (!approvedBy || !mongoose.isObjectIdOrHexString(approvedBy)) {
        return res
          .status(400)
          .json({ message: "approvedBy must be a valid user id" });
      }
      // Ensure that user exists
      const user = await mongoose.model("User").findById(approvedBy).lean();
      if (!user) {
        return res
          .status(400)
          .json({ message: "approvedBy must reference an existing user" });
      }
      // Build update object
      const update = {};
      // isApproved must be explicitly provided as boolean
      if (typeof isApproved === "boolean") {
        update["approvedAcceptance.isApproved"] = isApproved;
      } else {
        return res
          .status(400)
          .json({ message: "isApproved must be provided as a boolean" });
      }
      // Always set approvedBy (already validated & checked above)
      update["approvedAcceptance.approvedBy"] = approvedBy;
      // Set approvedAt (provided or default to now on approve)
      if (approvedAt) {
        update["approvedAcceptance.approvedAt"] = approvedAt;
      } else if (isApproved === true) {
        update["approvedAcceptance.approvedAt"] = new Date();
      }
      if (notes !== undefined) {
        update["approvedAcceptance.notes"] = notes;
      }
      // IMPORTANT: if isApproved is true, also set status to "approved"
      if (isApproved === true) {
        update.status = "approved";
      }
      const updatedMailUser = await Mail.findByIdAndUpdate(
        mailId,
        { $set: update },
        {
          new: true,
          runValidators: true,
          context: "query",
        }
      );
      if (!updatedMailUser) {
        return res.status(404).json({ message: "Mail user not found" });
      }
      return res.json({
        ...updatedMailUser.toObject(),
        message: "approvedAcceptance updated successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Error updating approvedAcceptance" });
    }
  },

  // ✅
  updateStatus: async (req, res) => {
    const { mailId } = req.params;
    const { status } = req.body;
    // status must be one of:
    // "new", "pending_review", "approved", "rejected", "active", "inactive", "completed"
    try {
      const updatedMailUser = await db.Mail.findByIdAndUpdate(
        mailId,
        { $set: { status } },
        { new: true }
      );
      if (!updatedMailUser) {
        return res.status(404).json({ message: "Mail user not found" });
      }
      return res.json({
        ...updatedMailUser.toObject(),
        message: "Status updated successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error updating status" });
    }
  },

  // ✅ 
  updateProgramStatus: async (req, res) => {
    const { mailId } = req.params;
    const { programStatus, userId } = req.body; // userId optional, only needed for audit
    try {
      const mailDoc = await db.Mail.findById(mailId);
      if (!mailDoc) {
        return res.status(404).json({ message: "Mail user not found" });
      }
      // Always set the new programStatus
      mailDoc.programStatus = programStatus;
      const isRemovalStatus =
        programStatus === "removedFromProgram" ||
        programStatus === "quitProgram" ||
        programStatus === "completedProgram";
      const isLeavingLocation =
        programStatus === "removedFromProgram" ||
        programStatus === "quitProgram";
      const isRejectedStatus =
        programStatus === "removedFromProgram" ||
        programStatus === "quitProgram"; // no rejection for completedProgram
      if (isRemovalStatus) {
        // STATUS aligned with programStatus
        if (programStatus === "removedFromProgram") {
          mailDoc.status = "removedFromProgram";
        } else if (programStatus === "quitProgram") {
          mailDoc.status = "quitProgram";
        } else if (programStatus === "completedProgram") {
          mailDoc.status = "completed";
        }
        const message =
          programStatus === "quitProgram" || programStatus === "completedProgram"
            ? "completed program"
            : "removed from program";
        mailDoc.lastContact = `User ${message}`;
        //
        // LOCATION + PROGRAM CLEANUP
        //
        // CONDITION 1 (removed/quit): Remove mentee from Location(s) and increment capacity
        if (
          isLeavingLocation &&
          Array.isArray(mailDoc.livingLocation) &&
          mailDoc.livingLocation.length > 0
        ) {
          await db.Location.updateMany(
            { _id: { $in: mailDoc.livingLocation } },
            {
              $pull: { locationMentee: mailDoc._id },
              $inc: { currentCapacity: 1 },
            }
          );
        }
        // CONDITION 1 (completedProgram): same, plus clear livingLocation
        if (
          programStatus === "completedProgram" &&
          Array.isArray(mailDoc.livingLocation) &&
          mailDoc.livingLocation.length > 0
        ) {
          await db.Location.updateMany(
            { _id: { $in: mailDoc.livingLocation } },
            {
              $pull: { locationMentee: mailDoc._id },
              $inc: { currentCapacity: 1 },
            }
          );
          // Remove the location IDs from the livingLocation array in Mail schema
          mailDoc.livingLocation = [];
        }
        // CONDITION 2 (completedProgram): programsEnrolled cleanup
        if (
          programStatus === "completedProgram" &&
          Array.isArray(mailDoc.programsEnrolled) &&
          mailDoc.programsEnrolled.length > 0
        ) {
          await db.Program.updateMany(
            { _id: { $in: mailDoc.programsEnrolled } },
            {
              // remove any students subdocument whose mailUser equals this mail id
              $pull: { students: { mailUser: mailDoc._id } },
              // increase available capacity
              $inc: { currentCapacity: 1 },
            }
          );
          // Remove the program IDs from the mail document
          mailDoc.programsEnrolled = [];
        }
        // CONDITION 3 (completedProgram): programLocation cleanup
        if (programStatus === "completedProgram" && mailDoc.programLocation) {
          await db.Location.updateOne(
            { _id: mailDoc.programLocation },
            {
              $pull: { locationMentee: mailDoc._id },
              $inc: { currentCapacity: 1 },
            }
          );
          // Remove the programLocation ID from the Mail schema
          mailDoc.programLocation = null;
        }
        //
        // MENTOR CLEANUP
        //
        // CONDITION 2 (original): Remove mentee from mentor.currentMentee for current mentor
        if (mailDoc.mentor) {
          await db.User.updateOne(
            { _id: mailDoc.mentor },
            { $pull: { currentMentee: mailDoc._id } }
          );
        }
        // CONDITION 3 (original): Clear mentorAttached and clean up all mentorIds' currentMentee
        if (
          Array.isArray(mailDoc.mentorAttached) &&
          mailDoc.mentorAttached.length > 0
        ) {
          const mentorIds = [
            ...new Set(
              mailDoc.mentorAttached
                .map((entry) => entry.mentorId)
                .filter(Boolean)
            ),
          ];
          if (mentorIds.length > 0) {
            await db.User.updateMany(
              { _id: { $in: mentorIds } },
              { $pull: { currentMentee: mailDoc._id } }
            );
          }
          mailDoc.mentorAttached = [];
        }
        //
        // PROGRAM-LEVEL CLEANUP (applies to all removal statuses)
        //
        // CONDITION 4: Remove this Mail from all enrolled Programs and increment capacity
        if (
          Array.isArray(mailDoc.programsEnrolled) &&
          mailDoc.programsEnrolled.length > 0
        ) {
          await db.Program.updateMany(
            { _id: { $in: mailDoc.programsEnrolled } },
            {
              $pull: { students: { mailUser: mailDoc._id } },
              $inc: { currentCapacity: 1 },
            }
          );
          mailDoc.programsEnrolled = [];
        }
        // CONDITION 5: Clear programLocation on the Mail document
        mailDoc.programLocation = null;
        //
        // ACCEPTANCE / REJECTION LOGIC
        //
        // CONDITION 6: Reset approvedAcceptance and add note
        if (mailDoc.approvedAcceptance) {
          mailDoc.approvedAcceptance.isApproved = false;
          if (programStatus === "removedFromProgram") {
            mailDoc.approvedAcceptance.notes = "Removed from program";
          } else if (programStatus === "quitProgram") {
            mailDoc.approvedAcceptance.notes = "Quit program";
          } else if (programStatus === "completedProgram") {
            mailDoc.approvedAcceptance.notes = "Completed program";
          }
        }
        // CONDITION 7: Rejection only for removed / quit, NOT completed
        if (isRejectedStatus) {
          if (!mailDoc.rejectedAcceptance) {
            mailDoc.rejectedAcceptance = {};
          }
          mailDoc.rejectedAcceptance.isRejected = true;
          // inline performedByUser resolution
          let performedByUser = null;
          if (req.user) {
            performedByUser = req.user;
          } else if (userId) {
            performedByUser = await db.User.findById(userId).lean();
          }
          mailDoc.rejectedAcceptance.rejectedBy =
            performedByUser?._id || mailDoc.rejectedAcceptance.rejectedBy;
          mailDoc.rejectedAcceptance.rejectedAt = new Date();
          if (programStatus === "removedFromProgram") {
            mailDoc.rejectedAcceptance.reason = "User removed from program";
          } else if (programStatus === "quitProgram") {
            mailDoc.rejectedAcceptance.reason = "User quit program";
          }
        }
        //
        // AUDIT LOG – ONLY IF USER IS REMOVED FROM THE PROGRAM
        //
        if (programStatus === "removedFromProgram") {
          // inline performedByUser resolution
          let performedByUser = null;
          if (req.user) {
            performedByUser = req.user;
          } else if (userId) {
            performedByUser = await db.User.findById(userId).lean();
          }
          const affectedFirstName = mailDoc.firstName || "";
          const affectedLastName = mailDoc.lastName || "";
          const affectedFullName = `${affectedFirstName} ${affectedLastName}`.trim();
          await db.AuditLog.create({
            action: "REMOVE_USER_FROM_PROGRAM",
            performedBy: performedByUser?._id || null,
            performedByFirstName: performedByUser?.firstName || "",
            performedByLastName: performedByUser?.lastName || "",
            // Adjust this if Mail has a distinct user reference field
            affectedUser: mailDoc.userId || mailDoc._id,
            affectedUserAccountName: affectedFullName,
            auditLogStatus: "mailUser was removed from program",
            aboutAuditLog: "mailUser was removed from program",
            details: `User ${affectedFullName || mailDoc._id} was removed from the program.`,
          });
        }
        //
        // FINAL CLEARING OF REFERENCES ON MAIL DOCUMENT
        //
        mailDoc.livingLocation = [];
        mailDoc.mentor = null;
      }
      await mailDoc.save();
      return res.status(200).json({
        message: "Program status updated successfully",
        programStatus: mailDoc.programStatus,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  },

  // ✅  
  // READ - Get all mailing list entries
  getAllMailEntries: async (req, res) => {
    try {
      const data = await db.Mail.find({})
        .populate("programsEnrolled")
        .populate("programsCompleted")
        .populate("livingLocation")
        .populate("mentor")
      if (!data || data.length === 0) {
        return res.json({
          message: "There are no mail entries in the database.",
        });
      }
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error fetching mail entries.",
        error: err,
      });
    }
  },

  reduceMailUser: async (req, res) => {
    const { mailId, currentUserId } = req.params;
    const { programStatus } = req.body
    try {
      let actingUser = null;
      if (currentUserId) {
        actingUser = await db.User.findById(currentUserId).lean();
      }
      const mailUser = await db.Mail.findById(mailId);
      if (!mailUser) {
        return res.status(404).json({ message: "Mail user not found" });
      }
      // If client provided a new programStatus, apply it to the mailUser
      if (programStatus) {
        mailUser.programStatus = programStatus;
      }
      // 1) Clean up mentor relationships (same idea as deleteMailEntry)
      if (mailUser.mentor) {
        await db.User.findByIdAndUpdate(
          mailUser.mentor,
          { $pull: { currentMentee: mailUser?._id } },
          { new: true }
        );
      }
      await db.User.updateMany(
        { currentMentee: mailUser?._id },
        { $pull: { currentMentee: mailUser?._id } }
      );
      // 2) Clean up locations and recompute currentCapacity
      let locationFilter = {};
      if (Array.isArray(mailUser.livingLocation) && mailUser.livingLocation.length > 0) {
        // Filter by specific location IDs and mailUser presence
        locationFilter = {
          _id: { $in: mailUser.livingLocation },
          locationMentee: mailUser?._id,
        };
      } else {
        // Any location that currently has this mailUser
        locationFilter = { locationMentee: mailUser?._id };
      }
      // a) Pull mailUser out of locationMentee
      await db.Location.updateMany(
        locationFilter,
        {
          $pull: { locationMentee: mailUser?._id },
        }
      );
      // b) Reload affected locations and recompute currentCapacity
      const affectedLocations = await db.Location.find(
        // After pull, use the same IDs if we had a list, otherwise query by mailUser before pull
        Array.isArray(mailUser.livingLocation) && mailUser.livingLocation.length > 0
          ? { _id: { $in: mailUser.livingLocation } }
          : {},  // if you want to limit further, you could track affected IDs separately
        { _id: 1, maxCapacity: 1, locationMentee: 1 }
      ).lean();
      const locationBulkOps = affectedLocations.map((location) => {
        const occupantCount = Array.isArray(location.locationMentee)
          ? location.locationMentee.length
          : 0;
        const newCurrentCapacity = location.maxCapacity - occupantCount;
        return {
          updateOne: {
            filter: { _id: location._id },
            update: { $set: { currentCapacity: newCurrentCapacity } },
          },
        };
      });
      if (locationBulkOps.length > 0) {
        await db.Location.bulkWrite(locationBulkOps);
      }
      // 3) PROGRAMS ENROLLED: remove Mail user from students, then recompute currentCapacity
      if (Array.isArray(mailUser.programsEnrolled) && mailUser.programsEnrolled.length > 0) {
        // a) Pull mailUser out of students
        await db.Program.updateMany(
          {
            _id: { $in: mailUser.programsEnrolled },
            "students.mailUser": mailUser?._id,
          },
          {
            $pull: { students: { mailUser: mailUser?._id } },
          }
        );
        // b) Reload and recompute currentCapacity = maxCapacity - students.length
        const programs = await db.Program.find(
          { _id: { $in: mailUser.programsEnrolled } },
          { _id: 1, maxCapacity: 1, students: 1 }
        ).lean();
        const bulkOps = programs.map((program) => {
          const studentCount = Array.isArray(program.students)
            ? program.students.length
            : 0;
          const newCurrentCapacity = program.maxCapacity - studentCount;
          return {
            updateOne: {
              filter: { _id: program._id },
              update: {
                $set: { currentCapacity: newCurrentCapacity },
              },
            },
          };
        });
        if (bulkOps.length > 0) {
          await db.Program.bulkWrite(bulkOps);
        }
      }
      // 4) PROGRAMS COMPLETED: keep graduates entry as-is (do NOT pull from graduates)
      //    No changes here; we want the Mail user id to remain in Program.graduates.
      // 5) Decide approval vs rejection based on programStatus
      const status = mailUser.programStatus;
      // Reset both first
      mailUser.approvedAcceptance = undefined;
      mailUser.rejectedAcceptance = undefined;
      if (status === "removedFromProgram" || status === "quitProgram") {
        mailUser.rejectedAcceptance = {
          isRejected: true,
          rejectedBy: actingUser ? actingUser?._id : null,
          rejectedAt: new Date(),
          reason:
            "This user quit or was removed from this program so is currently not eligible to be re-enrolled",
        };
      } else if (status === "completedProgram") {
        mailUser.approvedAcceptance = {
          isApproved: true,
          approvedBy: actingUser ? actingUser?._id : null,
          approvedAt: new Date(),
          notes:
            "This user did complete the program so is eligible for re-enrollment",
        };
      }
      // 6) "Reduce" Mail user: keep only selected core fields, clear the rest
      const fieldsToKeep = new Set([
        "inmateNumbers",
        "firstName",
        "lastName",
        "sex",
        "programsCompleted",
        "programStatus",
        "approvedAcceptance",
        "rejectedAcceptance",
        "createdAt",
        "updatedAt",
        "_id",
        "__v",
      ]);
      const mailObj = mailUser.toObject();
      for (const key of Object.keys(mailObj)) {
        if (!fieldsToKeep.has(key)) {
          mailUser.set(key, undefined); // effectively unsets when saved
        }
      }
      await mailUser.save();
      // 7) Audit log
      try {
        await db.AuditLog.create({
          action: "REDUCE_MAIL_USER",
          performedBy: actingUser ? actingUser?._id : null,
          performedByFirstName: actingUser?.accountName || "",
          affectedUser: mailUser?._id,
          affectedUserAccountName:
            mailObj.accountName || mailObj.email || mailObj.name || "",
          auditLogStatus: "SUCCESS",
          aboutAuditLog: "Mail user reduced (soft-cleaned) instead of deleted",
          details: `Mail user ${mailUser?._id} reduced by user ${actingUser
              ? `${actingUser.firstName || ""} ${actingUser.lastName || ""} (${actingUser?._id})`
              : "unknown"
            }. Removed mentor/location/program enrollment relationships, recalculated program and location capacities, preserved inmateNumbers/name/sex/programsCompleted and approval/rejection status.`,
        });
      } catch (auditErr) {
        console.error("Error creating audit log for reduceMailUser:", auditErr);
      }
      return res.json({
        message:
          "Mail user reduced successfully. Relationships cleaned up, capacities recalculated, and minimal record preserved.",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error reducing mail user" });
    }
  },


  // DELETE - Delete a mailing list entry by id
  deleteMailEntry: async (req, res) => {
    const { mailId } = req.params;
    const currentUserId = req.userId || req.user?._id;
    try {
      let actingUser = null;
      if (currentUserId) {
        actingUser = await db.User.findById(currentUserId).lean();
      }
      const mailUser = await db.Mail.findById(mailId).lean();
      if (!mailUser) {
        return res.status(404).json({ message: "Mail user not found" });
      }
      if (mailUser.mentor) {
        await db.User.findByIdAndUpdate(
          mailUser.mentor,
          { $pull: { currentMentee: mailUser?._id } },
          { new: true }
        );
      }
      await db.User.updateMany(
        { currentMentee: mailUser?._id },
        { $pull: { currentMentee: mailUser?._id } }
      );
      if (Array.isArray(mailUser.livingLocation) && mailUser.livingLocation.length > 0) {
        await db.Location.updateMany(
          {
            _id: { $in: mailUser.livingLocation },
            locationMentee: mailUser?._id,
          },
          {
            $pull: { locationMentee: mailUser?._id },
            $inc: { currentCapacity: 1 },
          }
        );
      } else {
        await db.Location.updateMany(
          { locationMentee: mailUser?._id },
          {
            $pull: { locationMentee: mailUser?._id },
            $inc: { currentCapacity: 1 },
          }
        );
      }
      if (Array.isArray(mailUser.programsEnrolled) && mailUser.programsEnrolled.length > 0) {
        // First pull from students subdocuments
        const programUpdateResult = await db.Program.updateMany(
          {
            _id: { $in: mailUser.programsEnrolled },
            "students.mailUser": mailUser?._id,
          },
          {
            $pull: { students: { mailUser: mailUser?._id } },
          }
        );
        if (programUpdateResult.modifiedCount > 0) {
          await db.Program.updateMany(
            {
              _id: { $in: mailUser.programsEnrolled },
              "students.mailUser": { $ne: mailUser?._id },
            },
            { $inc: { currentCapacity: 1 } }
          );
        }
      }
      if (Array.isArray(mailUser.programsCompleted) && mailUser.programsCompleted.length > 0) {
        await db.Program.updateMany(
          {
            _id: { $in: mailUser.programsCompleted },
            "graduates.mailUser": mailUser?._id,
          },
          {
            $pull: { graduates: { mailUser: mailUser?._id } },
          }
        );
      }
      await db.Mail.findByIdAndDelete(mailUser?._id);
      // 8) Audit log
      try {
        await db.AuditLog.create({
          action: "DELETE_MAIL_USER",
          performedBy: actingUser ? actingUser?._id : null,
          performedByFirstName: actingUser?.accountName || "",
          affectedUser: mailUser?._id,
          affectedUserAccountName:
            mailUser.accountName || mailUser.email || mailUser.name || "",
          auditLogStatus: "SUCCESS",
          aboutAuditLog: "Mail user deleted",
          details: `Mail user ${mailUser?._id} deleted by user ${actingUser
              ? `${actingUser.firstName || ""} ${actingUser.lastName || ""} (${actingUser?._id})`
              : "unknown"
            }. Cleaned up mentor relationships, locations, program enrollments (students, currentCapacity), and program graduates.`,
        });
      } catch (auditErr) {
        console.error("Error creating audit log for deleteMailEntry:", auditErr);
      }
      return res.json({
        message: "Mail user and related references removed successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error deleting mail user" });
    }
  },

}

export default menteeController
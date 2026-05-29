import mongoose from "mongoose";
import db from "../db/index.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import config from "../config.js";
import { deleteGridFsFileById } from '../gridfsHelper.js';

// At the very top of your controller file
const MAX_ATTEMPTS = 4;
const COOLDOWN_HOURS = 24;

const authController = {

  // ✅ registers user only if the user is inside the allowedToRegister and not inside the notAllowedToRegister or userIsRegistered then removes the email from allowedToRegister

  registerUser: async (req, res) => {
    try {
      let {
        email,
        profilePic,
        profilePicFileId,
        profilePicBucketName,
        accountName,
        staffPosition,
        firstName,
        lastName,
        location,
        password,
        password2,
        dateOfBirth,
        admin,
        creator,
        NFadmin,
        mentor,
        teacher,
        websiteSupportTeam,
        newsLetter,
        hiring,
        programDirector,
        staffCustomerService,
        eventStaff,
        darkMode,
        sex,
        yourAddress,
        yourPhoneNumber,
        securityQuestions,
        secreteKey,
        currentWorkLocation
      } = req.body;
      console.log("REQ BODY:", req.body);
      email = email?.toLowerCase().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.json({
          message: "Please provide a valid email address (example@example.com)."
        });
      }
      if (!email) {
        return res.json({ message: "Email is required in the request body." });
      }
      const accountNameOriginal = accountName;
      const accountNameNormalized = accountNameOriginal
        ? accountNameOriginal.toLowerCase().trim().replace(/\s+/g, '')
        : null;
      if (!accountNameOriginal?.trim()) {
        return res.json({ message: "Account name is required." });
      }
      if (!firstName?.trim() || !lastName?.trim()) {
        return res.json({ message: "First and Last name are required." });
      }
      if (!yourAddress?.trim()) {
        return res.json({ message: "Address is required." });
      }
      if (!dateOfBirth) {
        return res.json({ message: "Date of birth is required." });
      }
      if (sex && !["male", "female"].includes(sex.toLowerCase())) {
        return res.json({
          message: "Sex must be either 'male' or 'female'."
        });
      }
      if (!yourPhoneNumber) {
        return res.json({ message: "Phone number is required." });
      }
      const normalizedPhone = yourPhoneNumber.toString().trim();
      const usPhoneRegex =
        /^(?:\+?1[\s-]?)?(?:\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;
      if (!usPhoneRegex.test(normalizedPhone)) {
        return res.json({
          message:
            "Provide valid Phone # Example's: (555)555-5555, 555-555-5555, 5555555555"
        });
      }
      const BirthDate = new Date(dateOfBirth);
      const todaysDate = new Date();
      const age =
        (todaysDate - BirthDate) / (365.25 * 24 * 60 * 60 * 1000);
      if (Math.floor(age) < 18) {
        return res.json({
          message: "➡️➡️ SORRY 😞 You MUST be over 18 to join this website. ⬅️⬅️"
        });
      }
      if (accountNameOriginal?.match(/admin/ig)) {
        return res.json({
          message:
            "➡️➡️ Admin is NOT a valid Account-Name please try again. ⬅️⬅️"
        });
      }
      if (password?.length < 8) {
        return res.json({
          message: "➡️➡️ Password must be at least 8 characters ⬅️⬅️"
        });
      }
      if (
        !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)
      ) {
        return res.json({
          message:
            "➡️➡️ Password must contain 8 chars, uppercase, lowercase, number ⬅️⬅️"
        });
      }
      if (password !== password2) {
        return res.json({
          message: "The password do not match, please re-enter"
        });
      }
      if (!Array.isArray(securityQuestions) || securityQuestions.length === 0) {
        return res.status(400).json({
          message:
            "➡️➡️ You must provide at least one security question. ⬅️⬅️"
        });
      }
      for (const sq of securityQuestions) {
        if (!sq.question || !sq.answer) {
          return res.status(400).json({
            message:
              "➡️➡️ All security questions must include question and answer. ⬅️⬅️"
          });
        }
      }
      const selectedQuestions = securityQuestions.map(q => q.question.trim());
      if (new Set(selectedQuestions).size !== selectedQuestions.length) {
        return res.status(400).json({
          message: "➡️➡️ Please choose different security questions. ⬅️⬅️"
        });
      }
      const plainSecurityQuestions = securityQuestions.map(q => ({
        question: q.question.trim(),
        answer: q.answer.trim().toLowerCase()
      }));
      if (!secreteKey || secreteKey.trim().length < 4) {
        return res.status(400).json({
          message:
            "➡️➡️ Security key must be at least 4 characters long. ⬅️⬅️"
        });
      }
      const allowedDoc = await db.Allowed.findOne({});
      if (!allowedDoc) {
        return res.json({
          message:
            "You Are Not Allowed To Register. Please Contact Support."
        });
      }
      const { allowedToRegister = [], notAllowedToRegister = [], userIsRegistered = [] } =
        allowedDoc;
      if (!allowedToRegister.includes(email)) {
        return res.json({
          message: "This email is not authorized to register."
        });
      }
      if (notAllowedToRegister.includes(email)) {
        return res.json({
          message:
            "This email is not allowed to register on this site."
        });
      }
      if (userIsRegistered.includes(email)) {
        return res.json({
          message:
            "This email has already completed registration."
        });
      }
      const emailExists = await db.User.findOne({ email });
      if (emailExists) {
        return res.json({
          message: "➡️➡️ Email Already exists in this database ⬅️⬅️"
        });
      }
      const accountExists = await db.User.findOne({
        accountNameNormalized
      });
      if (accountExists) {
        return res.json({
          message:
            "➡️➡️ Account Name already exists, Please Try again ⬅️⬅️"
        });
      }
      const hashedPassword = bcrypt.hashSync(password, 10);
      const hashedSecretKey = bcrypt.hashSync(secreteKey.trim(), 10);
      admin = Boolean(admin);
      creator = Boolean(creator);
      NFadmin = Boolean(NFadmin);
      mentor = Boolean(mentor);
      teacher = Boolean(teacher);
      websiteSupportTeam = Boolean(websiteSupportTeam);
      newsLetter = Boolean(newsLetter);
      hiring = Boolean(hiring);
      programDirector = Boolean(programDirector);
      staffCustomerService = Boolean(staffCustomerService);
      eventStaff = Boolean(eventStaff);
      darkMode = Boolean(darkMode);
      const newUser = new db.User({
        profilePic,
        profilePicFileId,
        profilePicBucketName,
        accountName: accountNameOriginal.trim(),
        accountNameNormalized,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        staffPosition,
        workLocation: location || undefined,
        currentWorkLocation,
        sex: sex ? sex.toLowerCase() : undefined,
        yourAddress: yourAddress.trim(),
        yourPhoneNumber: normalizedPhone,
        email,
        password: hashedPassword,
        dateOfBirth,
        admin,
        creator,
        NFadmin,
        mentor,
        teacher,
        websiteSupportTeam,
        newsLetter,
        hiring,
        programDirector,
        staffCustomerService,
        eventStaff,
        darkMode,
        securityQuestions: plainSecurityQuestions,
        secreteKey: hashedSecretKey
      });
      const savedUser = await newUser.save();
      await db.Allowed.updateOne(
        { _id: allowedDoc._id },
        {
          $pull: { allowedToRegister: email },
          $addToSet: { userIsRegistered: email }
        }
      );
      const action = `User-Registered - Account Name: ${accountNameOriginal} Email: ${email}`;
      await db.AuditLog.create({
        action,
        meta: {
          userId: savedUser._id,
          accountName: accountNameOriginal,
          email
        }
      });
      return res.json({
        ...savedUser.toObject()
      });
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      return res.status(500).json({
        message: err.message || "Server error. Please try again."
      });
    }
  },

  // ✅ checks and makes sure user is userIsRegistered and not inside notAllowedToRegister and allows email or accountName
  loginUser: async (req, res) => {
    const { identifier, password } = req.body;
    try {
      // Require identifier + password
      if (!identifier || !password) {
        return res.json({
          error: "Identifier (email or account name) and password are required.",
        });
      }
      // Normalize identifier
      const rawIdentifier = identifier.toString().trim();
      let normalizedEmail = null;
      let accountNameNormalized = null;
      // Simple heuristic: if it contains '@', treat as email; else accountName
      if (rawIdentifier.includes("@")) {
        normalizedEmail = rawIdentifier.toLowerCase();
      } else {
        // Same normalization as in registerUser
        accountNameNormalized = rawIdentifier
          .toLowerCase()
          .replace(/\s+/g, "");
      }
      // Build query: allow login by email OR normalized account name
      const orConditions = [];
      if (normalizedEmail) {
        orConditions.push({ email: normalizedEmail });
      }
      if (accountNameNormalized) {
        orConditions.push({ accountNameNormalized });
      }
      if (orConditions.length === 0) {
        return res.json({
          error: "Identifier (email or account name) is invalid.",
        });
      }
      const userQuery =
        orConditions.length === 1 ? orConditions[0] : { $or: orConditions };
      const user = await db.User.findOne(userQuery);
      if (!user) {
        return res.json({
          error:
            "➡️➡️ ⁉️ No matching user found with provided credentials, please register ⬅️⬅️",
        });
      }
      // Admin block check: by resolved user's email
      const IAmAdmin = await db.User.findOne({
        accountName: "ADMIN",
        AdminBlockedUserEmail: user.email,
      });
      if (IAmAdmin) {
        return res.json({
          error: "This Email Has Been Blocked By Admin",
        });
      }
      // Check Allowed schema
      const allowedDoc = await db.Allowed.findOne({});
      if (!allowedDoc) {
        return res.json({
          error:
            "You Are Not Allowed To Register. Please Contact Support.",
        });
      }
      const {
        notAllowedToRegister = [],
      } = allowedDoc;
      // BLOCK if the user's email OR accountName is in notAllowedToRegister
      if (
        notAllowedToRegister.includes(user.email) ||
        notAllowedToRegister.includes(user.accountName)
      ) {
        return res.json({
          error:
            "This email/account is not allowed to log in to this site.",
        });
      }
      // Password check
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.json({
          error:
            "➡️➡️ ⛔ Oh No! Something went wrong! Please check your credentials and try again. ⬅️⬅️",
        });
      }

      // ✅ Update lastLogin on successful login
      user.lastLogin = new Date();
      await user.save(); // will also update updatedAt because of timestamps

      // Success: create token
      const tokenData = {
        id: user?._id,
        email: user.email,
      };
      const token = jwt.sign(tokenData, config.TOKEN, { expiresIn: "1d" });
      const cookieOptions = {
        httpOnly: true,
        secure: true,
      };
      const userSafe = user.toJSON();
      return res.cookie("token", token, cookieOptions).json({
        data: userSafe,
        token,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error during login." });
    }
  },

  // ✅ this is for a user to change their password
  changePassword: async (req, res) => {
    const userId = req.params.userId;
    const { password, passwordNew, password2 } = req.body;
    try {
      if (!password || !passwordNew || !password2) {
        return res.status(400).json({ message: "⛔ All password fields are required." });
      }
      const user = await db.User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "⛔ No user found with that user." });
      }
      const isCurrentValid = await bcrypt.compare(password, user.password);
      if (!isCurrentValid) {
        return res.status(400).json({ message: "⛔ Current password is incorrect." });
      }
      const isSameAsOld = await bcrypt.compare(passwordNew, user.password);
      if (isSameAsOld) {
        return res.status(400).json({
          message: "You cannot use the same password as your current password."
        });
      }
      if (passwordNew.length < 8) {
        return res.status(400).json({
          message: "➡️➡️ Password must be at least 8 characters ⬅️⬅️"
        });
      }
      const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      if (!strongPasswordRegex.test(passwordNew)) {
        return res.status(400).json({
          message: "➡️➡️ ALL PASSWORDS MUST CONTAIN - at least 8 characters -- 1 uppercase letter -- 1 lowercase letter && --1 number ⬅️⬅️"
        });
      }
      if (passwordNew !== password2) {
        return res.status(400).json({ message: "⛔ New passwords do not match." });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(passwordNew, salt);
      user.password = hashedPassword;
      await user.save();
      return res.json({ message: "✅ Password changed successfully!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error during password change." });
    }
  },

  //   ✅ change password for admin to change for a user
  adminChangePassword: async (req, res) => {
    try {
      const userId = req.params.userId;
      const { passwordNew, password2 } = req.body;

      const user = await db.User.findOne({ _id: userId });

      if (!user) return res.status(404).json({ message: "⛔ No user found with that User." });

      if (passwordNew?.length < 8) {
        return res.json({ message: "➡️➡️ Password must be at least 8 characters ⬅️⬅️" });
      }

      if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm).test(passwordNew)) {
        return res.json({ message: "➡️➡️ ALL PASSWORDS MUST CONTAIN - at least 8 characters -- 1 uppercase letter -- 1 lowercase letter && --1 number ⬅️⬅️" })
      } else if (passwordNew !== password2) {
        return res.json({
          message: "⛔ New passwords do not match."
        });
      }

      // ... password checks ...
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(passwordNew, salt);
      user.password = hashedPassword;
      await user.save();
      res.json({ message: "✅ Password changed successfully!" });
    } catch (error) {
      console.error(error); // Log full error on the server
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // ✅
  getUserById: (req, res) => {
    let { _id } = req.params
    db
      .User
      .findById({ _id })
      .then(data => {
        if (data) {
          db
            .User
            .findById({ _id: data._id })
            .select("-password")
            .exec()
            .then(data => res.json(data))

            .catch(err => console.log(err))
        } else {
          res.json({ message: "Something went horribly wrong!!!" })
        }
      })
      .catch(err => console.log(err))
  },

  adminGetAllUsers: async (req, res) => {
    try {
      const users = await db.User
        .find()
        .populate([
          { path: 'successStoryAuthor' },
          { path: 'workLocation' },
          { path: "currentMentee",
            populate: [
              {
                path: "livingLocation",
                model: "Location",
              },
              {
                path: "programsEnrolled",
                model: "Program",
              },
              {
                path: "programsCompleted",
                model: "Program",
              },
            ],
          },
          { path: 'programsTeaching' },
          { path: 'directMsg' },
          { path: 'news' },
          { path: 'post' },
          { path: 'Reply' },
          { path: 'upcomingEvent' },
          { path: "questionsResponded" },
        ]);
      if (!users || users.length === 0) {
        return res.json({ message: 'There are no users in the database.' });
      }
      // password is already removed by userSchema.methods.toJSON
      return res.json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching users.' });
    }
  },

  // ✅
  getAllUsers: (req, res) => {
    // console.log("here",req)
    db
      .User
      .find()
      .populate("programsTeaching")
      .then(data => {
        // console.log("test1", data)
        if (!data) {
          return res.json({ message: "There are no users in the database." })
        } else {
          // console.log("GET AllUsers ", data)
          return res.json(data)
        }
      }).catch(err => console.log(err))

  },

  // ✅
  deleteUser: async (req, res) => {
    const { authId, userId } = req.params;
    const { reason } = req.body;
    try {
      const ghostUserId = new mongoose.Types.ObjectId("000000000000000000000001");
      const user = await db.User.findById(userId);
      if (!user) {
        return res.json({ message: "User DOES NOT exist" });
      }
      const admin = await db.User.findById(authId);
      /*
      ----------------------------------------
      DELETE USER CONVERSATIONS + MESSAGES
      ----------------------------------------
      */
      await Promise.all([
        db.ConversationModel.deleteMany({
          _id: { $in: user.conversation || [] },
        }),
        db.MessagingModel.deleteMany({
          _id: { $in: user.messages || [] },
        }),
        db.Allowed.updateMany(
          { userIsRegistered: user.email },
          { $pull: { userIsRegistered: user.email } }
        ),
      ]);
      /*
      ----------------------------------------
      PROGRAM
      ----------------------------------------
      */
      await db.Program.updateMany(
        { teachers: user?._id },
        { $pull: { teachers: user?._id } }
      );
      /*
      ----------------------------------------
      SUCCESS STORY
      ----------------------------------------
      */
      await db.Success.updateMany(
        { userId: user?._id },
        { $set: { userId: ghostUserId } }
      );
      /*
      ----------------------------------------
      MAIL
      ----------------------------------------
      */
      await db.Mail.updateMany(
        { mentor: user?._id },
        { $set: { mentor: null } }
      );
      await db.Mail.updateMany(
        { "mentorAttached.mentorId": user?._id },
        {
          $set: {
            "mentorAttached.$[elem].mentorId": ghostUserId,
          },
        },
        {
          arrayFilters: [{ "elem.mentorId": user?._id }],
        }
      );
      await db.Mail.updateMany(
        { "receivedMsgs.createdBy": user?._id },
        {
          $set: {
            "receivedMsgs.$[msg].createdBy": ghostUserId,
          },
        },
        {
          arrayFilters: [{ "msg.createdBy": user?._id }],
        }
      );
      await db.Mail.updateMany(
        { "approvedAcceptance.approvedBy": user?._id },
        {
          $set: {
            "approvedAcceptance.approvedBy": ghostUserId,
          },
        }
      );
      await db.Mail.updateMany(
        { "rejectedAcceptance.rejectedBy": user?._id },
        {
          $set: {
            "rejectedAcceptance.rejectedBy": ghostUserId,
          },
        }
      );
      /*
      ----------------------------------------
      QUESTION
      ----------------------------------------
      */
      await db.Question.updateMany(
        { "response.userId": user?._id },
        {
          $set: {
            "response.$[elem].userId": ghostUserId,
          },
        },
        {
          arrayFilters: [{ "elem.userId": user?._id }],
        }
      );
      await db.Question.updateMany(
        {},
        {
          $pull: {
            seen: { userId: user?._id },
          },
        }
      );
      /*
      ----------------------------------------
      ALLOWED
      ----------------------------------------
      */
      await db.Allowed.updateMany(
        { lastUpdatedBy: user?._id },
        { $set: { lastUpdatedBy: ghostUserId } }
      );
      /*
      ----------------------------------------
      JOB APPLICATION
      ----------------------------------------
      */
      await db.JobApp.updateMany(
        { "reviewedBy.userId": user?._id },
        {
          $set: {
            "reviewedBy.$[elem].userId": ghostUserId,
          },
        },
        {
          arrayFilters: [{ "elem.userId": user?._id }],
        }
      );
      await db.JobApp.updateMany(
        { "interviews.interviewer": user?._id },
        {
          $set: {
            "interviews.$[elem].interviewer": ghostUserId,
          },
        },
        {
          arrayFilters: [{ "elem.interviewer": user?._id }],
        }
      );
      /*
      ----------------------------------------
      AUDIT LOG
      ----------------------------------------
      */
      await db.AuditLog.updateMany(
        { performedBy: user?._id },
        { $set: { performedBy: ghostUserId } }
      );
      /*
      ----------------------------------------
      DIRECT MESSAGE
      ----------------------------------------
      */
      await db.DirectMsg.updateMany(
        { userId: user?._id },
        {
          $set: {
            "userId.$[elem]": ghostUserId,
          },
        },
        {
          arrayFilters: [{ elem: user?._id }],
        }
      );
      await db.DirectMsg.updateMany(
        { "response.userId": user?._id },
        {
          $set: {
            "response.$[resp].userId": [ghostUserId],
          },
        },
        {
          arrayFilters: [{ "resp.userId": user?._id }],
        }
      );
      /*
      ----------------------------------------
      DRAWING
      ----------------------------------------
      */
      await db.Drawing.updateMany(
        { uploadedBy: user?._id },
        { $set: { uploadedBy: ghostUserId } }
      );
      /*
      ----------------------------------------
      EVENT
      ----------------------------------------
      */
      await db.Event.updateMany(
        { createdBy: user?._id },
        { $set: { createdBy: ghostUserId } }
      );
      await db.Event.updateMany(
        { "attendees.userComing": user?._id },
        {
          $set: {
            "attendees.$[elem].userComing": ghostUserId,
          },
        },
        {
          arrayFilters: [{ "elem.userComing": user?._id }],
        }
      );
      /*
      ----------------------------------------
      JOB LISTINGS
      ----------------------------------------
      */
      await db.JobList.updateMany(
        { userId: user?._id },
        { $set: { userId: ghostUserId } }
      );
      /*
      ----------------------------------------
      LOCATION
      ----------------------------------------
      */
      await db.Location.updateMany(
        { locationStaff: user?._id },
        { $pull: { locationStaff: user?._id } }
      );
      /*
      ----------------------------------------
      NEWS
      ----------------------------------------
      */
      await db.News.updateMany(
        { userId: user?._id },
        { $set: { userId: ghostUserId } }
      );
      await db.News.updateMany(
        { "reviewedBy.userId": user?._id },
        {
          $set: {
            "reviewedBy.$[elem].userId": ghostUserId,
          },
        },
        {
          arrayFilters: [{ "elem.userId": user?._id }],
        }
      );
      /*
      ----------------------------------------
      POSTS
      ----------------------------------------
      */
      await db.Post.updateMany(
        { userId: user?._id },
        { $set: { userId: ghostUserId } }
      );
      await db.Post.updateMany(
        {},
        {
          $pull: {
            seen: { userId: user?._id },
          },
        }
      );
      /*
      ----------------------------------------
      REPLIES
      ----------------------------------------
      */
      await db.Replies.updateMany(
        { replyUserId: user?._id },
        { $set: { replyUserId: ghostUserId } }
      );
      await db.Replies.updateMany(
        {},
        {
          $pull: {
            seen: { userId: user?._id },
          },
        }
      );
      /*
      ----------------------------------------
      APP NF (VOLUNTEER APPLICATION)
      ----------------------------------------
      */
      await db.AppNF.updateMany(
        { "reviewedBy.userId": user?._id },
        {
          $set: {
            "reviewedBy.$[elem].userId": ghostUserId,
          },
        },
        {
          arrayFilters: [{ "elem.userId": user?._id }],
        }
      );
      await db.AppNF.updateMany(
        { "workEthicNotes.userId": user?._id },
        {
          $set: {
            "workEthicNotes.$[elem].userId": ghostUserId,
          },
        },
        {
          arrayFilters: [{ "elem.userId": user?._id }],
        }
      );
      await db.AppNF.updateMany(
        { "workEthicNotes.workDone.userWhoMadeJobPlacement": user?._id },
        {
          $set: {
            "workEthicNotes.$[].workDone.$[job].userWhoMadeJobPlacement": ghostUserId,
          },
        },
        {
          arrayFilters: [{ "job.userWhoMadeJobPlacement": user?._id }],
        }
      );
      await db.AppNF.updateMany(
        { "interviews.interviewer": user?._id },
        {
          $set: {
            "interviews.$[elem].interviewer": ghostUserId,
          },
        },
        {
          arrayFilters: [{ "elem.interviewer": user?._id }],
        }
      );
      /*
      ----------------------------------------
      GRIDFS PROFILE IMAGE
      ----------------------------------------
      */
      if (user.profilePicFileId && user.profilePicBucketName) {
        try {
          await deleteGridFsFileById(
            user.profilePicBucketName,
            user.profilePicFileId
          );
        } catch (err) {
          console.warn(
            "Failed to delete user profilePic from GridFS (continuing):",
            err.message
          );
        }
      }
      /*
      ----------------------------------------
      AUDIT LOG ENTRY
      ----------------------------------------
      */
      const adminAccountName = admin?.accountName || "Unknown admin";
      const affectedUserAccountName = user.accountName || "";
      await db.AuditLog.create({
        action: `Removed from website ${affectedUserAccountName} by ${adminAccountName} `,
        performedBy: admin?._id || null,
        affectedUser: user?._id,
        affectedUserAccountName,
        userMakingLog: adminAccountName,
        auditLogStatus: "SUCCESS",
        aboutAuditLog: "User removed from website",
        details: reason || "",
      });
      /*
      ----------------------------------------
      SHRINK USER
      ----------------------------------------
      */
      await db.User.findByIdAndUpdate(userId, {
        accountName: "Deleted User",
        firstName: "Deleted",
        lastName: "User",
        email: null,
        password: null,
        yourAddress: null,
        yourPhoneNumber: null,
        profilePic: null,
        profilePicFileId: null,
        profilePicBucketName: null,
        accountDisabled: true,
      });
      return res.json({
        message: "User removed and references safely migrated!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Server error during user deletion.",
      });
    }
  },

  //✅ makes sure accountName is saved properly and makes sure no one can have the same two accountNames and ect. you will need your secrete key to update. To change your secrete key you need your password
  updateProfile: async (req, res) => {
    const { userId } = req.params;
    let {
      profilePic,
      profilePicFileId,
      profilePicBucketName,
      accountName,
      firstName,
      staffPosition,
      lastName,
      sex,                 // NOT allowed to change
      yourAddress,
      yourPhoneNumber,
      // auth / security inputs
      secreteKey,          // used to change NON-secret-key fields
      password,            // used to change secret key
      newSecreteKey,       // new secret key value to set
    } = req.body;
    // We are NOT using token-based auth here.
    // Do NOT allow changing sex at all
    if (typeof sex !== "undefined") {
      return res
        .status(400)
        .json({ message: "You are not allowed to change the sex field." });
    }
    try {
      // 1. Load user
      const userDoc = await db.User.findById(userId);
      if (!userDoc) {
        return res.status(404).json({ message: "User not found." });
      }
      // 2. Determine what kind of update this is
      const wantsProfileUpdate =
        profilePic !== undefined ||
        profilePicFileId !== undefined ||
        profilePicBucketName !== undefined ||
        accountName !== undefined ||
        firstName !== undefined ||
        lastName !== undefined ||
        yourAddress !== undefined ||
        yourPhoneNumber !== undefined;
      const wantsSecretKeyChange = newSecreteKey !== undefined;
      // 2a. If updating profile fields (NOT secret key) → require valid secreteKey
      if (wantsProfileUpdate) {
        if (!secreteKey || !secreteKey.trim()) {
          return res.status(400).json({
            message: "Security key is required to update profile information.",
          });
        }
        const validSecret = bcrypt.compareSync(
          secreteKey.trim(),
          userDoc.secreteKey
        );
        if (!validSecret) {
          return res.status(400).json({ message: "Invalid security key." });
        }
      }
      // 2b. If changing the secret key → require valid password (no old secreteKey required)
      let newHashedSecreteKey;
      if (wantsSecretKeyChange) {
        if (!password || !password.trim()) {
          return res.status(400).json({
            message: "Password is required to change the security key.",
          });
        }
        const isPasswordValid = bcrypt.compareSync(
          password.trim(),
          userDoc.password
        );
        if (!isPasswordValid) {
          return res
            .status(400)
            .json({ message: "Invalid password. Cannot change security key." });
        }
        newHashedSecreteKey = bcrypt.hashSync(newSecreteKey.trim(), 10);
      }
      // 3. Normalization
      // 3. Normalization
      if (accountName) {
        accountName = accountName.trim();
      }
      // Build normalized version for uniqueness (lowercase, trim, remove spaces)
      let accountNameNormalized;
      if (accountName) {
        accountNameNormalized = accountName.toLowerCase().trim().replace(/\s+/g, '');
      }
      if (firstName) firstName = firstName.trim();
      if (lastName) lastName = lastName.trim();
      if (yourAddress) yourAddress = yourAddress.trim();
      // 4. accountName rules
      if (accountName?.match(/admin/gi)) {
        return res.status(400).json({
          message: "Admin is NOT a valid Account-Name. Please try again with a different name.",
        });
      }
      if (accountName && accountName !== userDoc.accountName) {
        // Use normalized value for uniqueness
        const existingAccount = await db.User.findOne({
          _id: { $ne: userId },
          accountNameNormalized,
        });
        if (existingAccount) {
          return res.status(409).json({
            message: "Account Name already exists. Please try again.",
          });
        }
      }
      // 5. US phone validation
      let normalizedPhone;
      if (yourPhoneNumber) {
        normalizedPhone = yourPhoneNumber.toString().trim();
        // Accepts: (555)555-5555, 555-555-5555, 5555555555,
        //          +1 555-555-5555, 1-555-555-5555, 1(555)555-5555,
        //          15555555555, 1 555-555-5555, 1 (555) 555 5555, (555) 555 5555
        const usPhoneRegex = /^(?:\+?1[\s-]?)?(?:\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;
        if (!usPhoneRegex.test(normalizedPhone)) {
          return res.status(400).json({
            message:
              "Please provide a valid US phone number (e.g. 555-123-4567 or +1 555-123-4567).",
          });
        }
      }
      // 6. Build update object
      const updateFields = {
        profilePic,
        profilePicFileId,
        profilePicBucketName,
        accountName,
        staffPosition,
        accountNameNormalized,
        firstName,
        lastName,
        yourAddress,
        yourPhoneNumber: normalizedPhone,
      };
      // Only keep provided fields
      Object.keys(updateFields).forEach((key) => {
        if (updateFields[key] === undefined) {
          delete updateFields[key];
        }
      });
      // Add new secret key if requested
      if (newHashedSecreteKey) {
        updateFields.secreteKey = newHashedSecreteKey;
      }
      // If nothing to update, return early
      if (!Object.keys(updateFields).length) {
        return res.status(400).json({ message: "No fields to update." });
      }
      const updated = await db.User.findByIdAndUpdate(userId, updateFields, {
        new: true,
        runValidators: true,
      });
      if (!updated) {
        return res.json({ message: "User Information Is NOT In Database" });
      }
      const data = await db.User
        .findById(userId)
        .select("-password -secreteKey");
      // Since we're not using token auth, just return the updated user
      return res.json({ data });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error updating profile." });
    }
  },
 
  adminUpdateProfile: async (req, res) => {
    const { adminId, userId } = req.params;

    let {
      profilePic,
      profilePicFileId,
      profilePicBucketName,
      accountName,
      firstName,
      staffPosition,
      lastName,
      sex, // NOT allowed to change
      yourAddress,
      yourPhoneNumber,
      // password change for TARGET user (no old password needed)
      newPassword,
      // role booleans (no "admin" here on purpose)
      NFadmin,
      creator,
      mentor,
      teacher,
      newsLetter,
      hiring,
      staffCustomerService,
      websiteSupportTeam,
      eventStaff,
      // audit extra input if you want
      auditLogStatus,
      aboutAuditLog,
    } = req.body || {};

    console.log(req.body)

    // Do NOT allow changing sex
    if (typeof sex !== "undefined") {
      return res
        .status(400)
        .json({ message: "You are not allowed to change the sex field." });
    }
    try {
      // 0. Load and verify admin
      const adminUser = await db.User.findById(adminId);
      if (!adminUser) {
        return res.status(404).json({ message: "Admin user not found." });
      }
      const isAdmin =
        adminUser.admin === true ||
        adminUser.NFadmin === true ||
        adminUser.creator === true; // adjust as needed
      if (!isAdmin) {
        return res
          .status(403)
          .json({ message: "You do not have permission to update this profile." });
      }
      // 1. Load target user (BEFORE change so we can compute diffs)
      const userDoc = await db.User.findById(userId);
      if (!userDoc) {
        return res.status(404).json({ message: "User not found." });
      }
      // 2. Normalization
      if (accountName) {
        accountName = accountName.trim();
      }
      // Normalized account name
      let accountNameNormalized;
      if (accountName) {
        accountNameNormalized = accountName
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "");
      }
      if (firstName) firstName = firstName.trim();
      if (lastName) lastName = lastName.trim();
      if (yourAddress) yourAddress = yourAddress.trim();
      // 3. accountName rules
      if (accountName?.match(/admin/gi)) {
        return res.status(400).json({
          message:
            "Admin is NOT a valid Account-Name. Please try again with a different name.",
        });
      }
      if (accountName && accountName !== userDoc.accountName) {
        const existingAccount = await db.User.findOne({
          _id: { $ne: userId },
          accountNameNormalized,
        });
        if (existingAccount) {
          return res.status(409).json({
            message: "Account Name already exists. Please try again.",
          });
        }
      }
      // 4. US phone validation
      let normalizedPhone;
      if (yourPhoneNumber) {
        normalizedPhone = yourPhoneNumber.toString().trim();
        const usPhoneRegex =
          /^(?:\+?1[\s-]?)?(?:\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;
        if (!usPhoneRegex.test(normalizedPhone)) {
          return res.status(400).json({
            message:
              "Please provide a valid US phone number (e.g. 555-123-4567 or +1 555-123-4567).",
          });
        }
      }
      // 5. Build update object for non-sensitive fields
      const updateFields = {
        profilePic,
        profilePicFileId,
        profilePicBucketName,
        accountName,
        accountNameNormalized,
        firstName,
        lastName,
        yourAddress,
        yourPhoneNumber: normalizedPhone,
        staffPosition,
        // role flags (admin NOT included)
        NFadmin,
        creator,
        mentor,
        teacher,
        newsLetter,
        hiring,
        staffCustomerService,
        websiteSupportTeam,
        eventStaff,
      };
      // Remove undefined fields so we only change what was sent
      Object.keys(updateFields).forEach((key) => {
        if (updateFields[key] === undefined) {
          delete updateFields[key];
        }
      });
      // 6. Handle password change for target user (allowed without old password)
      if (newPassword && newPassword.trim()) {
        // you can enforce min length if you like
        if (newPassword.trim().length < 8) {
          return res.status(400).json({
            message: "New password must be at least 8 characters long.",
          });
        }
        const hashedPassword = bcrypt.hashSync(newPassword.trim(), 10);
        updateFields.password = hashedPassword;
      }
      // IMPORTANT: Do NOT allow changing secreteKey or securityQuestions/answers
      // So we simply never add those fields to updateFields.
      if (!Object.keys(updateFields).length) {
        return res.status(400).json({ message: "No fields to update." });
      }
      // 7. Compute changes for audit log BEFORE saving
      const oldValues = {
        profilePic: userDoc.profilePic,
        profilePicFileId: userDoc.profilePicFileId,
        profilePicBucketName: userDoc.profilePicBucketName,
        accountName: userDoc.accountName,
        accountNameNormalized: userDoc.accountNameNormalized,
        firstName: userDoc.firstName,
        lastName: userDoc.lastName,
        yourAddress: userDoc.yourAddress,
        yourPhoneNumber: userDoc.yourPhoneNumber,
        staffPosition: userDoc.staffPosition,
        NFadmin: userDoc.NFadmin,
        creator: userDoc.creator,
        mentor: userDoc.mentor,
        teacher: userDoc.teacher,
        newsLetter: userDoc.newsLetter,
        hiring: userDoc.hiring,
        staffCustomerService: userDoc.staffCustomerService,
        websiteSupportTeam: userDoc.websiteSupportTeam,
        eventStaff: userDoc.eventStaff,
      };
      const changes = {};
      for (const [field, newVal] of Object.entries(updateFields)) {
        // don't log password contents, just that it changed
        if (field === "password") {
          changes.password = {
            old: "********",
            new: "********",
          };
          continue;
        }
        const oldVal = oldValues[field];
        // Simple deep-ish compare; adjust as needed
        if (String(oldVal) !== String(newVal)) {
          changes[field] = {
            old: oldVal,
            new: newVal,
          };
        }
      }
      // 8. Apply update
      const updated = await db.User.findByIdAndUpdate(userId, updateFields, {
        new: true,
        runValidators: true,
      });
      if (!updated) {
        return res.json({ message: "User Information Is NOT In Database" });
      }
      // 9. Create audit log entry
      try {
        const detailsObj = {
          changes, // field-level diffs
        };
        const auditLogDoc = new db.AuditLog({
          action: `Updated Profile ${adminUser.accountName} updated user ${updated.accountName}, roles, or password via adminUpdateProfile.`,
          performedBy: adminUser?._id,
          performedByFirstName: adminUser.firstName,
          performedByLastName: adminUser.lastName,
          affectedUser: updated._id,
          affectedUserAccountName: updated.accountName,
          userMakingLog: adminUser.accountName,
          auditLogStatus: auditLogStatus || "completed",
          aboutAuditLog:
            aboutAuditLog ||
            `${adminUser.accountName} updated user ${updated.accountName}, roles, or password via adminUpdateProfile.`,
          details: JSON.stringify(detailsObj),
          // adminQuestionId: you can pass from req.body if needed
          adminQuestionId: req.body.adminQuestionId || undefined,
        });
        await auditLogDoc.save();
      } catch (logErr) {
        // Don’t block the response if audit log fails, just log it
        console.error("Error writing audit log:", logErr);
      }
      const data = await db.User.findById(userId).select("-password -secreteKey");
      return res.json({ data });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error updating profile." });
    }
  },

  // ✅ works for single OR multiple adds, this will make sure any emails already in array will not add them, but allow any emails in the array not present to be added. IF this is inside of notAllowedEmail array it will not allow a user to add into this array. checks userIsRegistered and makes sure user is not already registered
  addAllowedEmail: async (req, res) => {
    try {
      const { email, userId } = req.body;
  
      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }
  
      // Check if any users exist (bootstrap logic)
      const userCount = await db.User.countDocuments();
  
      let user = null;
      let userFirstName = "System";
      let userEmail = "system";
  
      if (userCount > 0) {
        if (!userId) {
          return res.status(400).json({ message: "userId is required." });
        }
  
        user = await db.User.findById(userId);
  
        if (!user) {
          return res.status(400).json({
            message: "User not found for given userId."
          });
        }
  
        userFirstName = user.accountName;
        userEmail = user.email;
      }
  
      // Normalize emails
      let emails = email
        .split(",")
        .map(e => e.trim().toLowerCase())
        .filter(e => e.length > 0);
  
      if (emails.length === 0) {
        return res.status(400).json({
          message: "No valid email addresses provided."
        });
      }
  
      const uniqueRequestEmails = [...new Set(emails)];
  
      let doc = await db.Allowed.findOne();
  
      // FIRST TIME DOCUMENT CREATION
      if (!doc) {
        doc = await db.Allowed.create({
          allowedToRegister: uniqueRequestEmails,
          notAllowedToRegister: [],
          userIsRegistered: [],
          lastUpdatedBy: userId || null
        });
  
        await db.AuditLog.create({
          action: `Added Allowed Email - Admin ${userFirstName}`,
          performedBy: userId || null,
          userMakingLog: userFirstName,
          auditLogStatus: "success",
          aboutAuditLog: "Added allowed email(s) (initial Allowed document)",
          details: `Added: ${uniqueRequestEmails.join(", ")}`
        });
  
        return res.status(201).json({
          message:
            uniqueRequestEmails.length === 1
              ? `Email added to allowedToRegister: ${uniqueRequestEmails[0]}`
              : `Emails added to allowedToRegister: ${uniqueRequestEmails.join(", ")}`,
          added: uniqueRequestEmails,
          alreadyAllowed: [],
          blockedByNotAllowed: [],
          blockedByRegistered: [],
          data: doc
        });
      }
  
      // Normalize existing data
      const allowedSet = new Set(doc.allowedToRegister.map(e => e.toLowerCase()));
      const notAllowedSet = new Set(doc.notAllowedToRegister.map(e => e.toLowerCase()));
      const registeredSet = new Set(doc.userIsRegistered.map(e => e.toLowerCase()));
  
      const added = [];
      const alreadyAllowed = [];
      const blockedByNotAllowed = [];
      const blockedByRegistered = [];
  
      for (const em of uniqueRequestEmails) {
        if (notAllowedSet.has(em)) {
          blockedByNotAllowed.push(em);
        } else if (registeredSet.has(em)) {
          blockedByRegistered.push(em);
        } else if (allowedSet.has(em)) {
          alreadyAllowed.push(em);
        } else {
          added.push(em);
        }
      }
  
      // Apply changes
      if (added.length > 0) {
        doc.allowedToRegister.push(...added);
        doc.lastUpdatedBy = userId || null;
        await doc.save();
      }
  
      // Build response message
      const messageParts = [];
  
      if (added.length > 0) {
        messageParts.push(
          added.length === 1
            ? `Email added to allowedToRegister: ${added[0]}`
            : `Emails added to allowedToRegister: ${added.join(", ")}`
        );
      }
  
      if (alreadyAllowed.length > 0) {
        messageParts.push(
          alreadyAllowed.length === 1
            ? `Email already in allowedToRegister: ${alreadyAllowed[0]}`
            : `Emails already in allowedToRegister: ${alreadyAllowed.join(", ")}`
        );
      }
  
      if (blockedByNotAllowed.length > 0) {
        messageParts.push(
          blockedByNotAllowed.length === 1
            ? `Email blocked by notAllowedToRegister: ${blockedByNotAllowed[0]}`
            : `Emails blocked by notAllowedToRegister: ${blockedByNotAllowed.join(", ")}`
        );
      }
  
      if (blockedByRegistered.length > 0) {
        messageParts.push(
          blockedByRegistered.length === 1
            ? `Email already registered: ${blockedByRegistered[0]}`
            : `Emails already registered: ${blockedByRegistered.join(", ")}`
        );
      }
  
      if (messageParts.length === 0) {
        messageParts.push(
          "No emails were added; all were already allowed or blocked."
        );
      }
  
      const message = messageParts.join(" | ");
  
      await db.AuditLog.create({
        action: `Added Allowed Email - Admin ${userFirstName}`,
        performedBy: userId || null,
        userMakingLog: userFirstName,
        auditLogStatus: added.length > 0 ? "success" : "no_change",
        aboutAuditLog:
          added.length > 0
            ? "Added allowed email(s)"
            : "Attempted to add allowed email(s) but nothing changed",
        details: `Requested: ${uniqueRequestEmails.join(", ")} | Added: ${added.join(", ")} | AlreadyAllowed: ${alreadyAllowed.join(", ")} | BlockedByNotAllowed: ${blockedByNotAllowed.join(", ")} | BlockedByRegistered: ${blockedByRegistered.join(", ")}`
      });
  
      return res.status(200).json({
        message,
        added,
        alreadyAllowed,
        blockedByNotAllowed,
        blockedByRegistered,
        data: doc
      });
  
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Error adding email(s) to allowedToRegister."
      });
    }
  },  

  // ✅ works for single OR multiple removal, this will make sure any emails already in array will not remove them, but allow any emails in the array not present to be added.
  removeAllowedEmail: async (req, res) => {
    try {
      const { email, userId } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }
      if (!userId) {
        return res.status(400).json({ message: "userId is required." });
      }
      // Look up user for audit info
      const user = await db.User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: "User not found for given userId." });
      }
      const userFirstName = user.accountName;
      const userEmail = user.email;
      // Support multiple emails separated by commas
      const emails = email
        .split(",")
        .map(e => e.trim().toLowerCase())
        .filter(e => e.length > 0);
      if (emails.length === 0) {
        return res
          .status(400)
          .json({ message: "No valid email addresses provided." });
      }
      const doc = await db.Allowed.findOne();
      if (!doc) {
        return res.status(404).json({ message: "No Allowed document found." });
      }
      // Normalize existing list for comparison
      const existingSet = new Set(doc.allowedToRegister.map(e => e.toLowerCase()));
      const removed = [];
      const notFound = [];
      for (const em of emails) {
        if (existingSet.has(em)) {
          removed.push(em);
        } else {
          notFound.push(em);
        }
      }
      // If there are emails to remove, update the array
      if (removed.length > 0) {
        doc.allowedToRegister = doc.allowedToRegister.filter(
          item => !removed.includes(item.toLowerCase())
        );
        doc.lastUpdatedBy = userId;
        await doc.save();
      }
      // Detailed message like the add controller
      const messageParts = [];
      if (removed.length > 0) {
        messageParts.push(
          removed.length === 1
            ? `Removed email: ${removed[0]}`
            : `Removed emails: ${removed.join(", ")}`
        );
      }
      if (notFound.length > 0) {
        messageParts.push(
          notFound.length === 1
            ? `Email not found in allowedToRegister: ${notFound[0]}`
            : `Emails not found in allowedToRegister: ${notFound.join(", ")}`
        );
      }
      if (messageParts.length === 0) {
        messageParts.push(
          "No emails were removed; none were found in allowedToRegister."
        );
      }
      const message = messageParts.join(" | ");
      // Single audit log (no failure logs)
      await db.AuditLog.create({
        action: `Removed Allowed Email ${userFirstName}`,
        performedBy: userId,
        userMakingLog: userFirstName,
        auditLogStatus: removed.length > 0 ? "success" : "no_change",
        aboutAuditLog:
          removed.length > 0
            ? "Removed allowed email(s)"
            : "Attempted to remove allowed email(s) but nothing changed",
        details: `Requested: ${emails.join(
          ", "
        )} | Removed: ${removed.join(
          ", "
        )} | NotFoundInAllowed: ${notFound.join(", ")}`,
      });
      return res.status(200).json({
        message,
        removed,   // explicitly list which were in the array and removed
        notFound,  // explicitly list which were not in the array
        data: doc,
      });
    } catch (err) {
      console.log(err);
      // No failure log
      return res.status(500).json({
        message: "Error removing email(s) from allowedToRegister.",
      });
    }
  },

  // ✅ works for single OR multiple adds, this will make sure any emails already in array will not add them, but allow any emails in the array not present to be added. if the user is inside of allowedToRegister remove this user, and if the user is inside userIsRegistered remove this user
  addNotAllowedEmail: async (req, res) => {
    try {
      let { email, userId } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }
      if (!userId) {
        return res.status(400).json({ message: "userId is required." });
      }
      // Look up the user using userId for audit info
      const user = await db.User.findById(userId);
      if (!user) {
        return res
          .status(400)
          .json({ message: "User not found for given userId." });
      }
      const userFirstName = user.accountName;
      const userEmail = user.email;
      // Normalize incoming email(s): string (comma-separated) or array
      let emails = [];
      if (Array.isArray(email)) {
        emails = email;
      } else if (typeof email === "string") {
        emails = email.split(","); // split on commas
      } else {
        return res.status(400).json({
          message: "Email must be a string or an array of strings.",
        });
      }
      // Trim, lowercase, and remove empties
      emails = emails
        .map((e) => e && e.toString().trim().toLowerCase())
        .filter((e) => !!e);
      if (emails.length === 0) {
        return res.status(400).json({ message: "No valid emails provided." });
      }
      // Deduplicate within this request
      emails = Array.from(new Set(emails));
      // Get or create the Allowed document
      let doc = await db.Allowed.findOne();
      // If no Allowed doc exists, create one with all emails in notAllowedToRegister
      if (!doc) {
        doc = await db.Allowed.create({
          allowedToRegister: [],
          notAllowedToRegister: emails,
          userIsRegistered: [],
          lastUpdatedBy: userId,
        });
        const added = emails;
        const alreadyNotAllowed = [];
        const removedFromAllowed = [];
        const removedFromRegistered = [];
        const message =
          emails.length === 1
            ? `Email added to notAllowedToRegister: ${emails[0]}`
            : `Emails added to notAllowedToRegister: ${emails.join(", ")}`;
        // Audit log for initial create
        await db.AuditLog.create({
          action: `Added Not Allowed Email ${userFirstName}`,
          performedBy: userId,
          userMakingLog: userFirstName,
          auditLogStatus: "success",
          aboutAuditLog:
            "Added not-allowed email(s) (initial Allowed document for notAllowedToRegister)",
          details: `Requested: ${emails.join(
            ", "
          )} | Added: ${added.join(
            ", "
          )} | AlreadyNotAllowed: ${alreadyNotAllowed.join(
            ", "
          )} | RemovedFromAllowed: ${removedFromAllowed.join(
            ", "
          )} | RemovedFromRegistered: ${removedFromRegistered.join(", ")}`,
        });
        return res.status(201).json({
          message,
          added,
          alreadyNotAllowed,
          removedFromAllowed,
          removedFromRegistered,
          data: doc,
        });
      }
      // Normalize existing lists for comparison (always lowercase)
      const existingNotAllowedSet = new Set(
        doc.notAllowedToRegister.map((e) => e.toLowerCase())
      );
      const existingAllowedLower = doc.allowedToRegister.map((e) =>
        e.toLowerCase()
      );
      const existingAllowedSet = new Set(existingAllowedLower);
      const existingRegisteredLower = doc.userIsRegistered.map((e) =>
        e.toLowerCase()
      );
      const existingRegisteredSet = new Set(existingRegisteredLower);
      const added = [];
      const alreadyNotAllowed = [];
      const removedFromAllowed = [];
      const removedFromRegistered = [];
      // Decide what to add to notAllowed and what is already there
      for (const e of emails) {
        if (existingNotAllowedSet.has(e)) {
          alreadyNotAllowed.push(e);
        } else {
          added.push(e);
        }
      }
      // Add only the new ones to notAllowedToRegister
      if (added.length > 0) {
        doc.notAllowedToRegister.push(...added);
      }
      // Remove these emails from allowedToRegister if present
      for (const e of emails) {
        if (existingAllowedSet.has(e)) {
          removedFromAllowed.push(e);
        }
      }
      if (removedFromAllowed.length > 0) {
        doc.allowedToRegister = doc.allowedToRegister.filter(
          (stored) => !removedFromAllowed.includes(stored.toLowerCase())
        );
      }
      // Remove these emails from userIsRegistered if present
      for (const e of emails) {
        if (existingRegisteredSet.has(e)) {
          removedFromRegistered.push(e);
        }
      }
      if (removedFromRegistered.length > 0) {
        doc.userIsRegistered = doc.userIsRegistered.filter(
          (stored) => !removedFromRegistered.includes(stored.toLowerCase())
        );
      }
      // Only update lastUpdatedBy if something actually changed in the doc
      if (
        added.length > 0 ||
        removedFromAllowed.length > 0 ||
        removedFromRegistered.length > 0
      ) {
        doc.lastUpdatedBy = userId;
      }
      await doc.save();
      // Build detailed message
      const messageParts = [];
      if (added.length > 0) {
        messageParts.push(
          added.length === 1
            ? `Email added to notAllowedToRegister: ${added[0]}`
            : `Emails added to notAllowedToRegister: ${added.join(", ")}`
        );
      }
      if (alreadyNotAllowed.length > 0) {
        messageParts.push(
          alreadyNotAllowed.length === 1
            ? `Email already in notAllowedToRegister: ${alreadyNotAllowed[0]}`
            : `Emails already in notAllowedToRegister: ${alreadyNotAllowed.join(
              ", "
            )}`
        );
      }
      if (removedFromAllowed.length > 0) {
        messageParts.push(
          removedFromAllowed.length === 1
            ? `Email removed from allowedToRegister: ${removedFromAllowed[0]}`
            : `Emails removed from allowedToRegister: ${removedFromAllowed.join(
              ", "
            )}`
        );
      }
      if (removedFromRegistered.length > 0) {
        messageParts.push(
          removedFromRegistered.length === 1
            ? `Email removed from userIsRegistered: ${removedFromRegistered[0]}`
            : `Emails removed from userIsRegistered: ${removedFromRegistered.join(
              ", "
            )}`
        );
      }
      if (messageParts.length === 0) {
        messageParts.push(
          "No emails were added; all were already in notAllowedToRegister and none were in allowedToRegister or userIsRegistered."
        );
      }
      const message = messageParts.join(" | ");
      // Single audit log for this request (only success / no_change, no failure logs)
      await db.AuditLog.create({
        action: `Added Not Allowed Email ${userFirstName}`,
        performedBy: userId,
        userMakingLog: userFirstName,
        auditLogStatus:
          added.length > 0 ||
            removedFromAllowed.length > 0 ||
            removedFromRegistered.length > 0
            ? "success"
            : "no_change",
        aboutAuditLog:
          added.length > 0 ||
            removedFromAllowed.length > 0 ||
            removedFromRegistered.length > 0
            ? "Updated not-allowed email(s)"
            : "Attempted to update not-allowed email(s) but nothing changed",
        details: `Requested: ${emails.join(
          ", "
        )} | Added: ${added.join(
          ", "
        )} | AlreadyNotAllowed: ${alreadyNotAllowed.join(
          ", "
        )} | RemovedFromAllowed: ${removedFromAllowed.join(
          ", "
        )} | RemovedFromRegistered: ${removedFromRegistered.join(", ")}`,
      });
      return res.status(200).json({
        message,
        added, // newly added to notAllowedToRegister
        alreadyNotAllowed, // already in notAllowedToRegister
        removedFromAllowed, // removed from allowedToRegister
        removedFromRegistered, // removed from userIsRegistered
        data: doc,
      });
    } catch (err) {
      console.log(err);
      // No failure audit log, matching your addAllowedEmail pattern
      return res.status(500).json({
        message: "Error adding email(s) to notAllowedToRegister.",
      });
    }
  },

  // ✅ works for single OR multiple removal, this will make sure any emails already in array will not remove them, but allow any emails in the array not present to be added.
  removeNotAllowedEmail: async (req, res) => {
    try {
      let { email, userId } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }
      if (!userId) {
        return res.status(400).json({ message: "userId is required." });
      }
      // Look up the user using userId for audit info
      const user = await db.User.findById(userId);
      if (!user) {
        return res
          .status(400)
          .json({ message: "User not found for given userId." });
      }
      const userFirstName = user.accountName;
      const userEmail = user.email;
      // Normalize to an array of emails
      let emails = [];
      if (Array.isArray(email)) {
        emails = email;
      } else if (typeof email === "string") {
        emails = email.split(","); // split on commas
      } else {
        return res.status(400).json({
          message: "Email must be a string or an array of strings.",
        });
      }
      // Trim, lowercase, and remove empties
      emails = emails
        .map((e) => e && e.toString().trim().toLowerCase())
        .filter((e) => !!e);
      if (emails.length === 0) {
        return res.status(400).json({ message: "No valid emails provided." });
      }
      // Deduplicate within this request
      emails = Array.from(new Set(emails));
      const doc = await db.Allowed.findOne();
      if (!doc) {
        return res.status(404).json({
          message: "Allowed configuration document not found.",
        });
      }
      // Build a set of current notAllowedToRegister in lowercase
      const currentLower = doc.notAllowedToRegister.map((e) => e.toLowerCase());
      const currentSet = new Set(currentLower);
      const removed = [];
      const notFound = [];
      for (const e of emails) {
        if (currentSet.has(e)) {
          removed.push(e);
        } else {
          notFound.push(e);
        }
      }
      // If there are emails to remove, filter them out
      if (removed.length > 0) {
        doc.notAllowedToRegister = doc.notAllowedToRegister.filter(
          (stored) => !removed.includes(stored.toLowerCase())
        );
        doc.lastUpdatedBy = userId;
        await doc.save();
      }
      // Build detailed message
      const messageParts = [];
      if (removed.length > 0) {
        messageParts.push(
          removed.length === 1
            ? `Email removed from notAllowedToRegister: ${removed[0]}`
            : `Emails removed from notAllowedToRegister: ${removed.join(", ")}`
        );
      }
      if (notFound.length > 0) {
        messageParts.push(
          notFound.length === 1
            ? `Email not found in notAllowedToRegister: ${notFound[0]}`
            : `Emails not found in notAllowedToRegister: ${notFound.join(", ")}`
        );
      }
      if (messageParts.length === 0) {
        messageParts.push(
          "No emails were removed; none were found in notAllowedToRegister."
        );
      }
      const message = messageParts.join(" | ");
      // Single audit log for this request (success / no_change)
      await db.AuditLog.create({
        action: `Removed Not Allowed Email ${userFirstName} `,
        performedBy: userId,
        userMakingLog: userFirstName,
        auditLogStatus: removed.length > 0 ? "success" : "no_change",
        aboutAuditLog:
          removed.length > 0
            ? "Removed not-allowed email(s)"
            : "Attempted to remove not-allowed email(s) but nothing changed",
        details: `Requested: ${emails.join(
          ", "
        )} | Removed: ${removed.join(", ")} | NotFound: ${notFound.join(", ")}`,
      });
      return res.status(200).json({
        message,
        removed, // actually removed from notAllowedToRegister
        notFound, // not present in notAllowedToRegister
        data: doc,
      });
    } catch (err) {
      console.log(err);
      // No failure audit log, to match your other controllers
      return res.status(500).json({
        message: "Error removing email(s) from notAllowedToRegister.",
      });
    }
  },

  // Get all allowedToRegister emails
  getAllAllowedEmails: (req, res) => {
    db
      .Allowed
      .findOne()
      .then(doc => {
        if (!doc || !doc.allowedToRegister || doc.allowedToRegister.length === 0) {
          return res.json({ message: "There are no allowed emails in the database." });
        } else {
          return res.json(doc.allowedToRegister);
        }
      })
      .catch(err => {
        console.log(err);
        return res.json({ message: "Error getting allowed emails." });
      });
  },

  // Get all notAllowedToRegister emails
  getAllNotAllowedEmails: (req, res) => {
    db
      .Allowed
      .findOne()
      .then(doc => {
        if (!doc || !doc.notAllowedToRegister || doc.notAllowedToRegister.length === 0) {
          return res.json({ message: "There are no not-allowed emails in the database." });
        } else {
          return res.json(doc.notAllowedToRegister);
        }
      })
      .catch(err => {
        console.log(err);
        return res.json({ message: "Error getting not-allowed emails." });
      });

    },

    getAllAuditLogs: (req, res) => {
      // console.log("here",req)
      db.AuditLog.find()
        .then(data => {
          // console.log("test1", data)
          if (!data) {
            return res.json({ message: "There are no auditLogs in the database." })
          } else {
            // console.log("GET AllUsers ", data)
            return res.json(data)
          }
        }).catch(err => console.log(err))
  
    },

  // controller
deleteAuditLog: async (req, res) => {
  try {
    const { id } = req.params

    // 1) Delete the audit log and get the document back
    const deletedLog = await db.AuditLog.findByIdAndDelete(id)

    if (!deletedLog) {
      return res.status(404).json({
        message: `AuditLog with id ${id} not found.`,
      })
    }

    // 2) Delete any questions that reference this audit log
    const questionDeleteFilter = {
      $or: [
        ...(deletedLog.adminQuestionId ? [{ _id: deletedLog.adminQuestionId }] : []),
        { auditLogReport: deletedLog._id },
      ],
    }

    let deletedQuestionsResult = { deletedCount: 0 }

    if (questionDeleteFilter.$or.length > 0) {
      deletedQuestionsResult = await db.Question.deleteMany(questionDeleteFilter)
    }

    // 3) Safety: remove audit log reference from any remaining questions
    await db.Question.updateMany(
      { auditLogReport: deletedLog._id },
      { $pull: { auditLogReport: deletedLog._id } }
    )

    // 4) Delete any DirectMsg documents that reference this audit log
    const directMsgDeleteFilter = { auditLogReport: deletedLog._id }
    const deletedDirectMsgsResult = await db.DirectMsg.find(directMsgDeleteFilter).select("_id")

    let deletedDirectMsgsCount = 0

    if (deletedDirectMsgsResult.length > 0) {
      const directMsgIds = deletedDirectMsgsResult.map((doc) => doc._id)

      const deleteDirectMsgResult = await db.DirectMsg.deleteMany({
        _id: { $in: directMsgIds },
      })

      deletedDirectMsgsCount = deleteDirectMsgResult.deletedCount || 0

      // Remove these DirectMsg references from all users' directMsg arrays
      await db.User.updateMany(
        { directMsg: { $in: directMsgIds } },
        { $pull: { directMsg: { $in: directMsgIds } } }
      )
    }

    // 5) Safety: remove audit log reference from any remaining DirectMsg docs
    await db.DirectMsg.updateMany(
      { auditLogReport: deletedLog._id },
      { $pull: { auditLogReport: deletedLog._id } }
    )

    return res.json({
      message: [
        "AuditLog deleted successfully.",
        deletedQuestionsResult.deletedCount > 0
          ? `${deletedQuestionsResult.deletedCount} related question(s) deleted.`
          : "No related questions found or deleted.",
        deletedDirectMsgsCount > 0
          ? `${deletedDirectMsgsCount} related direct message(s) deleted.`
          : "No related direct messages found or deleted.",
      ].join(" "),
      deletedLog,
      deletedQuestionsDeletedCount: deletedQuestionsResult.deletedCount,
      deletedDirectMsgsDeletedCount: deletedDirectMsgsCount,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      message: "Error deleting audit log.",
      error: err.message,
    })
  }
},


  // user can change another user "NFadmin" status
  setAdminNFStatus: async (req, res) => {
    try {
      const { userId, authId } = req.params; // IDs come from the route params
      // Find both users in parallel
      const [affectedUser, performedBy] = await Promise.all([
        db.User.findById(userId),
        db.User.findById(authId),
      ]);
      if (!affectedUser) {
        return res
          .status(404)
          .json({ message: `User with id ${userId} not found.` });
      }
      if (!performedBy) {
        return res
          .status(404)
          .json({ message: `Auth user with id ${authId} not found.` });
      }
      // Current value (default false if undefined)
      const oldValue = !!affectedUser.NFadmin;
      const newValue = !oldValue;          // toggle
      // Update NFadmin on the affected user
      affectedUser.NFadmin = newValue;
      const updatedUser = await affectedUser.save();
      // Create audit log entry
      await db.AuditLog.create({
        action: newValue ? `GRANTED_NFADMIN ${performedBy.accountName} On ${affectedUser.accountName}` : `REVOKED_NFADMIN ${performedBy.accountName} On ${affectedUser.accountName}`,
        performedBy: performedBy._id,
            // adjust to your schema
        affectedUser: affectedUser?._id,
        affectedUserAccountName: affectedUser.accountName,      // adjust to your schema
        userMakingLog: performedBy.email || performedBy.accountName,
        auditLogStatus: 'SUCCESS',
        aboutAuditLog: newValue
          ? 'NFadmin role granted (toggled from false to true)'
          : 'NFadmin role revoked (toggled from true to false)',
        details: `User ${performedBy.accountName} (${performedBy._id}) toggled NFadmin from ${oldValue} to ${newValue} for user ${affectedUser.accountName} (${affecteduser?._id})`,
      });
      return res.json({
        message: `User NFadmin status changed from ${oldValue} to ${newValue}.`,
        user: updatedUser,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: 'Error toggling NFadmin status.', error: err.message || err });
    }
  },

  // ✅ apply security access
  setSecurityAccessLevels: async (req, res) => {
    // Access flags allowed to be modified
    const ACCESS_FLAGS = [
      'mentor',
      'teacher',
      'newsLetter',
      'hiring',
      'programDirector',
      'staffCustomerService',
      'websiteSupportTeam',
      'eventStaff',
    ];
    try {
      const { userId, authId } = req.params;
      const { access = {} } = req.body || {};
      // What flags did the client send?
      const requestedFlags = Object.keys(access);
      if (requestedFlags.length === 0) {
        return res.status(400).json({
          message:
            'No access flags provided. Send a body like { "access": { "mentor": true, "teacher": false } }',
        });
      }
      // Validate the flags
      const invalidFlags = requestedFlags.filter(
        (flag) => !ACCESS_FLAGS.includes(flag)
      );
      if (invalidFlags.length > 0) {
        return res.status(400).json({
          message: `Invalid access flag(s): ${invalidFlags.join(
            ', '
          )}. Allowed flags: ${ACCESS_FLAGS.join(', ')}`,
        });
      }
      // Load affected user and admin
      const [affectedUser, performedBy] = await Promise.all([
        db.User.findById(userId),
        db.User.findById(authId),
      ]);
      if (!affectedUser) {
        return res
          .status(404)
          .json({ message: `User with id ${userId} not found.` });
      }
      if (!performedBy) {
        return res
          .status(404)
          .json({ message: `Auth user with id ${authId} not found.` });
      }
      // Apply only the requested access flags
      const changes = [];
      requestedFlags.forEach((flag) => {
        const oldValue = !!affectedUser[flag];
        const newValue = !!access[flag]; // cast to boolean
        if (oldValue !== newValue) {
          affectedUser[flag] = newValue;
          changes.push({ flag, from: oldValue, to: newValue });
        }
      });
      // If nothing actually changed
      if (changes.length === 0) {
        return res.json({
          message: 'No security access levels changed.',
          user: affectedUser,
        });
      }
      const updatedUser = await affectedUser.save();
      // Success audit log only
      // changes is an array like: [{ flag, from, to }, ...]
      const granted = changes
        .filter((c) => c.to === true)
        .map((c) => c.flag);
      const revoked = changes
        .filter((c) => c.to === false)
        .map((c) => c.flag);
      const grantedText = granted.length ? `Granted: ${granted.join(', ')}` : '';
      const revokedText = revoked.length ? `Revoked: ${revoked.join(', ')}` : '';
      const grantRevokeSummary = [grantedText, revokedText].filter(Boolean).join(' | ');
      const changesSummary = changes
        .map((c) => `${c.flag}: ${c.from} -> ${c.to}`)
        .join('; ');
      await db.AuditLog.create({
        action: `UPDATE_SECURITY_ACCESS_LEVELS Admin ${performedBy.accountName} For ${affectedUser.accountName}`,
        performedBy: performedBy._id,
           // adjust to your schema
        affectedUser: affectedUser?._id,
        affectedUserAccountName: affectedUser.accountName,    // adjust to your schema
        userMakingLog: performedBy.email || performedBy.accountName,
        auditLogStatus: 'SUCCESS',
        aboutAuditLog: `Updated user security access levels. ${grantRevokeSummary}`,
        details: `User ${performedBy.accountName} (${performedBy._id}) updated security access levels for ${affectedUser.accountName} (${affectedUser?._id}): ${changesSummary}`,
      });
      return res.json({
        message: 'Security access levels updated successfully.',
        changes,
        user: updatedUser,
      });
    } catch (err) {
      console.error(err);
      // No failure audit log
      return res.status(500).json({
        message: 'Error updating security access levels.',
        error: err.message || err,
      });
    }
  },

  toggleCreatorFlag: async (req, res) => {
    try {
      const { userId, authId } = req.params;
      // 1. Find the target (affected) user
      const user = await db.User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // 2. Find the auth user (the one performing the change)
      const performer = await db.User.findById(authId);
      if (!performer) {
        return res.status(404).json({ message: "Auth user not found" });
      }
      const oldValue = user.creator;
      const newValue = !user.creator;
      // 3. Toggle the value
      user.creator = newValue;
      await user.save();
      // 4. Create audit log entry
      await db.AuditLog.create({
        action: `UPDATE_SECURITY_ACCESS_LEVELS_CREATOR Admin ${performer.accountName} For ${user.accountName}`,
        // who performed the action (authId)
        performedBy: performer._id,
        performedByFirstName: performer.firstName,
        performedByLastName: performer.lastName,
        // who was affected
        affectedUser: user?._id,
        affectedUserAccountName: user.accountName, // adjust to your user schema field
        // free-form description of who is making the log
        userMakingLog:
          performer.accountName ||
          `${performer.firstName || ""} ${performer.lastName || ""}`.trim(),
        auditLogStatus: "success",
        aboutAuditLog: "User creator flag updated",
        details: `creator changed from ${oldValue} to ${newValue} for user ${user?._id}`,
      });
      return res.status(200).json({
        message: "Creator flag updated and audit log recorded",
        user,
      });
    } catch (error) {
      console.error("Error toggling creator flag:", error);
      // Optional: record a failed audit log if we still have authId
      try {
        const { authId } = req.params;
        if (authId) {
          await db.AuditLog.create({
            action: `UPDATE_SECURITY_ACCESS_LEVELS_CREATOR Admin ${performer.accountName} For ${user.accountName}`,
            performedBy: authId,
            auditLogStatus: "failed",
            aboutAuditLog: "Failed to update user creator flag",
            details: error.message,
          });
        }
      } catch (innerErr) {
        console.error("Error writing failure audit log:", innerErr);
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  searchUserList: async (req, res) => {
    try {
      const { q } = req.query;
      console.log("q:", q);
      if (!q || !q.trim()) {
        return res.status(400).json({
          message: "Search term (q) is required.",
        });
      }
      const raw = q.trim();
      const term = raw.toLowerCase();
      // 🎂 Birthday search
      if (term === "birthday" || term === "birthdays" || term === "bday") {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const results = await db.User.aggregate([
          {
          $match: {
          accountDisabled: { $ne: true },
          dateOfBirth: { $exists: true, $ne: null }
          }},
          {
          $match: {
          $expr: {
          $and: [
          { $eq: [{ $month: { $toDate: "$dateOfBirth" } }, month] },
          { $eq: [{ $dayOfMonth: { $toDate: "$dateOfBirth" } }, day] }
          ]}}},
          {
          $project: {
          password: 0,
          accountNameNormalized: 0
          }}]);
        if (!results.length) {
          return res.status(200).json({
            message: "No birthdays today",
            count: 0,
            results: [],
          });
        }
        return res.status(200).json({
          message: `🎂 ${results.length} user(s) have a birthday today`,
          count: results.length,
          results,
        });
      }
      const orConditions = [];
      const escapeRegex = (str) =>
        str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regexCond = (field, safe) => ({
        [field]: { $regex: safe, $options: "i" },
      });
      const safe = escapeRegex(term);
      const maleSynonyms = new Set([
        "male","man","men","boy","boys","guy","guys"
      ]);
      const femaleSynonyms = new Set([
        "female","woman","women","girl","girls","lady","ladies"
      ]);
      if (maleSynonyms.has(term)) {
        orConditions.push({ sex: "male" });
      } else if (femaleSynonyms.has(term)) {
        orConditions.push({ sex: "female" });
      }
      if (term === "admin" || term === "nfadmin") {
        orConditions.push({ NFadmin: true });
      }
      if (term === "mentor" || term === "mentors") {
        orConditions.push({ mentor: true });
      }
      if (term === "teacher" || term === "teachers") {
        orConditions.push({ teacher: true });
      }
      if (term === "newsletter" || term === "news") {
        orConditions.push({ newsLetter: true });
      }
      if (term === "hiring" || term === "recruiter" || term === "recruiting" || term === "hr") {
        orConditions.push({ hiring: true });
      }
      const programDirectorSynonyms = new Set([
        "programdirector","program director","boss","director","leader","manager"
      ]);
      if (programDirectorSynonyms.has(term)) {
        orConditions.push({ programDirector: true });
      }
      const supportSynonyms = new Set([
        "help","service","trouble"
      ]);
      if (supportSynonyms.has(term)) {
        orConditions.push(
          { staffCustomerService: true },
          { websiteSupportTeam: true }
        );
      }
      if (term === "eventstaff" || term === "event staff" || term === "event" || term === "events") {
        orConditions.push({ eventStaff: true });
      }
      const termNoSpaces = term.replace(/\s+/g, "");
      if (termNoSpaces.length > 0) {
        orConditions.push({
          accountNameNormalized: {
            $regex: escapeRegex(termNoSpaces),
            $options: "i",
          },
        });
      }
      orConditions.push(regexCond("accountName", safe));
      orConditions.push(
        regexCond("staffPosition", safe),
        regexCond("firstName", safe),
        regexCond("lastName", safe),
        regexCond("yourAddress", safe),
        regexCond("yourPhoneNumber", safe),
        regexCond("email", safe)
      );
      const filter = {
        $and: [
          { accountDisabled: { $ne: true } },
          { $or: orConditions }
        ]
      };
      const results = await db.User.find(filter)
        .select("-password -accountNameNormalized")
        .lean();
      if (!results.length) {
        return res.status(200).json({
          message: `No User Found With "${raw}"`,
          count: 0,
          results: [],
        });
      }
      return res.status(200).json({
        message: `Found ${results.length} user(s) matching "${raw}"`,
        count: results.length,
        results,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error searching user list" });
    }
  },

  selfServiceChangePassword: async (req, res) => {
    try {
        const {
            email,
            passwordNew: rawPasswordNew,
            password2: rawPassword2,
            securityQuestions,
            dateOfBirth, secreteKey
        } = req.body;
        // Trim whitespace from password inputs
        const passwordNew = rawPasswordNew?.trim();
        const password2 = rawPassword2?.trim();
        let userErrorMessages = [];
        let user = await db.User.findOne({ email });
        if (!email) {
            return res.status(400).json({ message: "⛔ Email is required." });
        }
        if (!user) {
            return res.status(404).json({ message: "⛔ No user found with that email." });
        }
        if (!user.dateOfBirth || !user.securityQuestions?.length) {
            return res.status(400).json({ message: "⛔ User is missing required fields." });
        }
        const now = new Date();
        let anyCheckFailed = false;
        let messageToAdmin = [];
        // Lockout and cooldown checks
        if (
            user.failedResetAttempts >= MAX_ATTEMPTS &&
            user.lastFailedAttempt &&
            (now - new Date(user.lastFailedAttempt)) < COOLDOWN_HOURS * 60 * 60 * 1000
        ) {
            if (!user.adminNotified) {
                await db.ForgotPassword.create({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    // Will add accountName and location in next sections per your instructions
                    securityQuestions: user.securityQuestions,
                    dateOfBirth: user.dateOfBirth,
                    messageToAdmin: [{
                        field: "system",
                        status: "locked",
                        message: "User reached max reset attempts. Admin review required."
                    }]
                })
                user.adminNotified = true;
                await user.save(); // <-- Save the flag update!
            };
            return res.json({
                message: "⛔ You have reached the maximum number of password reset attempts. An admin will review your request."
            });
        }
        // Reset attempt counter after cooldown
        if (
            user.lastFailedAttempt &&
            (now - new Date(user.lastFailedAttempt)) >= COOLDOWN_HOURS * 60 * 60 * 1000
        ) {
            user.failedResetAttempts = 0;
            user.lastFailedAttempt = null;
            await user.save();
        }
        // Date of birth check
        if (user.dateOfBirth === dateOfBirth) {
            messageToAdmin.push({
                field: 'dateOfBirth',
                status: 'correct',
                provided: dateOfBirth,
            });
        } else {
            anyCheckFailed = true;
            userErrorMessages.push("⛔ Date of birth provided is incorrect.");
            messageToAdmin.push({
                field: 'dateOfBirth',
                status: 'incorrect',
                provided: dateOfBirth,
                expected: user.dateOfBirth
            });
        }
        for (let expectedSQ of user.securityQuestions) {
            const match = securityQuestions?.find(
                sq => sq.question && sq.question.trim().toLowerCase() === expectedSQ.question.trim().toLowerCase()
            );
            if (match) {
                // Question matches, check answer
                if (match.answer?.trim().toLowerCase() === expectedSQ.answer.trim().toLowerCase()) {
                    // Both correct
                    messageToAdmin.push({
                        field: `securityAnswer: ${expectedSQ.question}`,
                        status: 'correct',
                        provided: match.answer
                    });
                } else {
                    // Wrong answer, but question matched
                    anyCheckFailed = true;
                    userErrorMessages.push(`⛔ Security answer for question "${expectedSQ.question}" is incorrect.`);
                    messageToAdmin.push({
                        field: `securityAnswer: ${expectedSQ.question}`,
                        status: 'incorrect',
                        provided: match.answer,
                        expected: expectedSQ.answer
                    });
                }
            } else {

                // Question was not answered at all!
                anyCheckFailed = true;
                userErrorMessages.push(`⛔ Security question's do not match.`);
                messageToAdmin.push({
                    field: `Used The Wrong Security Question.`,
                    status: 'incorrect',
                    expected: expectedSQ.question
                });
            }
        }
        // Secret Key Check

        if (secreteKey && user && user.secreteKey) {
            const normalizedInput = secreteKey.toString().trim().toLowerCase();
            const isSecretKeyCorrect = await bcrypt.compare(
                normalizedInput,
                user.secreteKey
            );
            if (isSecretKeyCorrect) {
                messageToAdmin.push({
                    field: 'secretKey',
                    status: 'correct',
                    provided: secreteKey
                });
            } else {
                anyCheckFailed = true;
                userErrorMessages.push("⛔ Secret Key provided is incorrect.");
                messageToAdmin.push({
                    field: 'secretKey',
                    status: 'incorrect',
                    provided: secreteKey
                });
            }
        } else {
            anyCheckFailed = true;
            userErrorMessages.push("⛔ Secret Key is required.");
            messageToAdmin.push({
                field: 'secretKey',
                status: 'missing',
                provided: null
            });
        }
        if (anyCheckFailed) {
            user.failedResetAttempts = (user.failedResetAttempts || 0) + 1;
            user.lastFailedAttempt = now;
            await db.ForgotPassword.create({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                accountName: user.accountName,
                location: user.location,
                securityQuestions: user.securityQuestions,
                dateOfBirth: user.dateOfBirth,
                reportAttempt: (user.failedResetAttempts || 0) + 1,
                reportType: "attempt",
                messageToAdmin
            });
            await user.save();
            return res.json({
                message: "⛔ Some information provided does not match.",
                details: userErrorMessages
            });
        }
        // Password validation
        if (!passwordNew || passwordNew.length < 8) {
            return res.json({ message: "➡️➡️ Password must be at least 8 characters ⬅️⬅️" });
        }
        if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).test(passwordNew)) {
            return res.json({
                message: "➡️➡️ ALL PASSWORDS MUST CONTAIN - at least 8 characters -- 1 uppercase letter -- 1 lowercase letter && --1 number ⬅️⬅️"
            });
        }
        if (passwordNew !== password2) {
            return res.json({ message: "The passwords do not match, please re-enter" });
        }
        // Save new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passwordNew, salt);
        user.password = hashedPassword;
        user.failedResetAttempts = 0;
        user.lastFailedAttempt = null;
        await user.save();
        await db.ForgotPassword.deleteMany({
            email: user.email,
            reportType: "attempt"
        });

        res.json({ message: "✅ Password changed successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
},

getAllForgotPasswords: async (req, res) => {
  try {
      const forgotPasswords = await db.ForgotPassword?.find({});
      res.json(forgotPasswords);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
},

updateMessageStatus: async (req, res) => {
  try {
      const { id, status, adminName, accountName } = req.body;
      const allowedStatuses = [
          "sent-Email",
          "received-Response",
          "completed-Password-Change"
      ];
      if (!id) {
          return res.status(400).json({ error: "Missing id" });
      }
      if (!allowedStatuses.includes(status)) {
          return res.status(400).json({ error: "Invalid status value" });
      }
      const emailDate = new Date().toISOString();
      // Build the update document
      let updateDoc = {
          messageStatus: status,
          adminName: adminName,
          emailDate: emailDate,
      };
      if (status === "received-Response" && accountName) {
          updateDoc.accountName = accountName;
      }
      const result = await db.ForgotPassword.updateOne(
          { _id: id },
          { $set: updateDoc }
      );
      if (result.modifiedCount === 0) {
          return res.status(404).json({ error: "Report not found" });
      }
      // Refetch the record for audit logging if needed
      const forgotPasswordRecord = await db.ForgotPassword.findById(id);
      if (status === "completed-Password-Change") {
          if (!forgotPasswordRecord) {
              return res.status(404).json({ error: "Forgot password record not found" });
          }
          // Use the accountName saved from "received-Response"
          const user = await db.User.findOne({
              $or: [
                  { accountName: forgotPasswordRecord.accountName },
                  { email: forgotPasswordRecord.email }
              ]
          });
          if (!user) {
              return res.status(404).json({ error: "User not found for audit logging" });
          }
          await db.AuditLog.create({
              action: "completed-Password-Change",
              performedByFirstName: adminName,
              affectedForgotPasswordId: id,
              status: status,
              date: emailDate,
              details: {
                  PasswordChangedAccountName: user.accountName,
                  PasswordChangedEmail: user.email,
                  PasswordChangedLocation: user.location
              }
          });
          // Remove all ForgotPassword reports with this accountName
          await db.ForgotPassword.deleteMany({ accountName: user.accountName });
      }
      res.json({ success: true });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
  }
},

deleteForgotPassword: async (req, res) => {
  const { id } = req.params; // You’ll pass the id in the route, e.g. /forgotPassword/:id
  try {
      const result = await db.ForgotPassword?.findByIdAndDelete(id);
      if (!result) {
          return res.status(404).json({ message: "ForgotPassword request not found" });
      }
      res.json({ message: "ForgotPassword request deleted successfully" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
},

getSingleForgotPassword: async (req, res) => {
  try {
      const { id } = req.params;
      const forgotPassword = await db.ForgotPassword?.findById(id);
      if (!forgotPassword) {
          return res.status(404).json({ message: "ForgotPassword not found." });
      }
      res.json(forgotPassword);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
},

}

export default authController
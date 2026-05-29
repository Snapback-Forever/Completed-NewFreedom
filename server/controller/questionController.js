import db from "../db/index.js";

const questionController = {

  addQuestion: async (req, res) => {
    try {
      let {
        title,
        body,
        firstName,
        lastName,
        email,
        phoneNumber,
        responseToMsg,
        userId,
      } = req.body;
  
      console.log(req.body);
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^(?:\+?1[\s-]?)?(?:\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;
  
      if (!title || !body || !firstName || !lastName || !email) {
        return res.status(400).json({ message: "Missing required fields." });
      }
  
      email = email.toLowerCase().trim();
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
      }
  
      if (phoneNumber && phoneNumber.trim() !== "") {
        phoneNumber = phoneNumber.trim().replace(/\s+/g, "");
        if (!phoneRegex.test(phoneNumber)) {
          return res.status(400).json({
            message: "Invalid phone number format. (555)555-5555 OR 1(555)555-5555",
          });
        }
      } else {
        phoneNumber = undefined;
      }
  
      const initialResponse =
        responseToMsg && responseToMsg.trim() !== ""
          ? [
              {
                userId,
                responseToMsg: responseToMsg.trim(),
                questionType: "Q-A",
                responseDate: new Date(),
              },
            ]
          : [];
  
      const question = await db.Question.create({
        title,
        body,
        firstName,
        lastName,
        email,
        ...(phoneNumber ? { phoneNumber } : {}),
        response: initialResponse,
        questionStatus: initialResponse.length > 0 ? "sent-response" : "received-msg",
      });
  
      return res.status(201).json({
        message: "Question Has Been Sent To New Freedom Staff.",
        question,
      });
    } catch (err) {
      console.error("Error creating question:", err);
      return res.status(500).json({ message: "Server error." });
    }
  },
  
  

  // READ - Get all questions
  getAllQuestions: async (req, res) => {
    try {
      const questions = await db.Question
        .find()
        .sort({ createdAt: -1 });  // newest first; uses timestamps from schema
      if (!questions || questions.length === 0) {
        return res.json({
          message: "There are no questions in the database.",
        });
      }
      return res.json(questions);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error fetching questions.",
        error: err.message,
      });
    }
  },

  toggleRespondingStatus: async (req, res) => {
    try {
      const { id, userId } = req.params;
      // Need 'response' as well now
      const question = await db.Question.findById(id).select(
        "questionStatus responding response"
      );
      if (!question) {
        return res.status(404).json({
          message: `Question with id ${id} not found.`,
        });
      }
      const isCurrentlyResponding = question.questionStatus === "responding";
      const currentResponderId = question.responding || ""; // string or ""
      // CASE 1: status is "responding"
      if (isCurrentlyResponding) {
        // If someone else is assigned → block
        if (currentResponderId && currentResponderId !== userId) {
          return res.status(403).json({
            message:
              "You are not the user currently assigned to this question. You cannot toggle the responding status.",
          });
        }
        // If the assigned user is the caller → turn it off
        if (currentResponderId === userId) {
          // Decide next status based on whether there are responses
          const hasResponses =
            Array.isArray(question.response) && question.response.length > 0;
          const nextStatus = hasResponses ? "sent-response" : "received-msg";
          const updatedQuestion = await db.Question.findByIdAndUpdate(
            id,
            {
              $set: {
                questionStatus: nextStatus,
                responding: "", // back to empty string
              },
            },
            { new: true, runValidators: true }
          );
          return res.json({
            message: hasResponses
              ? "Question status set to 'sent-response' and responding user cleared (empty string)."
              : "Question status set back to 'received-msg' and responding user cleared (empty string).",
            question: updatedQuestion,
          });
        }
        // Edge case: status is 'responding' but responding is empty
        return res.status(409).json({
          message:
            "Question is marked as 'responding' but has no assigned user. Please fix this record manually.",
        });
      }
      // CASE 2: status is NOT "responding" (e.g. 'received-msg' or 'sent-response')
      const updatedQuestion = await db.Question.findByIdAndUpdate(
        id,
        {
          $set: {
            questionStatus: "responding",
            responding: userId,
          },
        },
        { new: true, runValidators: true }
      );
      return res.json({
        message:
          "Question status set to 'responding' and this user is now the owner.",
        question: updatedQuestion,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error toggling question responding status.",
        error: err.message,
      });
    }
  },
  
  updateQuestion: async (req, res) => {
    try {
      const { id } = req.params; // Question id
      const {
        userId,        // required: who is responding
        responseToMsg, // required: the response text
        questionType,  // optional; enum: "Msg-To-Admin", "Q-A", "msgToStaff", etc.
        responseGuest,
      } = req.body;
      // Basic validation
      if (!userId || !responseToMsg) {
        return res.status(400).json({
          message: "userId and responseToMsg are required to add a response.",
        });
      }
      // 1) Load the question first so we can inspect existing responses
      const questionDoc = await db.Question.findById(id).select(
        "body firstName lastName email questionType questionStatus response auditLogReport"
      );
      if (!questionDoc) {
        return res.status(404).json({
          message: `Question with id ${id} not found.`,
        });
      }
      // 2) Find the user to get accountName
      const userDoc = await db.User.findById(userId).select("accountName");
      if (!userDoc) {
        return res.status(404).json({
          message: `User with id ${userId} not found.`,
        });
      }
      const accountName = userDoc.accountName || "";
      // 3) Resolve effectiveQuestionType
      let effectiveQuestionType = questionType;
      if (!effectiveQuestionType) {
        const responses = questionDoc.response || [];
        if (responses.length > 0 && responses[responses.length - 1].questionType) {
          effectiveQuestionType = responses[responses.length - 1].questionType;
        } else if (questionDoc.questionType) {
          effectiveQuestionType = questionDoc.questionType;
        } else {
          effectiveQuestionType = "Msg-To-Admin"; // global default
        }
      }
      // 4) Build the response subdocument
      const responseSubdoc = {
        userId, // single ObjectId
        accountName,
        responseToMsg,
        responseGuest,
        questionType: effectiveQuestionType,
        responseDate: new Date(),
      };
      // 5) If this response is Q-A, create an audit log
      let auditLogId = null;
      if (effectiveQuestionType === "Q-A") {
        const logDetailsLines = [
          `Message Type: ${effectiveQuestionType}`,
          `Question Status at Action: completed`,
          `Original Message: ${questionDoc.body || ""}`,
          `Response: ${responseToMsg || ""}`,
        ];
        const auditLog = await db.AuditLog.create({
          action: "QA_RESPONSE_ADDED",
          performedBy: userId,
          performedByFirstName: accountName,
          userMakingLog: accountName,
          auditLogStatus: "completed",
          aboutAuditLog: "Q-A response added and question marked completed",
          details: logDetailsLines.join("\n"),
          adminQuestionId: questionDoc._id,
        });
        auditLogId = auditLog._id;
      }
      // 6) Build the update for the Question
      const newStatus =
        effectiveQuestionType === "Q-A" ? "completed" : "sent-response";
      const updateOps = {
        $push: {
          response: responseSubdoc,
        },
        $set: {
          questionStatus: newStatus,
        },
      };
      // If client explicitly sent questionType, clear `responding`
      if (typeof questionType !== "undefined" && questionType !== null) {
        updateOps.$unset = {
          responding: "",
        };
      }
      if (auditLogId) {
        updateOps.$push.auditLogReport = auditLogId;
      }
      // 7) Apply the update to the Question
      const updatedQuestion = await db.Question.findByIdAndUpdate(
        id,
        updateOps,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedQuestion) {
        return res.status(404).json({
          message: `Question with id ${id} not found.`,
        });
      }
      // 8) Add this question to the User.questionsResponded array
      //    Use $addToSet to avoid duplicates
      await db.User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            questionsResponded: questionDoc._id,
          },
        },
        { new: false }
      );
      return res.json({
        message:
          `Response added, questionStatus updated to '${newStatus}'.` +
          (auditLogId
            ? " Q-A audit log created and attached to question."
            : "") +
          " Question added to user's questionsResponded list.",
        question: updatedQuestion,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error adding response to question.",
        error: err.message,
      });
    }
  },

  // NOT NEEDED ANY LONGER
  updateResponse: async (req, res) => {
    try {
      const { id, responseId } = req.params; // question id, response subdoc id
      const {
        userId,        // who is trying to update (for authorization/check)
        responseToMsg, // new response text (optional)
        questionType, 
        responseGuest // optional new type: "Msg-To-Admin", "Q-A", "msgToStaff", ...
      } = req.body;
      if (!userId) {
        return res.status(400).json({
          message: "userId is required to update a response.",
        });
      }
      if (!responseToMsg && !questionType) {
        return res.status(400).json({
          message:
            "Nothing to update. Provide responseToMsg and/or questionType.",
        });
      }
      // 1) Load the user for accountName (used in audit log)
      const userDoc = await db.User.findById(userId).select("accountName");
      if (!userDoc) {
        return res.status(404).json({
          message: `User with id ${userId} not found.`,
        });
      }
      const accountName = userDoc.accountName || "";
      // 2) Build the $set update for the single response subdocument
      const updateSet = {
        "response.$[resp].responseDate": new Date(), // update timestamp on edit
      };
      if (typeof responseGuest === "string") {
        updateSet["response.$[resp].responseGuest"] = responseGuest;
      }
      if (questionType) {
        updateSet["response.$[resp].questionType"] = questionType;
      }
      // 3) Update the targeted response subdocument
      const updatedQuestion = await db.Question.findByIdAndUpdate(
        id,
        {
          $set: updateSet,
        },
        {
          new: true,
          runValidators: true,
          arrayFilters: [
            {
              "resp._id": responseId,
              // userId is now a single ObjectId, not an array
              "resp.userId": userId, // ensure this user owns the response
            },
          ],
        }
      );
      if (!updatedQuestion) {
        return res.status(404).json({
          message: `Question with id ${id} or response with id ${responseId} not found, or user not authorized.`,
        });
      }
      // 4) Decide the effective questionType after the update
      //    If a new questionType was passed, use that. Otherwise, read from the updated doc.
      let effectiveQuestionType = questionType || null;
      if (!effectiveQuestionType) {
        const updatedResponse = (updatedQuestion.response || []).find(
          (resp) => String(resp._id) === String(responseId)
        );
        effectiveQuestionType = updatedResponse?.questionType || null;
      }
      // 4b) If we have an effectiveQuestionType, ensure ALL responses (and the question)
      //     use this same type, so the thread stays consistent.
      let questionAfterTypeSync = updatedQuestion;
      if (effectiveQuestionType) {
        questionAfterTypeSync = await db.Question.findByIdAndUpdate(
          id,
          {
            $set: {
              "response.$[].questionType": effectiveQuestionType, // all responses
              questionType: effectiveQuestionType,                // question-level type (optional but useful)
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      // Use the question with synced types from this point
      let finalQuestion = questionAfterTypeSync;
      let auditLogId = null;
      // 5) If (now) Q-A -> mark completed + create audit log
      if (effectiveQuestionType === "Q-A") {
        const updatedResponse = (finalQuestion.response || []).find(
          (resp) => String(resp._id) === String(responseId)
        );
        const originalMessage = finalQuestion.body || "";
        const currentResponseText =
          (updatedResponse && updatedResponse.responseToMsg) ||
          responseToMsg ||
          "";
        const logDetailsLines = [
          `Message Type: ${effectiveQuestionType}`,
          `Question Status at Action: completed`,
          `Original Message: ${originalMessage}`,
          `Updated Response: ${currentResponseText}`,
        ];
        const auditLog = await db.AuditLog.create({
          action: "QA_RESPONSE_UPDATED",
          performedBy: userId,
          performedByFirstName: accountName, // accountName as display name
          userMakingLog: accountName,
          auditLogStatus: "completed",
          aboutAuditLog:
            "Response updated/marked as Q-A and question marked completed",
          details: logDetailsLines.join("\n"),
          adminQuestionId: finalQuestion._id, // link back to admin question
        });
        auditLogId = auditLog._id;
        // Mark the question as completed and attach the audit log
        const updateOps = {
          $set: { questionStatus: "completed" },
          $push: { auditLogReport: auditLogId },
        };
        finalQuestion = await db.Question.findByIdAndUpdate(id, updateOps, {
          new: true,
          runValidators: true,
        });
      } else if (effectiveQuestionType) {
        // 6) If the updated response is NOT Q-A, ensure questionStatus is 'sent-response'
        finalQuestion = await db.Question.findByIdAndUpdate(
          id,
          { $set: { questionStatus: "sent-response" } },
          { new: true, runValidators: true }
        );
      }
      return res.json({
        message:
          "Response updated successfully." +
          (auditLogId
            ? " Question marked completed and Q-A audit log created."
            : ""),
        question: finalQuestion,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error updating response.",
        error: err.message,
      });
    }
  },

  deleteQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      // 1) Delete the question and get the document back
      const deletedQuestion = await db.Question.findByIdAndDelete(id);
      if (!deletedQuestion) {
        return res.status(404).json({
          message: `Question with id ${id} not found.`,
        });
      }
      // 2) Remove this question from any user's post[] array
      const updatedUser = await db.User.findOneAndUpdate(
        { post: id },
        { $pull: { post: id } },
        { new: true }
      );
      // 3) Delete any audit logs linked to this question
      // Option A: use the references in auditLogReport (if present)
      const auditLogIds = deletedQuestion.auditLogReport || [];
      if (auditLogIds.length > 0) {
        await db.AuditLog.deleteMany({ _id: { $in: auditLogIds } });
      }
      // Option B (recommended as an extra safeguard): also delete by adminQuestionId
      // This handles any logs that were created but not pushed into auditLogReport
      await db.AuditLog.deleteMany({ adminQuestionId: id });
      // 4) Return result
      if (!updatedUser) {
        return res.json({
          message:
            "Question deleted successfully. No user had this question in their post array. Related audit logs were removed.",
          deleted: deletedQuestion,
        });
      }
      return res.json({
        message:
          "Question deleted successfully, removed from user's post array, and related audit logs were removed.",
        deleted: deletedQuestion,
        user: updatedUser,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error deleting question.",
        error: err.message,
      });
    }
  },

  updateQuestionSeen: (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        message: "userId is required to update seen status.",
      });
    }
    // First try to update an existing seen entry for this user
    db.Question
      .findOneAndUpdate(
        { _id: id, "seen.userId": userId },          // Mongoose will cast userId to ObjectId
        { $set: { "seen.$.seen": true } },
        { new: true }
      )
      .then((data) => {
        if (data) {
          // Found and updated existing seen entry
          return res.json(data);
        }
        // If no existing entry for this user, push a new one
        return db.Question.findByIdAndUpdate(
          id,
          {
            $push: {
              seen: {
                userId,   // again, string from req will be cast to ObjectId
                seen: true,
              },
            },
          },
          { new: true }
        );
      })
      .then((data) => {
        if (!data) {
          return res
            .status(404)
            .json({ message: `Question with id ${id} not found.` });
        }
        return res.json(data);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          message: "Error updating seen status.",
          error: err,
        });
      });
  },

  updateQuestionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { questionStatus, userId } = req.body;
      if (!questionStatus) {
        return res.status(400).json({
          message: "questionStatus is required.",
        });
      }
      const allowedStatuses = ["received-msg", "sent-response", "completed"];
      if (!allowedStatuses.includes(questionStatus)) {
        return res.status(400).json({
          message: `questionStatus must be one of: ${allowedStatuses.join(
            ", "
          )}.`,
        });
      }
      if (!userId) {
        return res.status(400).json({
          message: "userId is required to update questionStatus.",
        });
      }
      // 1) Get user for accountName (for the audit log)
      const userDoc = await db.User.findById(userId).select("accountName");
      if (!userDoc) {
        return res.status(404).json({
          message: `User with id ${userId} not found.`,
        });
      }
      const accountName = userDoc.accountName || "";
      // 2) Load the question first (we need its current type, status, and responses)
      const questionDoc = await db.Question
        .findById(id)
        .select("body questionType questionStatus response auditLogReport");
      if (!questionDoc) {
        return res.status(404).json({
          message: `Question with id ${id} not found.`,
        });
      }
      // If status is already the same, you can either no-op or still log; here we no-op
      if (questionDoc.questionStatus === questionStatus) {
        return res.status(200).json({
          message: `QuestionStatus is already '${questionStatus}'.`,
          question: questionDoc,
        });
      }
      let auditLogId = null;
      // 3) If status is being set to 'completed', create an audit log
      if (questionStatus === "completed") {
        const effectiveQuestionType =
          questionDoc.questionType || "msgToStaff";
        const responsesSummary = (questionDoc.response || [])
          .map(
            (r, idx) =>
              `Response #${idx + 1} (type: ${r.questionType || "msgToStaff"}): ${r.responseToMsg || ""
              }`
          )
          .join("\n");
        const logDetailsLines = [
          `Message Type at Completion: ${effectiveQuestionType}`,
          `New Question Status: completed`,
          `Original Message: ${questionDoc.body || ""}`,
          responsesSummary
            ? `Responses:\n${responsesSummary}`
            : "Responses: (none)",
        ];
        const auditLog = await db.AuditLog.create({
          action: "QUESTION_COMPLETED",
          performedBy: userId,
          performedByFirstName: accountName, // accountName as display name
          userMakingLog: accountName,
          auditLogStatus: "completed",
          aboutAuditLog: "Question status changed to completed",
          details: logDetailsLines.join("\n"),
          adminQuestionId: questionDoc._id, // link back to question
        });
        auditLogId = auditLog._id;
      }
      // 4) Update the question status (and attach audit log if we created one)
      const updateOps = {
        $set: { questionStatus },
      };
      if (auditLogId) {
        updateOps.$push = { auditLogReport: auditLogId };
      }
      const updatedQuestion = await db.Question.findByIdAndUpdate(
        id,
        updateOps,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedQuestion) {
        return res.status(404).json({
          message: `Question with id ${id} not found after update.`,
        });
      }
      return res.json({
        message:
          `QuestionStatus updated to '${questionStatus}'.` +
          (auditLogId
            ? " Completion audit log created and attached to question."
            : ""),
        question: updatedQuestion,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Error updating questionStatus.",
        error: err.message,
      });
    }
  },

  forwardQuestionToDirectMsg: async (req, res) => {
    try {
      const { id } = req.params; // Question _id
      const { recipientUserId, includeAllResponses = true } = req.body;
      if (!recipientUserId) {
        return res.status(400).json({
          message: "recipientUserId is required to create a direct message.",
        });
      }
      // 1) Load the question
      const question = await db.Question.findById(id).select(
        "title body email firstName lastName phoneNumber response questionStatus auditLogReport"
      );
      if (!question) {
        return res.status(404).json({
          message: `Question with id ${id} not found.`,
        });
      }
      // 2) Load the recipient user
      const recipientUser = await db.User
        .findById(recipientUserId)
        .select("accountName");
      if (!recipientUser) {
        return res.status(404).json({
          message: `Recipient user with id ${recipientUserId} not found.`,
        });
      }
      // 3) Build initial responses for the DirectMsg
      let directMsgResponses = [];
      if (includeAllResponses && Array.isArray(question.response)) {
        directMsgResponses = question.response.map((resp) => ({
          userId: resp.userId,             // already an array per your Question schema
          accountName: resp.accountName,
          responseToMsg: resp.responseToMsg,
          guestResponse: resp.guestResponse,
          responseDate: resp.responseDate || new Date(),
        }));
      }
      // 4) Add a forwarding note from the current user, if available
      if (req.user && req.user.id) {
        const forwardingUser = await db.User
          .findById(req.user.id)
          .select("accountName");
        if (forwardingUser) {
          directMsgResponses.push({
            userId: [req.user.id], // array, matching DirectMsg.response[].userId schema
            accountName: forwardingUser.accountName || "System",
            responseToMsg: "This question was forwarded to you.",
            guestResponse: undefined,
            responseDate: new Date(),
          });
        }
      }
      // 5) Create the DirectMsg
      const newDirectMsg = await db.DirectMsg.create({
        userId: [recipientUserId],  // array, per DirectMsg.userId schema
        title: question.title,
        msgBody: question.body,
        response: directMsgResponses,
        email: question.email,
        firstName: question.firstName,
        lastName: question.lastName,
        phoneNumber: question.phoneNumber,
        isReviewed: false,
        // questionStatus will use default: "received-msg"
      });
      // 5b) Link this DirectMsg to the recipient User
      await db.User.findByIdAndUpdate(
        recipientUserId,
        { $addToSet: { directMsg: newDirectMsg._id } }, // avoid duplicates
        { new: true, runValidators: true }
      );
      // 6) Clean up old audit logs related to the Question
      const auditLogIds = question.auditLogReport || [];
      if (auditLogIds.length > 0) {
        await db.AuditLog.deleteMany({ _id: { $in: auditLogIds } });
      }
      await db.AuditLog.deleteMany({ adminQuestionId: id });
      // 7) Delete the original Question so it no longer appears in the question area
      const deletedQuestion = await db.Question.findByIdAndDelete(id);
      return res.json({
        message:
          "Question forwarded as a direct message successfully. Original question and related audit logs were deleted.",
        directMsg: newDirectMsg,
        deletedQuestion,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error forwarding question as direct message.",
        error: err.message,
      });
    }
  },

  searchQuestions: async (req, res) => {
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
  
      const escapeRegex = (str) =>
        str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  
      const safe = escapeRegex(term);
  
      const orConditions = [];
  
      const regexCond = (field, safeValue) => ({
        [field]: { $regex: safeValue, $options: "i" },
      });
  
      // Search in top-level fields
      orConditions.push(
        regexCond("title", safe),
        regexCond("body", safe),
        regexCond("responding", safe)
      );
  
      // Search inside the response array fields
      orConditions.push(
        regexCond("response.responseToMsg", safe),
        regexCond("response.responseGuest", safe)
      );
  
      const filter = {
        $or: orConditions,
      };
  
      const results = await db.Question.find(filter)
        .select("-__v")
        .lean();
  
      if (!results.length) {
        return res.status(200).json({
          message: `No Question Found With "${raw}"`,
          count: 0,
          results: [],
        });
      }
  
      return res.status(200).json({
        message: `Found ${results.length} question(s) matching "${raw}"`,
        count: results.length,
        results,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error searching questions" });
    }
  },
  


}

export default questionController
import db from "../db/index.js";

const directMsgControllers = {
    
  addDirectMsg: async (req, res) => {
    const { userId } = req.params;
    const {
      title,
      msgBody,
      email,
      firstName,
      lastName,
      phoneNumber,
    } = req.body;
    try {
      // 1) Find the user who will receive the message
      const user = await db.User.findById(userId);
      if (!user) {
        return res.json({ message: "No data found for that user" });
      }
      // 2) Create the direct message document
      const newDirectMsg = new db.DirectMsg({
        // IMPORTANT: userId is an ARRAY in your schema
        userId: [user?._id],
        title,
        msgBody,
        email,
        firstName,
        lastName,
        phoneNumber,
        // response: []  // optional, it defaults to empty array
        // isReviewed: false (default)
      });
      const savedDirectMsg = await newDirectMsg.save();
      // 3) Push the direct message ObjectId into the user's directMsg array
      const updatedUser = await db.User.findByIdAndUpdate(
        user?._id,
        { $push: { directMsg: savedDirectMsg._id } },
        { new: true, runValidators: true }
      );
      // DEBUG (temporarily): log to confirm the update actually happened
      // console.log("Updated user directMsg:", updatedUser.directMsg);
      return res.json({
        ...savedDirectMsg.toObject(),
        message: "Direct message sent successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error sending direct message" });
    }
  },

    //   ADD A RESPONSE TO THE DIRECT MSG
    updateDirectMsg: async (req, res) => {
      const { directMsgId } = req.params;
      const {
        accountName,
        responseToMsg,
        questionStatus,
        guestResponse,
        userId,
      } = req.body;
      try {
        // Make sure we have a userId for the response
        if (!userId) {
          return res
            .status(400)
            .json({ message: "userId is required to add a response" });
        }
        // 1) Build the response subdocument
        const responseEntry = {
          // DirectMsg.response[].userId is an ARRAY in your schema
          userId: [userId],
          accountName,
          responseToMsg,
          guestResponse,
          // responseDate will use default: Date.now from the schema
        };
        // 2) Build the update ops for DirectMsg
        const updateOps = {
          $push: { response: responseEntry },
          $set: { isReviewed: true },
        };
        if (questionStatus) {
          updateOps.$set.questionStatus = questionStatus;
        }
        // 3) Update the DirectMsg document
        const updatedDirectMsg = await db.DirectMsg.findByIdAndUpdate(
          directMsgId,
          updateOps,
          { new: true, runValidators: true }
        );
        if (!updatedDirectMsg) {
          return res
            .status(404)
            .json({ message: "No direct message found with that ID" });
        }
        // 4) Ensure this DirectMsg is linked to its User documents
        // DirectMsg.userId is an ARRAY
        const recipientUserIds = Array.isArray(updatedDirectMsg.userId)
          ? updatedDirectMsg.userId
          : [];
        if (recipientUserIds.length > 0) {
          await db.User.updateMany(
            { _id: { $in: recipientUserIds } },
            { $addToSet: { directMsg: updatedDirectMsg._id } }, // avoid duplicates
            { new: true }
          );
        }
        // 5) If status is completed, create an AuditLog and link it
        let auditLogDoc = null;
        if (updatedDirectMsg.questionStatus === "completed") {
          auditLogDoc = await db.AuditLog.create({
            action: "Direct-msg-completed",
            description: `DirectMsg ${updatedDirectMsg._id} marked as completed.`,
            directMsgId: updatedDirectMsg._id,
          });
          await db.DirectMsg.findByIdAndUpdate(
            updatedDirectMsg._id,
            { $push: { auditLogReport: auditLogDoc._id } },
            { new: true }
          );
        }
        return res.json({
          ...updatedDirectMsg.toObject(),
          auditLog: auditLogDoc,
          message:
            updatedDirectMsg.questionStatus === "completed"
              ? "Response added, question marked completed, and audit log created."
              : "Response added successfully!",
        });
      } catch (err) {
        console.error(err);
        if (err.name === "ValidationError") {
          return res.status(400).json({ message: err.message });
        }
        return res
          .status(500)
          .json({ message: "Error updating direct message" });
      }
    },

    updateDirectMsgResponse: async (req, res) => {
      const { directMsgId, responseId } = req.params;
      const {
        accountName,
        responseToMsg,
        guestResponse,
        questionStatus,
      } = req.body;
      try {
        // 1) Build base $set for the response subdocument
        const setOps = {
          "response.$.accountName": accountName,
          "response.$.responseToMsg": responseToMsg,
          "response.$.guestResponse": guestResponse,
          "response.$.responseDate": new Date(), // update timestamp
          isReviewed: true,
        };
        // Optionally update questionStatus if provided
        if (questionStatus) {
          setOps.questionStatus = questionStatus;
        }
        // 2) Update the specific response subdocument
        const updatedDirectMsg = await db.DirectMsg.findOneAndUpdate(
          {
            _id: directMsgId,
            "response._id": responseId, // match specific response subdocument
          },
          {
            $set: setOps,
          },
          { new: true, runValidators: true }
        );
        if (!updatedDirectMsg) {
          return res.status(404).json({
            message: "No direct message/response found with those IDs",
          });
        }
        // 2b) Ensure this DirectMsg is linked to its User documents
        // DirectMsg.userId is an ARRAY in your schema
        const recipientUserIds = Array.isArray(updatedDirectMsg.userId)
          ? updatedDirectMsg.userId
          : [];
        if (recipientUserIds.length > 0) {
          await db.User.updateMany(
            { _id: { $in: recipientUserIds } },
            { $addToSet: { directMsg: updatedDirectMsg._id } }, // avoid duplicates
            { new: true }
          );
        }
        // 3) If questionStatus is completed after this update, create an AuditLog
        let auditLogDoc = null;
        if (updatedDirectMsg.questionStatus === "completed") {
          auditLogDoc = await db.AuditLog.create({
            action: "Direct-msg-completed",
            description: `DirectMsg ${updatedDirectMsg._id} marked as completed (response updated).`,
            directMsgId: updatedDirectMsg._id,
          });
          await db.DirectMsg.findByIdAndUpdate(
            updatedDirectMsg._id,
            { $push: { auditLogReport: auditLogDoc._id } },
            { new: true }
          );
        }
        return res.json({
          ...updatedDirectMsg.toObject(),
          auditLog: auditLogDoc,
          message:
            updatedDirectMsg.questionStatus === "completed"
              ? "Response updated, question marked completed, and audit log created."
              : "Response updated successfully!",
        });
      } catch (err) {
        console.error(err);
        if (err.name === "ValidationError") {
          return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: "Error updating response" });
      }
    },
    
    forwardDirectMsg: async (req, res) => {
      const { directMsgId } = req.params;
      const { targetUserId } = req.body;
     
      try {
        // 1) Make sure the target user exists
        const targetUser = await db.User.findById(targetUserId);
        if (!targetUser) {
          return res
            .status(404)
            .json({ message: "No user found for targetUserId" });
        }
        // 2) Find the DirectMsg so we know who currently has it
        const directMsg = await db.DirectMsg.findById(directMsgId);
        if (!directMsg) {
          return res
            .status(404)
            .json({ message: "No direct message found with that ID" });
        }
        // current owners (ARRAY of ObjectIds per your schema)
        const originalUserIds = Array.isArray(directMsg.userId)
          ? directMsg.userId
          : [];
        // 3) Update the DirectMsg:
        //    - set userId array to the new target user
        //    - set questionStatus to "forwarded"
        const updatedDirectMsg = await db.DirectMsg.findByIdAndUpdate(
          directMsgId,
          {
            $set: {
              // IMPORTANT: keep this as an array to match the schema
              userId: [targetuser?._id],
              questionStatus: "forwarded",
            },
          },
          { new: true, runValidators: true }
        );
        // 4) Remove this DirectMsg from any original users' directMsg arrays
        if (originalUserIds.length > 0) {
          await db.User.updateMany(
            { _id: { $in: originalUserIds } },
            { $pull: { directMsg: directMsg._id } }
          );
        }
        // 5) Add this DirectMsg to the target user's directMsg array
        await db.User.findByIdAndUpdate(
          targetuser?._id,
          { $addToSet: { directMsg: updatedDirectMsg._id } }, // avoid duplicates
          { new: true }
        );
        return res.json({
          ...updatedDirectMsg.toObject(),
          message: "Message forwarded to selected user successfully!",
        });
      } catch (err) {
        console.error(err);
        if (err.name === "ValidationError") {
          return res.status(400).json({ message: err.message });
        }
        return res
          .status(500)
          .json({ message: "Error forwarding direct message" });
      }
    },

    deleteDirectMsg: async (req, res) => {
      const { directMsgId } = req.params;
      try {
        // 1) Find and delete the DirectMsg first
        const deletedDirectMsg = await db.DirectMsg.findByIdAndDelete(directMsgId);
        if (!deletedDirectMsg) {
          return res
            .status(404)
            .json({ message: "No direct message found with that ID" });
        }
        // 2) Remove this DirectMsg reference from all users' directMsg arrays
        await db.User.updateMany(
          { directMsg: directMsgId },
          { $pull: { directMsg: directMsgId } }
        );
        // 3) Delete any attached audit logs referenced by this DirectMsg
        if (
          Array.isArray(deletedDirectMsg.auditLogReport) &&
          deletedDirectMsg.auditLogReport.length > 0
        ) {
          await db.AuditLog.deleteMany({
            _id: { $in: deletedDirectMsg.auditLogReport },
          });
        }
        return res.json({
          message: "Direct message deleted successfully!",
          deletedDirectMsg: deletedDirectMsg.toObject(),
        });
      } catch (err) {
        console.error(err);
        if (err.name === "ValidationError") {
          return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: "Error deleting direct message" });
      }
    },

      getAllDirectMsgAdmin: async (req, res) => {
        try {
          const messages = await db.DirectMsg.find({})
            .exec();
          return res.json({
            directMsg: messages,
            message: "All direct messages fetched successfully!",
          });
        } catch (err) {
          console.error(err);
          if (err.name === "ValidationError") {
            return res.status(400).json({ message: err.message });
          }
          return res.status(500).json({ message: "Error fetching direct messages" });
        }
      },

}

export default directMsgControllers
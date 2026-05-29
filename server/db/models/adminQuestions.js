
import mongoose from "mongoose"

const AdminQuestions = new mongoose.Schema({

    title: {
        type: String,
    },

    body: {
        type: String,
    },

    firstName: { 
        type: String,
    },

    lastName: {
        type: String,
    },

    email: {
        type: String,
    },

    phoneNumber: {
        type: String,
    },

    response: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      accountName: {
        type: String,
        trim: true,
      },
      responseToMsg: {
        type: String,
        required: true,
      },
      responseGuest: {
        type: String,
      },
      questionType: {
        type: String,
        enum: [
          "msgToStaff",
          "Q-A",
          "Success-Story",
          "Msg-To-Admin",
          "Msg-To-Mentor",
          "Msg-To-Teacher",
          "Website-Support",
          "Subscription-Issues",
          `Event-Staff`,
        ],
        default: "msgToStaff",
      },
      responseDate: {
        type: Date,
        default: Date.now,
      },
    }],

    seen: [{
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true, 
        },
        seen: {
          type: Boolean,
          default: false,
        },
      }],

    questionStatus: {
        type: String,
        enum: ["received-msg", "responding", "sent-response", "forwarded", "completed"],
        default: "received-msg"
      },

      responding: {
        type: String
        },

      auditLogReport: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuditLog",
      }],


}, {
    timestamps: true
})

export default mongoose.model('Question', AdminQuestions)
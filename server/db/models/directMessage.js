
import mongoose from "mongoose"

const directMsg = new mongoose.Schema({

    userId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }],

    title: {
      type: String,
      required: true
    },

    msgBody: {
      type: String,
      required: true
    },

    response:  [{

      userId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }],

        accountName: { 
            type: String, 
            trim: true 
        },

        responseToMsg: { 
            type: String
        },

        guestResponse: { 
            type: String
        },

        responseDate: {
            type: Date,
            default: Date.now,
          },
    }],

    email:  {
      type: String,
      required: true
    },

    firstName: {
      type: String,
      required: true
    },

    lastName: {
      type: String,
      required: true
    },

    phoneNumber: {
      type: String,
    },

    isReviewed: {
      type: Boolean,
      default: false
    },

    questionStatus: {
      type: String,
      enum: ["received-msg", "sent-response", "forwarded", "completed"],
      default: "received-msg"
    },

    auditLogReport: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuditLog",
    }],

  }, {
    timestamps: true
  })

  export default mongoose.model("DirectMsg", directMsg)


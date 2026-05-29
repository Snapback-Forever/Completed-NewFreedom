
import mongoose from "mongoose"

const postSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  reply: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reply", 
  }],

  areaOfPost: {
    type: String,
    enum: ["AdminToAdmin", "ToAllStaff", "ToAllTeachers", "ToAllMentors", "ToAGroup" ],
    required: true,
  },

  accountName: {
    type: String,
    required: true
  },

  postTitle: {
    type: String,
  },

  postBody: {
    type: String,
    required: true
  },

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

  // NEW FIELDS FOR GROUP / TARGETED POSTS
  isGroupPost: {
    type: Boolean,
    default: false,
  },

  groupRole: {
    type: String,
    enum: [
      "NFadmin",
      "creator",
      "mentor",
      "teacher",
      "newsLetter",
      "hiring",
      "staffCustomerService",
      "websiteSupportTeam",
      "eventStaff",
    ],
  },

   recipients: [{
      type: String, // normalized accountName
    }],

  isReviewed: {
    type: Boolean,
    default: false
  },

}, {
  timestamps: true
})

export default mongoose.model("Post", postSchema)


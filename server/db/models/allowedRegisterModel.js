import mongoose from "mongoose"

const allowedRegSchema = new mongoose.Schema({

  allowedToRegister: [{
    type: String
  }],

  notAllowedToRegister: [{
    type: String
  }],
  
  userIsRegistered: [{
    type: String
  }],

  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

}, {
  timestamps: true
})

export default mongoose.model("Allowed", allowedRegSchema)

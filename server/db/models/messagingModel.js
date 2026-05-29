import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({

  text: {
    type: String,
    default: ""
  },

  imageUrl: {
    type: String,
    default: ""
  },

  //   MULTER SAVING AREA
  imageFileId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },

  imageBucketName: {
    type: String,
    default: null
  },
  // END OF MULTER Save

  videoUrl: {
    type: String,
    default: ""
  },

  //  MULTER SAVING AREA
  videoFileId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },

  videoBucketName: {
    type: String,
    default: null
  },
  // END OF MULTER Save

  seen: {
    type: Boolean,
    default: false
  },

  accountName: {
    type: String,
    trim: true
 },

  msgByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },



}, {

  timestamps: true

})
export default mongoose.model('Message', messageSchema)






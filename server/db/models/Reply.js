import mongoose from "mongoose"

const ReplySchema = new mongoose.Schema({
    
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },

    replyUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    replyAccountName:  {
        type: String,
        required: true
    },

    replyMessage: {
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

}, {
    timestamps: true
});



export default mongoose.model("Reply", ReplySchema)
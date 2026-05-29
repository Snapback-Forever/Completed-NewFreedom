import mongoose from "mongoose"


const conversationSchema = new mongoose.Schema({

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
  
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
  
    messages : [{
          type : mongoose.Schema.ObjectId,
          ref : 'Message',
          default: []
      }]
  
  }, {
  
    timestamps: true
  
  })

  conversationSchema.index({ sender: 1, receiver: 1 });
  
  export default mongoose.model("Conversation", conversationSchema)
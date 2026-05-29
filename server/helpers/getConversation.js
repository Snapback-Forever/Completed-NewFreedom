import db from "../db/index.js"

const getConversation = async (currentUserId) => {

  if (currentUserId) {
    const currentUserConversation = await db.ConversationModel.find({
      "$or": [
        { sender: currentUserId },
        { receiver: currentUserId }
      ]
    }).sort({ updatedAt: -1 }).populate("messages").populate("sender").populate("receiver")


    // console.log("currentUserConversation", currentUserConversation)

    const conversation = currentUserConversation.map((conv) => {
      const countUnseenMsg = conv?.messages.reduce((preve, curr) => {

        const msgByUserId = curr?.msgByUserId?.toString()
        // console.log("HELLO", curr)
        if (msgByUserId !== currentUserId) {
          return preve + (curr?.seen ? 0 : 1)
        } else {
          return preve
        }
      }, 0)

      return {
        _id: conv?._id,
        sender: conv?.sender,
        receiver: conv?.receiver,
        unSeenMsg: countUnseenMsg,
        lstMsg: conv?.messages[conv?.messages?.length - 1]

      }
    })

    return conversation

  } else {

    return []

  }
}

export default getConversation
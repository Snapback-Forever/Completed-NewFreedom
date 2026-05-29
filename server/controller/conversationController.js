import db from "../db/index.js";
import { deleteGridFsFileById } from '../gridfsHelper.js';

const ConversationController = {

  conversationDelete: async (req, res) => {
    const { convoId } = req.params;
    if (!convoId) {
      return res.json({ message: 'No conversation with that ID.' });
    }
    try {
      // 1. Load the conversation first (so we can see its messages)
      const conversation = await db.ConversationModel.findById(convoId);
      if (!conversation) {
        return res.json({ message: 'No conversation found to delete.' });
      }
      const messageIds = conversation.messages || [];
      // 2. Load all messages in this conversation by their IDs
      const messages = await db.MessagingModel.find({
        _id: { $in: messageIds },
      });
      // 3. Collect GridFS deletions (images + videos for each message)
      const gridfsDeletes = [];
      for (const msg of messages) {
        // Image
        if (msg.imageFileId && msg.imageBucketName) {
          gridfsDeletes.push(
            deleteGridFsFileById(msg.imageBucketName, msg.imageFileId)
          );
        }
        // Video
        if (msg.videoFileId && msg.videoBucketName) {
          gridfsDeletes.push(
            deleteGridFsFileById(msg.videoBucketName, msg.videoFileId)
          );
        }
      }
      // 4. Delete all GridFS files for this conversation
      await Promise.all(gridfsDeletes);
      // 5. Delete all messages from the Message collection
      if (messageIds.length > 0) {
        await db.MessagingModel.deleteMany({ _id: { $in: messageIds } });
        // 6. Remove those messages from all relevant users' messages arrays
        await db.User.updateMany(
          { messages: { $in: messageIds } },
          { $pull: { messages: { $in: messageIds } } }
        );
      }
      // 7. Remove conversation reference from all users
      await db.User.updateMany(
        { conversation: convoId },
        { $pull: { conversation: convoId } }
      );
      // 8. Delete the conversation document itself
      await db.ConversationModel.findByIdAndDelete(convoId);
      return res.json({
        message:
          'Conversation, messages, and associated files deleted successfully!',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error deleting conversation.' });
    }
  },

   getAllConvo: (req, res) => {
      db
         .ConversationModel
         .find({})
         .then(data => res.json(data))
         .catch(err => console.log(err))
   },

   getSingleConvo: (req, res) => {
      let { _id } = req.params
      db
         .ConversationModel
         .findOne({ _id })
         .then(data => res.json(data))
         .catch(err => console.log(err))

   },

}

export default ConversationController
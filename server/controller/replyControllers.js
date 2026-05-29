import db from "../db/index.js"


const replyController = {

  addReply: async (req, res) => {
    const { postId } = req.params;
    const { replyUserId, replyMessage } = req.body;
    console.log(req.params)
    console.log(req.body)
    try {
      // 1) Ensure the post exists
      const post = await db.Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "There is no message with this number" });
      }
      // 2) Find the user to derive replyAccountName
      const user = await db.User.findById(replyUserId).select("accountName");
      if (!user) {
        return res.status(400).json({ message: "Reply user not found." });
      }
      // 3) Create the reply document
      const newReply = new db.Replies({          // or db.Replies, but match the ref
        postId: post._id,
        replyUserId,
        replyAccountName: user.accountName,
        replyMessage,
        seen: [
          {
            userId: replyUserId,
            seen: false,
          },
        ],
      });
      const savedReply = await newReply.save();
      // 4) Push reply _id into the Post's reply array
      const updatedPost = await db.Post.findByIdAndUpdate(
        post._id,
        { $push: { reply: savedReply._id } },   // ensure field is actually named `reply`
        { new: true }
      );
      // console.log('Post after update:', updatedPost);
      return res.status(201).json({
        reply: savedReply,
        message: "Reply created successfully!",
      });
    } catch (err) {
      console.error("addReply error:", err);
      return res.status(500).json({
        message: "Error creating reply.",
        error: err.message,                     // TEMP for debugging
      });
    }
  },

    getSingleReply: (req, res) => {
        let { replyId } = req.params
        // console.log("singlePRODUCT", replyId)
        db
            .Replies
            .findById(replyId)
            .then(data => {
                if (!data) {
                    res.json({ message: "no data" })

                } else {
                    return res.json(data)
                }
            })
            .catch(err => console.log(err))
    },

    getAllReplys: (req, res) => {
        // console.log('IN THE ROUTE');
        db
            .Replies
            .find({})
            .then(data => {
// console.log("HEREERE",data)
                res.json({ data })
            })
            .catch(err => console.log(err))

    },

    deleteReply: async (req, res) => {
        const { replyId } = req.params;
        if (!replyId) {
            return res.json({ message: "No Reply with this ID" }); // For react-hot-toast
        }
        try {
            // Find and delete the reply
            const reply = await db.Replies.findByIdAndDelete(replyId);
            if (!reply) {
                return res.json({ message: "Reply does not exist" }); // For react-hot-toast
            }
            // Remove reply from Post's reply array
            await db.Post.findByIdAndUpdate(
                reply.postId,
                { $pull: { reply: reply._id } },
                { new: true }
            );
            // Remove reply from User's Reply array
            await db.User.findByIdAndUpdate(
                reply.userId,
                { $pull: { Reply: reply._id } },
                { new: true }
            );
            return res.json({ message: "Reply deleted successfully!" }); // For react-hot-toast (success)
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error deleting reply." }); // For react-hot-toast (error)
        }
    },
}
  

export default replyController
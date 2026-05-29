import db from "../db/index.js";

const postControllers = {

  addPost: async (req, res) => {
    const { userId } = req.params;
    const { areaOfPost, postTitle, postBody } = req.body;
    console.log(req.body, "body")
    console.log(req.params, "params")
    try {
      const user = await db.User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "No data found for that user" });
      }
      // Derive accountName from the user document
      // adjust `user.accountName` to match your actual field (e.g. user.username)
      const newPost = new db.Post({
        userId: user?._id,
        areaOfPost,
        postTitle,
        postBody,
        accountName: user.accountName,
        // author is automatically marked as seen on their own post
        seen: [
          {
            userId: user?._id,
            seen: true,
          },
        ],
        // isReviewed uses schema default (false)
      });
      const savedPost = await newPost.save();
      await db.User.findByIdAndUpdate(
        user?._id,
        { $push: { post: savedPost._id } },
        { new: true }
      );
      return res.json({
        ...savedPost.toObject(),
        message: "Post created successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error creating post" });
    }
  },

groupPost: async (req, res) => {
  const { userId } = req.params;
  const {
    postTitle,
    postBody,
    recipientAccountNames, // optional: comma-separated string
    groupRole,             // optional: e.g. "eventStaff"
  } = req.body;
  // Same normalization logic as register controller
  const normalizeName = (name) =>
    name ? name.toLowerCase().trim().replace(/\s+/g, "") : null;
  try {
    const user = await db.User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "No data found for that user" });
    }
    // Sender normalized account name
    const senderAccountNameNormalized = normalizeName(user.accountName);
    // -------------------------------
    // 1) Manual recipients (if provided)
    // -------------------------------
    let originalRecipientNames = [];
    let normalizedRecipients = [];
    if (
      typeof recipientAccountNames === "string" &&
      recipientAccountNames.trim() !== ""
    ) {
      originalRecipientNames = recipientAccountNames
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name.length > 0);
      normalizedRecipients = originalRecipientNames.map((name) => ({
        original: name,
        normalized: normalizeName(name),
      }));
    }
    // Remove sender from manual recipients (so they don't count as "external")
    const filteredRecipients = normalizedRecipients.filter(
      (r) => r.normalized !== senderAccountNameNormalized
    );
    const uniqueNormalizedNames = [
      ...new Set(filteredRecipients.map((r) => r.normalized)),
    ];
    const matchingUsersFromNames = uniqueNormalizedNames.length
      ? await db.User.find({
          accountNameNormalized: { $in: uniqueNormalizedNames },
        })
      : [];
    const validNormalizedSetFromNames = new Set(
      matchingUsersFromNames.map((u) => u.accountNameNormalized)
    );
    const addedRecipients = [];
    const invalidRecipients = [];
    for (const r of filteredRecipients) {
      if (validNormalizedSetFromNames.has(r.normalized)) {
        addedRecipients.push(r.original);
      } else {
        invalidRecipients.push(r.original);
      }
    }
    // -------------------------------
    // 2) Role-based recipients (dropdown selection)
    // -------------------------------
    const validRoles = [
      "NFadmin",
      "creator",
      "mentor",
      "teacher",
      "newsLetter",
      "hiring",
      "staffCustomerService",
      "websiteSupportTeam",
      "eventStaff",
    ];
    const roleRecipientsNormalized = new Set();
    if (groupRole) {
      if (!validRoles.includes(groupRole)) {
        return res.status(400).json({
          message: `Invalid groupRole: ${groupRole}`,
        });
      }
      // Example: groupRole === "eventStaff" => User.find({ eventStaff: true })
      const query = { [groupRole]: true };
      const roleUsers = await db.User.find(query, {
        accountName: 1,
        accountNameNormalized: 1,
      });
      roleUsers.forEach((u) => {
        // Use stored normalized value if present, otherwise normalize on the fly
        const normalized =
          u.accountNameNormalized || normalizeName(u.accountName);
        if (normalized) {
          roleRecipientsNormalized.add(normalized);
        }
      });
    }
    // -------------------------------
    // 3) Combine all recipients
    // -------------------------------
    const combinedRecipientSet = new Set([
      ...validNormalizedSetFromNames,
      ...roleRecipientsNormalized,
    ]);
    // Always include sender (normalized) if available
    if (senderAccountNameNormalized) {
      combinedRecipientSet.add(senderAccountNameNormalized);
    }
    const recipientsToStore = [...combinedRecipientSet];
    // -------------------------------
    // 4) Create and save post
    // -------------------------------
    const newPost = new db.Post({
      userId: user?._id,
      areaOfPost: "ToAGroup",
      postTitle,
      postBody,
      accountName: user.accountName, // original display name
      isGroupPost: true,
      groupRole: groupRole || undefined, // record role if used
      recipients: recipientsToStore,     // normalized account names
      seen: [
        {
          userId: user?._id,
          seen: true, // sender has already seen their own post
        },
      ],
    });
    const savedPost = await newPost.save();
    await db.User.findByIdAndUpdate(
      user?._id,
      { $push: { post: savedPost._id } },
      { new: true }
    );
    return res.json({
      ...savedPost.toObject(),
      message: "Group post created successfully!",
      addedRecipients,
      invalidRecipients,
      groupRoleApplied: groupRole || null,
      roleRecipientCount: roleRecipientsNormalized.size,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Error creating group post" });
  }
},

  deletePost: async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
      return res.json({ message: "NO POST WITH THAT ID #" });
    }
    try {
      // Delete the post
      const post = await db.Post.findByIdAndDelete(postId);
      if (!post) {
        return res.json({ message: "No post found to delete." });
      }
      // Remove post reference from user's posts array
      await db.User.findByIdAndUpdate(
        post.userId,
        { $pull: { post: post._id } },
        { new: true }
      );
      // Find all replies associated with this post
      const replies = await db.Replies.find({ postId: post._id });
      // Delete all replies for this post
      await db.Replies.deleteMany({ postId: post._id });
      // Remove reply references from users' Reply arrays
      const replyIds = replies.map(reply => reply._id);
      await db.User.updateMany(
        { Reply: { $in: replyIds } },
        { $pull: { Reply: { $in: replyIds } } }
      );
      return res.json({ message: "Post and related replies deleted successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting post." });
    }
  },

  updatePost: async (req, res) => {
    const { postId } = req.params;
    const {
      postTitle,
      postBody,
      areaOfPost,
      addRecipientNames,    // optional: comma-separated string of names to add
      removeRecipientNames, // optional: comma-separated string of names to remove
    } = req.body;
    try {
      // Build basic $set update
      const baseUpdate = {
        ...(postTitle !== undefined && { postTitle }),
        ...(postBody !== undefined && { postBody }),
        ...(areaOfPost !== undefined && { areaOfPost }),
        // accountName is intentionally not updatable
      };
      // Parse and normalize add/remove name lists
      const parseNames = (value) => {
        if (typeof value !== "string" || value.trim() === "") return [];
        return value
          .split(",")
          .map((name) => name.trim())
          .filter((name) => name.length > 0);
      };
      const originalAddNames = parseNames(addRecipientNames);
      const originalRemoveNames = parseNames(removeRecipientNames);
      const normalizedAdd = originalAddNames.map((name) => ({
        original: name,
        normalized: name.toLowerCase().trim().replace(/\s+/g, ""),
      }));
      const normalizedRemove = originalRemoveNames.map((name) => ({
        original: name,
        normalized: name.toLowerCase().trim().replace(/\s+/g, ""),
      }));
      // Build list of all normalized names we need to validate
      const allNormalizedNames = [
        ...new Set([
          ...normalizedAdd.map((n) => n.normalized),
          ...normalizedRemove.map((n) => n.normalized),
        ]),
      ];
      let addedRecipients = [];
      let invalidRecipients = [];
      let removedRecipients = [];
      // If we have any names to validate, check against User collection
      if (allNormalizedNames.length > 0) {
        const matchingUsers = await db.User.find({
          accountNameNormalized: { $in: allNormalizedNames },
        });
        const validNormalizedSet = new Set(
          matchingUsers.map((u) => u.accountNameNormalized)
        );
        // Determine which add names are valid vs invalid
        for (const r of normalizedAdd) {
          if (validNormalizedSet.has(r.normalized)) {
            addedRecipients.push(r.original);
          } else {
            invalidRecipients.push(r.original);
          }
        }
        // Determine which remove names are valid (i.e., correspond to real users)
        for (const r of normalizedRemove) {
          if (validNormalizedSet.has(r.normalized)) {
            removedRecipients.push(r.original);
          } else {
            // If you also want to report “invalid to remove”, you could push to a separate array
            // For now, we'll just ignore invalid remove names.
          }
        }
        // Build array update operations for recipients
        const arrayUpdates = {};
        if (addedRecipients.length > 0) {
          const normalizedToAdd = normalizedAdd
            .filter((r) => validNormalizedSet.has(r.normalized))
            .map((r) => r.normalized);
          if (normalizedToAdd.length > 0) {
            arrayUpdates.$addToSet = {
              recipients: { $each: normalizedToAdd },
            };
            baseUpdate.isGroupPost = true; // if we add recipients, mark as group
          }
        }
        if (removedRecipients.length > 0) {
          const normalizedToRemove = normalizedRemove
            .filter((r) => validNormalizedSet.has(r.normalized))
            .map((r) => r.normalized);
          if (normalizedToRemove.length > 0) {
            arrayUpdates.$pull = {
              recipients: { $in: normalizedToRemove },
            };
          }
        }
        // Combine into update query
        const updateQuery = {};
        if (Object.keys(baseUpdate).length > 0) {
          updateQuery.$set = baseUpdate;
        }
        if (arrayUpdates.$addToSet) {
          updateQuery.$addToSet = arrayUpdates.$addToSet;
        }
        if (arrayUpdates.$pull) {
          updateQuery.$pull = arrayUpdates.$pull;
        }
        if (Object.keys(updateQuery).length === 0) {
          return res.status(400).json({ message: "No valid fields to update." });
        }
        const updatedPost = await db.Post.findByIdAndUpdate(
          postId,
          updateQuery,
          {
            new: true,
            runValidators: true,
          }
        );
        if (!updatedPost) {
          return res
            .status(404)
            .json({ message: "That post is not in the database" });
        }
        return res.json({
          post: updatedPost,
          message: "Post updated successfully!",
          addedRecipients,    // original names that were valid and added
          invalidRecipients,  // original names that did not match any user
          removedRecipients,  // original names that were valid and removed
        });
      } else {
        // Only title/body/area changed; no recipients to validate
        if (Object.keys(baseUpdate).length === 0) {
          return res.status(400).json({ message: "No valid fields to update." });
        }
        const updatedPost = await db.Post.findByIdAndUpdate(
          postId,
          { $set: baseUpdate },
          {
            new: true,
            runValidators: true,
          }
        );
        if (!updatedPost) {
          return res
            .status(404)
            .json({ message: "That post is not in the database" });
        }
        return res.json({
          post: updatedPost,
          message: "Post updated successfully!",
          addedRecipients: [],
          invalidRecipients: [],
          removedRecipients: [],
        });
      }
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error updating post." });
    }
  },

  markPostSeen: async (req, res) => {
    const { postId } = req.params;
    const { userId, seen } = req.body; // seen is optional, defaults to true
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    try {
      // Option 1: if you want one entry per user, update existing or add if missing
      const updatedPost = await db.Post.findOneAndUpdate(
        { _id: postId, "seen.userId": userId },
        { $set: { "seen.$.seen": seen !== undefined ? seen : true } },
        { new: true }
      );
      if (updatedPost) {
        return res.json({
          post: updatedPost,
          message: "Post seen status updated for this user",
        });
      }
      // If no existing seen entry for this user, push a new one
      const postWithNewSeen = await db.Post.findByIdAndUpdate(
        postId,
        {
          $push: {
            seen: {
              userId,
              seen: seen !== undefined ? seen : true,
            },
          },
        },
        { new: true, runValidators: true }
      );
      if (!postWithNewSeen) {
        return res.status(404).json({ message: "Post not found" });
      }
      return res.json({
        post: postWithNewSeen,
        message: "Seen entry added for this user",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error updating seen status" });
    }
  },


  // DELETE /posts/:postId/seen
  resetPostSeen: async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    try {
      const updatedPost = await db.Post.findByIdAndUpdate(
        postId,
        {
          $pull: {
            seen: { userId: userId },
          },
        },
        { new: true }
      );
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      return res.json({
        post: updatedPost,
        message: "Seen status reset for this user",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error resetting seen status" });
    }
  },

  getUserPosts: (req, res) => {
    let { _id } = req.params
    db
      .Post
      .populate("reply")
      .findOne({ _id })
      .then(data => res.json(data))
      .catch(err => console.log(err))

  },

  getAllPost: (req, res) => {
    db.Post
      .find({})
      .populate("reply")  // populate the `reply` field that holds ObjectIds
      .then(data => res.json(data))
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Error fetching posts" });
      });
  }

}

export default postControllers
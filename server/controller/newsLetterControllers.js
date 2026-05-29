import db from "../db/index.js";
import { deleteGridFsFileById } from "../gridfsHelper.js";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const newsLetterController = {

  // ✅ 
  addNewsLetter: async (req, res) => {
    const {
      userId,
      postTitle,
      postBody,
      periodStart,
      periodEnd,
      status,
      StoriesThisNews,
      isFeatured,
      additionalImages
    } = req.body;
  
    const news = await db.News.create({
      userId,
      postTitle,
      postBody,
      periodStart,
      periodEnd,
      status,
      StoriesThisNews,
      isFeatured,
      additionalImages
    });
  
    return res.status(201).json({
      news,
      message: "Newsletter created successfully!"
    });
  },  

  // ✅ 
  updateNewsLetter: async (req, res) => {
    const { id } = req.params;
  
    const {
      postTitle,
      postBody,
      periodStart,
      periodEnd,
      StoriesThisNews,
      status,
      isFeatured
    } = req.body;
  
    const allowedStatuses = ["draft", "reviewed", "published", "rejected"];
  
    try {
  
      // enforce status rule
      if (status !== undefined && !allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status value."
        });
      }
  
      const updateFields = {
        ...(postTitle !== undefined && { postTitle }),
        ...(postBody !== undefined && { postBody }),
        ...(periodStart !== undefined && { periodStart }),
        ...(periodEnd !== undefined && { periodEnd }),
        ...(StoriesThisNews !== undefined && { StoriesThisNews }),
        ...(status !== undefined && { status }),
        ...(isFeatured !== undefined && { isFeatured }),
      };
  
      const updatedNews = await db.News.findByIdAndUpdate(
        id,
        { $set: updateFields },
        {
          returnDocument: "after",
          runValidators: true
        }
      );
  
      if (!updatedNews) {
        return res.status(404).json({ message: "Newsletter not found." });
      }
  
      return res.status(200).json({
        ...updatedNews.toObject(),
        message: "Newsletter updated successfully!"
      });
  
    } catch (err) {
      console.error(err);
  
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
  
      return res.status(500).json({
        message: "Error updating newsletter."
      });
    }
  },

  addAdditionalNewsImages: async (req, res) => {
    const { id } = req.params;
    const { additionalImages } = req.body;
  
    if (additionalImages === undefined) {
      return res.status(400).json({ message: "additionalImages is required." });
    }
  
    try {
      const newsLetter = await db.News.findById(id);
      if (!newsLetter) {
        return res.status(404).json({ message: "newsLetter not found." });
      }
  
      // Normalize input to array of images
      let newImages = [];
      if (typeof additionalImages === "string") {
        // Accept a comma string of URLs
        newImages = additionalImages
          .split(",")
          .map((link) => ({
            link: link.trim(),
            imageFileId: null,
            imageBucketName: null,
            description: ""
          }))
          .filter((img) => img.link);
      } else if (Array.isArray(additionalImages)) {
        newImages = additionalImages
          .map((img) => {
            if (img && typeof img === "object") {
              return {
                link: (img.link || "").trim(),
                description: (img.description || "").trim(),
                imageFileId: img.imageFileId || null,
                imageBucketName: img.imageBucketName || null,
              };
            }
            // String: treat as link
            if (typeof img === "string") {
              return {
                link: img.trim(),
                description: "",
                imageFileId: null,
                imageBucketName: null
              };
            }
            return null;
          })
          // FIX: accept if there's a link OR imageFileId
          .filter((img) => img && (img.link || img.imageFileId));
      } else {
        return res.status(400).json({
          message: "additionalImages must be a string or an array.",
        });
      }
  
      // Remove duplicates in newImages by unique key (imageFileId or link)
      const seenNew = new Set();
      newImages = newImages.filter((img) => {
        const key = img.imageFileId ? String(img.imageFileId) : img.link;
        if (seenNew.has(key)) return false;
        seenNew.add(key);
        return true;
      });
  
      // Get all existing images (support both link and imageFileId)
      const existingImages = Array.isArray(newsLetter.additionalImages)
        ? newsLetter.additionalImages.map((img) => ({
            link: (img.link || "").trim(),
            description: (img.description || "").trim(),
            imageFileId: img.imageFileId || null,
            imageBucketName: img.imageBucketName || null
          }))
        : [];
  
      // Merge logic: map by key (prefer imageFileId if present, else link)
      const imageMap = new Map();
      for (const img of existingImages) {
        const key = img.imageFileId ? String(img.imageFileId) : img.link;
        if (!key) continue;
        imageMap.set(key, img);
      }
      // Merge new images—new info overwrites old
      for (const img of newImages) {
        const key = img.imageFileId ? String(img.imageFileId) : img.link;
        if (!key) continue;
        const existing = imageMap.get(key);
        imageMap.set(key, {
          ...existing,
          ...img, // new details (description, bucket) overwrite previous
        });
      }
  
      // Update
      newsLetter.additionalImages = Array.from(imageMap.values());
      const updatedNewsLetter = await newsLetter.save();
  
      return res.json({
        ...updatedNewsLetter.toObject(),
        message: "Additional images added successfully!"
      });
  
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error adding additional images." });
    }
  },

  deleteAdditionalNewsImage: async (req, res) => {

    const { id } = req.params
    const { link, imageFileId } = req.body
  
    if (!link && !imageFileId) {
      return res.status(400).json({
        message: "link or imageFileId is required."
      })
    }
  
    try {
  
      const newsLetter = await db.News.findById(id)
  
      if (!newsLetter) {
        return res.status(404).json({
          message: "newsLetter not found."
        })
      }
  
      const existingImages = Array.isArray(newsLetter.additionalImages)
        ? newsLetter.additionalImages
        : []
  
      const imageToDelete = existingImages.find((img) =>
        (link && img.link === link) ||
        (
          imageFileId &&
          img.imageFileId &&
          String(img.imageFileId) === String(imageFileId)
        )
      )
  
      if (imageToDelete?.imageFileId) {
  
        try {
  
          await deleteGridFsFileById(
            "images",
            imageToDelete.imageFileId
          )
  
        } catch (err) {
  
          console.log("GridFS delete skipped:", err.message)
        }
      }
  
      const updatedImages = existingImages.filter((img) => {
  
        if (link && img.link === link) return false
  
        if (
          imageFileId &&
          img.imageFileId &&
          String(img.imageFileId) === String(imageFileId)
        ) return false
  
        return true
      })
  
      newsLetter.additionalImages = updatedImages
  
      const updatedNewsLetter = await newsLetter.save()
  
      return res.json({
        ...updatedNewsLetter.toObject(),
        message: "Additional image deleted successfully!"
      })
  
    } catch (err) {
  
      console.error(err)
  
      return res.status(500).json({
        message: "Error deleting additional image."
      })
    }
  },

  // ✅ 
  deleteNewsLetter: async (req, res) => {
    const { id } = req.params; // newsletter id from route /news/:id
    try {
      // Find the newsletter first so we know which user to unlink from
      const newsDoc = await db.News.findById(id);
      if (!newsDoc) {
        return res.status(404).json({ message: 'Newsletter not found.' });
      }
      const userId = newsDoc.userId;
      // Delete the newsletter
      await db.News.deleteOne({ _id: id });
      const updates = [];
      // Remove reference from User.news
      if (userId) {
        updates.push(
          db.User.updateOne(
            { _id: userId },
            { $pull: { news: id } } // or newsDoc._id
          )
        );
      }
      if (updates.length > 0) {
        await Promise.all(updates);
      }
      return res.status(200).json({
        message: 'Newsletter deleted successfully.',
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error deleting newsletter.' });
    }
  },

  // ✅ 
  addReview: async (req, res) => {
    const { id } = req.params;
    const { userId, reviewStatus, reviewSuggestion } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }
    const allowedStatuses = ["approved", "denied", "needs editing"];
    if (reviewStatus && !allowedStatuses.includes(reviewStatus)) {
      return res.status(400).json({ message: "Invalid reviewStatus." });
    }
    // Build the $set for status based on reviewStatus
    const statusUpdate = {};
    if (reviewStatus === "approved") {
      statusUpdate.status = "reviewed";
    } else if (reviewStatus === "denied") {
      statusUpdate.status = "rejected";
    }
    // if "needs editing" or not provided, don't touch status
    try {
      // 1) Atomically: only update if this user has NOT reviewed yet
      const updatedNews = await db.News.findOneAndUpdate(
        {
          _id: id,
          // ensure this user is not already in reviewedBy
          "reviewedBy.userId": { $ne: userId },
        },
        {
          $push: {
            reviewedBy: {
              userId,
              reviewStatus: reviewStatus || "needs editing",
              reviewSuggestion,
              reviewedAt: new Date(),
            },
          },
          ...(Object.keys(statusUpdate).length > 0 && { $set: statusUpdate }),
        },
        {
          new: true,
          runValidators: true,
        }
      );
      // If no document was updated, either:
      // - the newsletter does not exist, OR
      // - this user already reviewed it
      if (!updatedNews) {
        // Check which case it is
        const exists = await db.News.exists({ _id: id });
        if (!exists) {
          return res.status(404).json({ message: "Newsletter not found." });
        }
        return res
          .status(400)
          .json({ message: "This user has already submitted a review." });
      }
      return res.status(200).json({
        ...updatedNews.toObject(),
        message: "Review added successfully.",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error adding review." }); 
    }
  },

  // ✅   
  updateReview: async (req, res) => {
    const { id, reviewId } = req.params; // newsletter id and review subdoc id
    const { reviewStatus, reviewSuggestion } = req.body;
    const allowedStatuses = ["approved", "denied", "needs editing"];
    if (reviewStatus && !allowedStatuses.includes(reviewStatus)) {
      return res.status(400).json({ message: "Invalid reviewStatus." });
    }
    // Build the fields to set on the subdocument
    const subdocUpdate = {};
    if (reviewStatus !== undefined) subdocUpdate["reviewedBy.$.reviewStatus"] = reviewStatus;
    if (reviewSuggestion !== undefined) subdocUpdate["reviewedBy.$.reviewSuggestion"] = reviewSuggestion;
    // Optionally refresh reviewedAt when updating
    subdocUpdate["reviewedBy.$.reviewedAt"] = new Date();
    // Build status update based on reviewStatus
    if (reviewStatus === "approved") {
      subdocUpdate.status = "reviewed";
    } else if (reviewStatus === "denied") {
      subdocUpdate.status = "rejected";
    }
    // if "needs editing" or not provided, don't touch status
    if (Object.keys(subdocUpdate).length === 0) {
      return res.status(400).json({ message: "No fields to update." });
    }
    try {
      const updatedNews = await db.News.findOneAndUpdate(
        {
          _id: id,
          "reviewedBy._id": reviewId, // match the specific review subdocument
        },
        {
          $set: subdocUpdate,
        },
        {
          returnDocument: "after", // same as new: true
          runValidators: true,
        }
      );
      if (!updatedNews) {
        return res.status(404).json({ message: "Newsletter or review not found." });
      }
      return res.status(200).json({
        ...updatedNews.toObject(),
        message: "Review updated successfully.",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error updating review." });
    }
  },

  // ✅
  deleteReview: async (req, res) => {
    const { id, reviewId } = req.params; // newsletter id, review subdoc id
    if (!id || !reviewId) {
      return res.status(400).json({ message: "id and reviewId are required." });
    }
    try {
      // First pull the review from the array
      const updatedNews = await db.News.findByIdAndUpdate(
        id,
        { $pull: { reviewedBy: { _id: reviewId } } },
        {
          returnDocument: "after", // same as new: true
          runValidators: true,
        }
      );
      if (!updatedNews) {
        return res.status(404).json({ message: "Newsletter not found." });
      }
      // Check if the review was actually removed
      // (if reviewId didn't exist, the doc will be unchanged)
      const stillHasReview = updatedNews.reviewedBy.some(
        (r) => String(r._id) === String(reviewId)
      );
      if (stillHasReview) {
        return res
          .status(404)
          .json({ message: "Review not found on this newsletter." });
      }
      // Recalculate status based on remaining reviews
      const hasDenied = updatedNews.reviewedBy.some(
        (r) => r.reviewStatus === "denied"
      );
      const hasApproved = updatedNews.reviewedBy.some(
        (r) => r.reviewStatus === "approved"
      );
      let newStatus = updatedNews.status;
      if (hasDenied) {
        newStatus = "rejected";
      } else if (hasApproved) {
        newStatus = "reviewed";
      } else {
        // no denied and no approved; you can choose behavior here
        newStatus = "draft";
      }
      // Only save if status actually changes
      if (newStatus !== updatedNews.status) {
        updatedNews.status = newStatus;
        await updatedNews.save();
      }
      return res.status(200).json({
        ...updatedNews.toObject(),
        message: "Review deleted and status updated successfully.",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error deleting review." });
    }
  },

  // ✅
  updateNewsLetterStatus: async (req, res) => {
    const { id } = req.params;        // newsletter id: /news/:id/status
    const { status } = req.body;      // "draft" | "reviewed" | "published" | "rejected"
    if (!status) {
      return res.status(400).json({ message: "status is required." });
    }
    try {
      const updatedNews = await db.News.findByIdAndUpdate(
        id,
        { status },
        {
          returnDocument: "after",   // same as new: true
          runValidators: true,       // enforces enum from schema
        }
      );
      if (!updatedNews) {
        return res.status(404).json({ message: "Newsletter not found." });
      }
      return res.status(200).json({
        ...updatedNews.toObject(),
        message: "Newsletter status updated successfully.",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        // e.g. invalid status not in ["draft","reviewed","published","rejected"]
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Error updating newsletter status." });
    }
  },

  getSingleNewsLetter: async (req, res) => {
    try {
      const { id } = req.params;
      const newsletter = await db.News.findById(id).exec();
      if (!newsletter) {
        return res.status(404).json({
          message: 'Newsletter not found.',
        });
      }
      return res.status(200).json({
        newsletter,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Error fetching newsletter.',
      });
    }
  },

  // ✅
  getAllNewsLetters: async (req, res) => {
    try {
      const newsList = await db.News.find({})
        // optionally sort newest first
        .sort({ createdAt: -1 })
        .exec();
      return res.status(200).json({
        count: newsList.length,
        newsletters: newsList,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Error fetching newsletters.',
      });
    }
  },

  // SUBSCRIBE TO NEWS LETTER CONTROLLERS ----------------------------------

  subscribeNewsLetter: async (req, res) => {
    try {
      let {
        email,
        newsLetterRequested,
        inmateNumbers,   // <-- array from the form
        firstName,
        lastName,
        phoneNumber,
        address,
        status,          // you can ignore this from the body if you always force 'subscribed'
      } = req.body;
      // Normalize & validate email
      email = email?.toLowerCase().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
          message: "Please provide a valid email address (example@example.com).",
        });
      }
      // Check if email already subscribed
      const existing = await db.Subscribe.findOne({ email });
      if (existing) {
        return res.status(409).json({
          message: "This email is already subscribed to the newsletter.",
        });
      }
      // Normalize & validate phone number (if provided)
      if (phoneNumber) {
        let normalizedPhone = phoneNumber.toString().trim();
        normalizedPhone = normalizedPhone.replace(/\s+/g, "");
        const usPhoneRegex =
          /^(?:\+?1[\s-]?)?(?:\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;
        if (!usPhoneRegex.test(normalizedPhone)) {
          return res.status(400).json({
            message: "Please provide a valid US phone number.",
          });
        }
        phoneNumber = normalizedPhone;
      }
      // Normalize inmateNumbers array coming from the form
      let normalizedInmateNumbers = [];
      if (Array.isArray(inmateNumbers)) {
        normalizedInmateNumbers = inmateNumbers
          .filter((i) => i && (i.number || i.state))
          .map((i) => ({
            number:
              typeof i.number === "string"
                ? i.number.trim().replace(/\s+/g, "")
                : i.number,
            state: i.state?.toString().trim(),
          }));
      }
      // Normalize address to array (you send address: [{...}] from the form)
      let addressArray = [];
      if (address) {
        if (Array.isArray(address)) {
          addressArray = address;
        } else if (typeof address === "object") {
          addressArray = [address];
        }
      }
      const newSubscription = new db.Subscribe({
        email,
        newsLetterRequested,
        inmateNumbers: normalizedInmateNumbers, // matches schema + form
        firstName,
        lastName,
        phoneNumber,
        address: addressArray,
        status: "subscribed", // enforce default, ignore status from body
      });
      const savedSubscription = await newSubscription.save();
      return res.status(201).json({
        ...savedSubscription.toObject(),
        message: "Newsletter subscription created successfully!",
      });
    } catch (err) {
      // section 2 (your existing error handling) stays the same
    }
  },

  // ✅
  updateSubscription: async (req, res) => {
    const { id } = req.params;
    // Safeguard: prevent clients from setting expiredDate directly
    if ("expiredDate" in req.body) {
      delete req.body.expiredDate;
    }
    let {
      email,
      newsLetterRequested,
      inmateNumbers,   // <-- array from client, matches schema + form
      firstName,
      lastName,
      phoneNumber,
      address,
      status,          // used here for unsubscribed / subscribed logic
    } = req.body;
    try {
      const update = {};
      const unset = {};
      // Normalize & validate email (if provided)
      if (email !== undefined) {
        email = email?.toLowerCase().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
          return res.status(400).json({
            message: "Please provide a valid email address (example@example.com).",
          });
        }
        // Ensure email remains unique across other subscriptions
        const existing = await db.Subscribe.findOne({
          email,
          _id: { $ne: id },
        });
        if (existing) {
          return res.status(409).json({
            message: "This email is already subscribed to the newsletter.",
          });
        }
        update.email = email;
      }
      // Normalize & validate phone number (if provided)
      if (phoneNumber !== undefined) {
        if (phoneNumber) {
          let normalizedPhone = phoneNumber.toString().trim();
          normalizedPhone = normalizedPhone.replace(/\s+/g, "");
          const usPhoneRegex =
            /^(?:\+?1[\s-]?)?(?:\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;
          if (!usPhoneRegex.test(normalizedPhone)) {
            return res.status(400).json({
              message: "Please provide a valid US phone number.",
            });
          }
          update.phoneNumber = normalizedPhone;
        } else {
          // allow clearing phone number
          update.phoneNumber = "";
        }
      }
      // inmateNumbers: normalize array from client
      if (inmateNumbers !== undefined) {
        let normalizedInmateNumbers = [];
        if (Array.isArray(inmateNumbers)) {
          normalizedInmateNumbers = inmateNumbers
            .filter((i) => i && (i.number || i.state))
            .map((i) => ({
              number:
                typeof i.number === "string"
                  ? i.number.trim().replace(/\s+/g, "")
                  : i.number,
              state: i.state?.toString().trim(),
            }));
        }
        // Can be [] to clear inmateNumbers
        update.inmateNumbers = normalizedInmateNumbers;
      }
      // Other simple fields
      if (newsLetterRequested !== undefined) {
        update.newsLetterRequested = newsLetterRequested;
      }
      if (firstName !== undefined) {
        update.firstName = firstName;
      }
      if (lastName !== undefined) {
        update.lastName = lastName;
      }
      // Address: schema expects an array
      if (address !== undefined) {
        if (address && typeof address === "object" && !Array.isArray(address)) {
          update.address = [address];
        } else if (Array.isArray(address)) {
          update.address = address;
        } else if (!address) {
          // allow clearing address
          update.address = [];
        }
      }
      // Status + TTL behavior
      if (status !== undefined) {
        update.status = status;
        if (status === "unsubscribed") {
          // set expiration in 30 days
          update.expiredDate = new Date(Date.now() + THIRTY_DAYS_MS);
          update.unsubscribedAt = new Date();
        } else if (status === "subscribed") {
          // prevent automatic deletion: remove expiredDate and unsubscribedAt
          unset.expiredDate = "";
          unset.unsubscribedAt = "";
        }
        // For "subscriptionPaused" we leave existing expiredDate/unsubscribedAt as-is
      }
      // If nothing to update
      if (Object.keys(update).length === 0 && Object.keys(unset).length === 0) {
        return res.status(400).json({
          message: "No valid fields provided to update subscription.",
        });
      }
      const updateDoc =
        Object.keys(unset).length > 0
          ? { $set: update, $unset: unset }
          : { $set: update };
      const updatedSubscription = await db.Subscribe.findByIdAndUpdate(
        id,
        updateDoc,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedSubscription) {
        return res.status(404).json({ message: "Subscription not found." });
      }
      return res.status(200).json({
        ...updatedSubscription.toObject(),
        message: "Subscription updated successfully!",
      });
    } catch (err) {
      console.error(err);
      // Duplicate key on compound index inmateNumbers.number + inmateNumbers.state
      if (
        err.code === 11000 &&
        err.keyPattern &&
        (err.keyPattern["inmateNumbers.number"] ||
          err.keyPattern["inmateNumbers.state"])
      ) {
        return res.status(409).json({
          message:
            "A subscription already exists for this inmate number and state.",
        });
      }
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error updating subscription." });
    }
  },

  // ✅
  deleteSubscription: async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await db.Subscribe.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: "Subscription not found." });
      }
      return res.status(200).json({
        ...deleted.toObject(),
        message: "Subscription deleted successfully!",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error deleting subscription." });
    }
  },

  // ✅
  updateNewsletterStatus: async (req, res) => {
    const { id } = req.params;
    try {
      const subscription = await db.Subscribe.findById(id);
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found." });
      }
      // Guard by status
      if (subscription.status === "subscriptionPaused") {
        return res.status(400).json({
          message: "Subscription is paused. Newsletter timestamp not updated.",
        });
      }
      if (subscription.status === "unsubscribed") {
        return res.status(400).json({
          message: "User is unsubscribed. Newsletter timestamp not updated.",
        });
      }
      // Only 'subscribed' reaches this point
      const now = new Date();
      // Newsletter has just been sent for this subscription:
      // record the time it was sent. This is the only source of truth.
      subscription.lastNewsLetterSentAt = now;
      const saved = await subscription.save();
      return res.status(200).json({
        ...saved.toObject(),
        message: "Newsletter timestamp updated successfully.",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error updating newsletter status.",
      });
    }
  },

  // ✅
  getAllSubscriptions: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 20;
      const skip = (page - 1) * limit;
      const [subscriptions, total] = await Promise.all([
        db.Subscribe.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        db.Subscribe.countDocuments(),
      ]);
      return res.status(200).json({
        data: subscriptions,
        total,
        page,
        pages: Math.ceil(total / limit),
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Error fetching newsletter subscriptions." });
    }
  },

  // ✅
  searchSubscribers: async (req, res) => {
    try {
      const {
        email,
        number,
        state,
        firstName,
        lastName,
        phoneNumber,
        facilityName,   // <-- NEW
      } = req.query;
      // Collect which params are present
      const provided = Object.entries({
        email,
        number,
        state,
        firstName,
        lastName,
        phoneNumber,
        facilityName,   // <-- include here
      }).filter(([, value]) => value !== undefined && value !== '');
      // Enforce exactly one search parameter
      if (provided.length === 0) {
        return res.status(400).json({
          success: false,
          message:
            'Provide exactly one search parameter: email, number, state, firstName, lastName, phoneNumber, or facilityName.',
        });
      }
      if (provided.length > 1) {
        return res.status(400).json({
          success: false,
          message: 'Only one search parameter is allowed per request.',
        });
      }
      const [field, value] = provided[0];
      let filter = {};
      switch (field) {
        case 'email':
          filter.email = new RegExp(value.trim(), 'i'); // partial, case-insensitive
          break;
        case 'number': {
          const normalizedNumber = value.replace(/\s+/g, '');
          filter['inmateNumbers.number'] = new RegExp(normalizedNumber, 'i');
          break;
        }
        case 'state':
          filter['inmateNumbers.state'] = new RegExp(value.trim(), 'i');
          break;
        case 'firstName':
          filter.firstName = new RegExp(value.trim(), 'i');
          break;
        case 'lastName':
          filter.lastName = new RegExp(value.trim(), 'i');
          break;
        case 'phoneNumber': {
          const normalizedPhone = value.trim().replace(/\s+/g, '');
          filter.phoneNumber = new RegExp(normalizedPhone, 'i');
          break;
        }
        case 'facilityName':
          // address is an array of objects; dot notation matches any element
          filter['address.facilityName'] = new RegExp(value.trim(), 'i');
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid search parameter.',
          });
      }
      const subscribers = await db.Subscribe.find(filter).exec();
      return res.status(200).json({
        success: true,
        field,               // which field was used
        query: value,        // original query value
        count: subscribers.length,
        data: subscribers,
      });
    } catch (err) {
      console.error('Error searching subscribers:', err);
      return res.status(500).json({
        success: false,
        message: 'Server error while searching subscribers.',
      });
    }
  },

}

export default newsLetterController
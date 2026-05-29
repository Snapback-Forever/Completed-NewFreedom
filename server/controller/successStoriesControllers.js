import db from "../db/index.js";
import { deleteGridFsFileById } from "../gridfsHelper.js";

const successController = {
  
// ADD STORY

addStory: async (req, res) => {
  const {
    userId,
    mailingUser,
    title,
    storyText,
    storyVideo,
    programName,
    graduationDate,
    outcomeSummary,
    consentToPublish,
    displayName,
    imageUrl,
    imageFileId,
    imageBucketName,
    additionalImages,
    internalNotes,
    inmateNumber,
    firstName,
    lastName,
    location,
    email
  } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && !emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address." });
  }

  const checkEmail = await db.Success.findOne({ email });

  if (checkEmail) {
    return res
      .status(400)
      .json({ message: "This Email Already Has A Success Story." });
  }

  if (
    inmateNumber &&
    typeof inmateNumber.number === "string" &&
    inmateNumber.number.trim() !== "" &&
    (!inmateNumber.state || String(inmateNumber.state).trim() === "")
  ) {
    return res
      .status(400)
      .json({
        message:
          "Inmate state is required when inmate number is provided."
      });
  }

  let computedDisplayName = displayName;

  if (
    (!displayName || typeof displayName !== "string") &&
    typeof firstName === "string" &&
    typeof lastName === "string"
  ) {
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();

    if (trimmedFirst && trimmedLast) {
      computedDisplayName = `${trimmedFirst[0]}. ${trimmedLast}`;
    }
  }

  let mailingUserId = mailingUser || null;

  try {
    if (
      inmateNumber &&
      typeof inmateNumber.number === "string" &&
      typeof inmateNumber.state === "string"
    ) {
      const normalizedNumber = inmateNumber.number.replace(/\s+/g, "");
      const normalizedState = inmateNumber.state.trim();

      const mailListDoc = await db.Mail.findOne({
        inmateNumbers: {
          $elemMatch: {
            number: normalizedNumber,
            state: normalizedState
          }
        }
      });

      if (mailListDoc) {
        mailingUserId = mailListDoc._id;
      }
    }

    let images = [];

    if (Array.isArray(additionalImages)) {
      images = additionalImages.map(img => ({
        link: img.link || "",
        description: img.description || "",
        imageFileId: img.imageFileId || null,
        imageBucketName: img.imageBucketName || null
      }));
    }

    const newStory = new db.Success({
      userId,
      mailingUser: mailingUserId,
      title,
      storyText,
      storyVideo,
      programName,
      graduationDate,
      outcomeSummary,
      consentToPublish,
      displayName: computedDisplayName,
      additionalImages: images,
      location:
        location && typeof location === "object"
          ? {
              city: location.city || "",
              state: location.state || ""
            }
          : undefined,
      imageUrl,
      imageFileId,
      imageBucketName,
      internalNotes,
      inmateNumber,
      firstName,
      lastName,
      email
    });

    const savedStory = await newStory.save();

    if (mailingUserId) {
      await db.Mail.findByIdAndUpdate(
        mailingUserId,
        { $push: { successStory: savedStory._id } },
        { new: true }
      );
    }

    if (userId) {
      await db.User.findByIdAndUpdate(
        userId,
        { $push: { successStoryAuthor: savedStory._id } },
        { new: true }
      );
    }

    return res.json({
      ...savedStory.toObject(),
      message: "Success story created successfully!"
    });

  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    return res
      .status(500)
      .json({ message: "Error creating success story" });
  }
},

// UPDATE STORY
updateStory: async (req, res) => {
  const { id } = req.params;

  let {
    title,
    storyText,
    storyVideo,
    programName,
    graduationDate,
    outcomeSummary,
    consentToPublish,
    displayName,
    location,
    imageUrl,
    internalNotes,
    inmateNumber,
    firstName,
    lastName,
    mailingUser,
    email,
    imageFileId,
    imageBucketName
  } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && !emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address." });
  }

  if (
    inmateNumber &&
    typeof inmateNumber.number === "string" &&
    inmateNumber.number.trim() !== "" &&
    (!inmateNumber.state || String(inmateNumber.state).trim() === "")
  ) {
    return res.status(400).json({
      message: "Inmate state is required when inmate number is provided."
    });
  }

  if (typeof firstName === "string" && typeof lastName === "string") {
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();

    if (trimmedFirst && trimmedLast) {
      displayName = `${trimmedFirst[0]}. ${trimmedLast}`;
    }
  }

  let locationUpdate;
  if (location && typeof location === "object") {
    locationUpdate = {
      city: location.city ?? "",
      state: location.state ?? ""
    };
  }

  const updateFields = {
    title,
    storyText,
    storyVideo,
    programName,
    graduationDate,
    outcomeSummary,
    consentToPublish,
    displayName,
    location: locationUpdate,
    imageUrl,
    imageFileId,
    imageBucketName,
    internalNotes,
    inmateNumber,
    firstName,
    lastName,
    mailingUser,
    email
  };

  // remove undefined fields so existing values aren't overwritten
  Object.keys(updateFields).forEach((key) => {
    if (typeof updateFields[key] === "undefined") {
      delete updateFields[key];
    }
  });

  try {
    const updatedStory = await db.Success.findByIdAndUpdate(
      id,
      { $set: updateFields },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedStory) {
      return res
        .status(404)
        .json({ message: `Success story with id ${id} not found.` });
    }

    if (mailingUser) {
      await db.Mail.findByIdAndUpdate(
        mailingUser,
        { $addToSet: { successStory: updatedStory._id } },
        { new: true }
      );
    }

    return res.json({
      ...updatedStory.toObject(),
      message: "Success story updated successfully!"
    });

  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({
      message: "Error updating success story"
    });
  }
},

addAdditionalSuccessImages: async (req, res) => {
  const { id } = req.params;
  const { additionalImages } = req.body;

  if (additionalImages === undefined) {
    return res.status(400).json({ message: "additionalImages is required." });
  }

  try {
    const success = await db.Success.findById(id);
    if (!success) {
      return res.status(404).json({ message: "Success story not found." });
    }

    // Normalize input to array of images
    let newImages = [];

    if (typeof additionalImages === "string") {
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
              imageBucketName: img.imageBucketName || null
            };
          }

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
        .filter((img) => img && (img.link || img.imageFileId));

    } else {
      return res.status(400).json({
        message: "additionalImages must be a string or an array."
      });
    }

    // Remove duplicates inside newImages
    const seenNew = new Set();
    newImages = newImages.filter((img) => {
      const key = img.imageFileId ? String(img.imageFileId) : img.link;
      if (seenNew.has(key)) return false;
      seenNew.add(key);
      return true;
    });

    // Get existing images
    const existingImages = Array.isArray(success.additionalImages)
      ? success.additionalImages.map((img) => ({
          link: (img.link || "").trim(),
          description: (img.description || "").trim(),
          imageFileId: img.imageFileId || null,
          imageBucketName: img.imageBucketName || null
        }))
      : [];

    // Build map
    const imageMap = new Map();

    for (const img of existingImages) {
      const key = img.imageFileId ? String(img.imageFileId) : img.link;
      if (!key) continue;
      imageMap.set(key, img);
    }

    // Merge new images
    for (const img of newImages) {
      const key = img.imageFileId ? String(img.imageFileId) : img.link;
      if (!key) continue;

      const existing = imageMap.get(key);

      imageMap.set(key, {
        ...existing,
        ...img
      });
    }

    // Update array
    success.additionalImages = Array.from(imageMap.values());

    const updatedSuccess = await success.save();

    return res.json({
      ...updatedSuccess.toObject(),
      message: "Additional images added successfully!"
    });

  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({
      message: "Error adding additional images."
    });
  }
},


deleteAdditionalImage: async (req, res) => {

  const { id } = req.params
  const { link, imageFileId } = req.body

  if (!link && !imageFileId) {
    return res.status(400).json({
      message: "link or imageFileId is required."
    })
  }

  try {

    const successStory = await db.Success.findById(id)

    if (!successStory) {
      return res.status(404).json({
        message: "Success story not found."
      })
    }

    const existingImages = Array.isArray(successStory.additionalImages)
      ? successStory.additionalImages
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

    successStory.additionalImages = updatedImages

    const updatedSuccessStory = await successStory.save()

    return res.json({
      ...updatedSuccessStory.toObject(),
      message: "Additional image deleted successfully!"
    })

  } catch (err) {

    console.error(err)

    return res.status(500).json({
      message: "Error deleting additional image."
    })
  }
},

toggleConsent: async (req, res) => {
  const { id } = req.params;
  try {
    const story = await db.Success.findById(id);
    if (!story) {
      return res
        .status(404)
        .json({ message: `Success story with id ${id} not found.` });
    }
    // Flip the boolean
    story.consentToPublish = !story.consentToPublish;
    const saved = await story.save();
    return res.json({
      ...saved.toObject(),
      message: `consentToPublish set to ${saved.consentToPublish}`,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    return res
      .status(500)
      .json({ message: "Error toggling consentToPublish" });
  }
},

  // DELETE
  deleteStory: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedStory = await db.Success.findByIdAndDelete(id);
      if (!deletedStory) {
        return res
          .status(404)
          .json({ message: `Success story with id ${id} not found.` });
      }
      // Remove reference from Mail documents
      await db.Mail.updateMany(
        { successStory: id },
        { $unset: { successStory: "" } }
      );
      // Remove success story id from all users' successStoryAuthor array
      await db.User.updateMany(
        { successStoryAuthor: id },          // match users that contain this id
        { $pull: { successStoryAuthor: id } } // remove this id from the array
      );
      return res.json({
        message: "Success story deleted successfully!",
        story: deletedStory,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error deleting success story" });
    }
  },

  getStoryById: async (req, res) => {
    const { storyId } = req.params;
    try {
      const story = await db.Success.findById(storyId);
      if (!story) {
        return res
          .status(404)
          .json({ message: `Success story with id ${storyId} not found.` });
      }
      return res.status(200).json(story);
    } catch (err) {
      console.error(err);
      // Handle invalid ObjectId (CastError) and other errors
      if (err.name === "CastError" && err.kind === "ObjectId") {
        return res
          .status(400)
          .json({ message: `Invalid story id: ${storyId}` });
      }
      return res
        .status(500)
        .json({ message: "Error fetching success story" });
    }
  },

  getAllStories: async (req, res) => {
    try {
      const page  = parseInt(req.query.page, 10)  || 1;
      const limit = parseInt(req.query.limit, 10) || 20;
      const skip  = (page - 1) * limit;
      const [stories, total] = await Promise.all([
        db.Success
          .find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        db.Success.countDocuments(),
      ]);
      return res.status(200).json({
        data: stories,
        total,
        page,
        pages: Math.ceil(total / limit),
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Error fetching success stories" });
    }
  },
  
  
};
export default successController;
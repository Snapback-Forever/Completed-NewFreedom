import db from "../db/index.js";
import { deleteGridFsFileById } from '../gridfsHelper.js';

const drawingControllers = {

  addDrawing: async (req, res) => {
    const { uploadedBy } = req.params;
    try {
      const body = req.body || {};
      let {
        imageLink,
        imageFileId,
        imageBucketName,
        notes,
        inmateNumber,
        state,
        mailingList
      } = body;
      imageLink = imageLink?.trim() || undefined;
      notes = notes?.trim() || undefined;
      inmateNumber = inmateNumber?.trim() || undefined;
      state = state?.trim() || undefined;
      mailingList = mailingList || undefined;
      imageFileId = imageFileId || undefined;
      imageBucketName = imageBucketName || undefined;
      let resolvedMailingList = mailingList;
      let inmateNumbers;
      // If inmate info exists, store it
      if (inmateNumber && state) {
        const normalizedNumber = inmateNumber.replace(/\s+/g, "");
        const normalizedState = state;
        inmateNumbers = [
          {
            number: normalizedNumber,
            state: normalizedState
          }
        ];
        // Attempt to link to Mail user
        const mailDoc = await db.Mail.findOne({
          "inmateNumbers.number": normalizedNumber,
          "inmateNumbers.state": normalizedState
        });
        if (mailDoc) {
          resolvedMailingList = mailDoc._id;
        }
      }
      const newDrawing = new db.Drawing({
        uploadedBy,
        ...(imageLink && { imageLink }),
        ...(notes && { notes }),
        ...(resolvedMailingList && { mailingList: resolvedMailingList }),
        ...(inmateNumbers && { inmateNumbers }),
        ...(imageFileId && { imageFileId }),
        ...(imageBucketName && { imageBucketName })
      });
      const savedDrawing = await newDrawing.save();
      return res.status(201).json({
        ...savedDrawing.toObject(),
        message: "Drawing created successfully!"
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({
          message: err.message
        });
      }
      if (err.name === "CastError") {
        return res.status(400).json({
          message: `Invalid value for field "${err.path}".`
        });
      }
      return res.status(500).json({
        message: "Error creating drawing."
      });
    }
  },    

  updateDrawing: async (req, res) => {
    const { id } = req.params;
    const {
      imageLink,
      notes,
      uploadedBy,
      inmateNumber,
      state,
      mailingList,
      imageFileId,
      imageBucketName,
    } = req.body;
    try {
      if (!id) {
        return res.status(400).json({ message: "Missing drawing id." });
      }
      const updateData = {};
      if (imageLink !== undefined) {
        if (imageLink != null && typeof imageLink !== "string") {
          return res
            .status(400)
            .json({ message: "imageLink must be a string." });
        }
        updateData.imageLink =
          typeof imageLink === "string" ? imageLink.trim() : imageLink;
      }
      if (notes !== undefined) {
        if (notes != null && typeof notes !== "string") {
          return res.status(400).json({ message: "notes must be a string." });
        }
        updateData.notes = notes;
      }
      if (uploadedBy !== undefined) {
        updateData.uploadedBy = uploadedBy;
      }
      if (mailingList !== undefined) {
        updateData.mailingList = mailingList;
      }
      if (imageFileId !== undefined) {
        updateData.imageFileId = imageFileId; // Mongoose will cast string → ObjectId
      }
      if (imageBucketName !== undefined) {
        updateData.imageBucketName = imageBucketName;
      }
      // inmateNumber is OPTIONAL on update as well.
      // Only if inmateNumber is provided do we require state and do a lookup.
      if (inmateNumber !== undefined) {
        if (inmateNumber != null && inmateNumber !== "") {
          if (typeof inmateNumber !== "string") {
            return res.status(400).json({
              message: "inmateNumber must be a string when provided.",
            });
          }
          // state becomes required only if inmateNumber was provided and non-empty
          if (state == null || state === "" || typeof state !== "string") {
            return res.status(400).json({
              message:
                "state must be a non-empty string when inmateNumber is provided.",
            });
          }
          const normalizedNumber = inmateNumber.replace(/\s+/g, "");
          const normalizedState = state.trim();
          const mailDoc = await db.Mail.findOne({
            "inmateNumbers.number": normalizedNumber,
            "inmateNumbers.state": normalizedState,
          });
          if (!mailDoc) {
            return res.status(404).json({
              message:
                "No mail user found for the provided inmate number and state.",
            });
          }
          updateData.mailingList = mailDoc._id;
          updateData.inmateNumbers = [
            {
              number: inmateNumber,
              state,
            },
          ];
        } else {
          // inmateNumber explicitly set to empty/null: you might want to clear inmate info
          // This part is optional; uncomment if you want this behavior:
          //
          // updateData.inmateNumbers = [];
          // updateData.mailingList = undefined;
        }
      }
      // If inmateNumber is not in the body at all, we ignore state and do no lookup.
      if (Object.keys(updateData).length === 0) {
        return res
          .status(400)
          .json({ message: "No updatable fields provided." });
      }
      const updatedDrawing = await db.Drawing.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!updatedDrawing) {
        return res.status(404).json({ message: "Drawing not found." });
      }
      return res.status(200).json({
        ...updatedDrawing.toObject(),
        message: "Drawing updated successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(400)
          .json({ message: `Invalid value for field "${err.path}".` });
      }
      return res.status(500).json({ message: "Error updating drawing." });
    }
  },

  // READ - GET ALL
  getAllDrawings: async (req, res) => {
    try {
      const drawings = await db.Drawing.find().sort({ createdAt: -1 });
      return res.status(200).json(drawings);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Error fetching drawings." });
    }
  },


  // DELETE
  deleteDrawing: async (req, res) => {
    const { id } = req.params;
    try {
      if (!id) {
        return res.status(400).json({ message: "Missing drawing id." });
      }
      // Delete document first
      const deletedDrawing = await db.Drawing.findByIdAndDelete(id);
      if (!deletedDrawing) {
        return res.status(404).json({ message: "Drawing not found." });
      }
      // Best-effort: delete associated GridFS file (and its chunks)
      try {
        await deleteGridFsFileById(
          deletedDrawing.imageBucketName,
          deletedDrawing.imageFileId,
        );
      } catch (err) {
        // Log but don't fail the API if file deletion fails
        console.warn(
          "Failed to delete GridFS file for drawing",
          deletedDrawing._id.toString(),
          err.message,
        );
      }
      return res.status(200).json({
        ...deletedDrawing.toObject(),
        message: "Drawing deleted successfully!",
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Error deleting drawing." });
    }
  },


};


export default drawingControllers
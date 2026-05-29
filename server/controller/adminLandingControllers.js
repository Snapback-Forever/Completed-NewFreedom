import db from "../db/index.js";
import {
  imagesBucket,
  videosBucket,
  audioBucket,
  otherBucket,
} from '../gridfs.js';
import { deleteGridFsFileById } from "../gridfsHelper.js";

function getBucketForMime(mimetype) {
  if (mimetype?.startsWith('image/')) return { bucket: imagesBucket, bucketName: 'images' };
  if (mimetype?.startsWith('video/')) return { bucket: videosBucket, bucketName: 'videos' };
  if (mimetype?.startsWith('audio/')) return { bucket: audioBucket, bucketName: 'audio' };
  return { bucket: otherBucket, bucketName: 'other' };
}

const adminLandingControllers = {
  
  addAdminLanding: async (req, res) => {
    // Text fields from req.body
    const {
      // main section
      mainContent,
      mainVideo,
      mainTitle,
      subTitle,
      heroImage,
      // why section
      whyMainImg,
      whySub,
      whyContent,
      whyTitle,
      // approach section
      approachMainImg,
      approachSub,
      approachVideo,
      approachContent,
      approachTitle,
      // inpatient section
      inpatientMainImg,
      InpatientSub,
      InpatientVideo,
      InpatientContent,
      InpatientTitle,
      // outreach section
      outreachMainImg,
      outReachSub,
      outReachVideo,
      outReachContent,
      outReachTitle,
      // mentor section
      mentorMainImg,
      mentorSub,
      mentorVideo,
      mentorContent,
      mentorTitle,
      // delete flags from client (added by handleClearUploadImage)
      heroImgDeleted,
      whyImgDeleted,
      approachImgDeleted,
      inpatientImgDeleted,
      outreachImgDeleted,
      mentorImgDeleted,
    } = req.body;
    const files = req.files || {};
    const newlyUploaded = [];
    try {
      // Helper: upload a single image field from req.files
      const uploadField = async (fieldPrefix) => {
        const arr = files[`${fieldPrefix}File`]; // e.g. heroImgFile
        if (!arr || arr.length === 0) return null;
        const file = arr[0];
        const { bucket, bucketName } = getBucketForMime(file.mimetype);
        if (!bucket) throw new Error('GridFS bucket not initialized');
        const filename = `${Date.now()}_${file.originalname}`;
        const uploadStream = bucket.openUploadStream(filename, {
          contentType: file.mimetype,
        });
        const fileId = await new Promise((resolve, reject) => {
          uploadStream.on('finish', () => resolve(uploadStream.id));
          uploadStream.on('error', reject);
          uploadStream.end(file.buffer);
        });
        newlyUploaded.push({ bucketName, fileId });
        return { fileId, bucketName };
      };
      // Upload new images if user changed them
      const heroUpload      = await uploadField('heroImg');
      const whyUpload       = await uploadField('whyImg');
      const approachUpload  = await uploadField('approachImg');
      const inpatientUpload = await uploadField('inpatientImg');
      const outReachUpload  = await uploadField('outreachImg');
      const mentorUpload    = await uploadField('mentorImg');
      // Load existing Admin doc
      const existing = await db.Admin.findOne({});
      // Build $set and $unset separately
      const $set = {
        // main section
        mainContent,
        mainVideo,
        mainTitle,
        subTitle,
        heroImage,
        // why section
        whyMainImg,
        whySub,
        whyContent,
        whyTitle,
        // approach section
        approachMainImg,
        approachSub,
        approachVideo,
        approachContent,
        approachTitle,
        // inpatient section
        inpatientMainImg,
        InpatientSub,
        InpatientVideo,
        InpatientContent,
        InpatientTitle,
        // outreach section
        outreachMainImg,
        outReachSub,
        outReachVideo,
        outReachContent,
        outReachTitle,
        // mentor section
        mentorMainImg,
        mentorSub,
        mentorVideo,
        mentorContent,
        mentorTitle,
      };
      if (req.user && req.user?._id) {
        $set.updatedBy = req.user?._id;
      }
      const $unset = {};
      // Helper to handle one image group: upload result + delete flag
      const applyImageUpdate = (opts) => {
        const {
          uploadResult,       // heroUpload, whyUpload, ...
          deletedFlag,        // heroImgDeleted, ...
          idField,            // 'heroImgFileId', ...
          bucketField,        // 'heroImgBucketName', ...
        } = opts;
        // Normalize flag to boolean
        const isDeleted = deletedFlag === 'true' || deletedFlag === true;
        if (isDeleted) {
          // User clicked Cancel: clear fields in MongoDB
          $unset[idField] = 1;
          $unset[bucketField] = 1;
          return;
        }
        if (uploadResult) {
          // New file uploaded: set new id and bucket
          $set[idField] = uploadResult.fileId;
          $set[bucketField] = uploadResult.bucketName;
        } else if (existing) {
          // No new upload and not deleted: keep existing values
          if (existing[idField]) {
            $set[idField] = existing[idField];
          }
          if (existing[bucketField]) {
            $set[bucketField] = existing[bucketField];
          }
        }
      };
      applyImageUpdate({
        uploadResult: heroUpload,
        deletedFlag: heroImgDeleted,
        idField: 'heroImgFileId',
        bucketField: 'heroImgBucketName',
      });
      applyImageUpdate({
        uploadResult: whyUpload,
        deletedFlag: whyImgDeleted,
        idField: 'whyImgFileId',
        bucketField: 'whyImgBucketName',
      });
      applyImageUpdate({
        uploadResult: approachUpload,
        deletedFlag: approachImgDeleted,
        idField: 'approachImgFileId',
        bucketField: 'approachImgBucketName',
      });
      applyImageUpdate({
        uploadResult: inpatientUpload,
        deletedFlag: inpatientImgDeleted,
        idField: 'impatientImgFileId',     // matches schema
        bucketField: 'impatientImgBucketName',
      });
      applyImageUpdate({
        uploadResult: outReachUpload,
        deletedFlag: outreachImgDeleted,
        idField: 'outReachImgFileId',
        bucketField: 'outReachImgBucketName',
      });
      applyImageUpdate({
        uploadResult: mentorUpload,
        deletedFlag: mentorImgDeleted,
        idField: 'mentorImgFileId',
        bucketField: 'mentorImgBucketName',
      });
      // Build update document
      const updateDoc = {};
      if (Object.keys($set).length)   updateDoc.$set = $set;
      if (Object.keys($unset).length) updateDoc.$unset = $unset;
      const adminLanding = await db.Admin.findOneAndUpdate(
        {}, // single global document
        updateDoc,
        {
          new: true,        // or returnDocument: 'after' in newer Mongoose
          upsert: true,
          runValidators: true,
        },
      );
      // Delete any old files that were replaced
      if (existing) {
        const fileFields = [
          ['heroImgFileId', 'heroImgBucketName'],
          ['whyImgFileId', 'whyImgBucketName'],
          ['approachImgFileId', 'approachImgBucketName'],
          ['impatientImgFileId', 'impatientImgBucketName'],
          ['outReachImgFileId', 'outReachImgBucketName'],
          ['mentorImgFileId', 'mentorImgBucketName'],
        ];
        for (const [idField, bucketField] of fileFields) {
          const oldId = existing[idField];
          const oldBucket = existing[bucketField];
          const newId = adminLanding[idField]; // may be undefined if unset
          // If old exists, and new is different (or now missing), delete old file
          if (
            oldId &&
            oldBucket &&
            oldId.toString() !== String(newId || '')
          ) {
            try {
              await deleteGridFsFileById(oldBucket, oldId);
            } catch (err) {
              console.warn(
                `Failed to delete old file for ${idField}:`,
                err.message,
              );
            }
          }
        }
      }
      return res.json({
        ...adminLanding.toObject(),
        message: 'Admin landing content saved successfully!',
      });
    } catch (err) {
      console.error(err);
      // Roll back any newly uploaded files on error
      for (const { bucketName, fileId } of newlyUploaded) {
        try {
          await deleteGridFsFileById(bucketName, fileId);
        } catch (delErr) {
          console.warn('Failed to rollback uploaded file:', delErr.message);
        }
      }
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: 'Error saving admin landing content' });
    }
  },

  addAdminAdditionalImage: async (req, res) => {
    const { section, description, link } = req.body;
    const files = req.files || {};
    const newlyUploaded = [];
  
    try {
  
      if (!section) {
        return res.status(400).json({ message: "Section is required" });
      }
  
      const allowedSections = {
        main: "mainAdditionalImages",
        why: "whyAdditionalImages",
        approach: "approachAdditionalImages",
        inpatient: "inpatientAdditionalImages",
        outreach: "outreachAdditionalImages",
        mentor: "mentorAdditionalImages",
      };
  
      const arrayField = allowedSections[section];
  
      if (!arrayField) {
        return res.status(400).json({ message: "Invalid section" });
      }
  
      const arr = files.imageFile;
  
      if (!arr || arr.length === 0) {
        return res.status(400).json({ message: "Image file required" });
      }
  
      const file = arr[0];
  
      const { bucket, bucketName } = getBucketForMime(file.mimetype);
  
      if (!bucket) {
        throw new Error("GridFS bucket not initialized");
      }
  
      const filename = `${Date.now()}_${file.originalname}`;
  
      const uploadStream = bucket.openUploadStream(filename, {
        contentType: file.mimetype,
      });
  
      const fileId = await new Promise((resolve, reject) => {
        uploadStream.on("finish", () => resolve(uploadStream.id));
        uploadStream.on("error", reject);
        uploadStream.end(file.buffer);
      });
  
      newlyUploaded.push({ bucketName, fileId });
  
      const imageObject = {
        link: link || "",
        description: description || "",
        imageFileId: fileId,
        imageBucketName: bucketName,
      };
  
      const update = {
        $push: {
          [arrayField]: imageObject,
        },
      };
  
      const admin = await db.Admin.findOneAndUpdate(
        {},
        update,
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );
  
      return res.json({
        image: imageObject,
        admin,
        message: "Image added successfully",
      });
  
    } catch (err) {
  
      console.error(err);
  
      for (const { bucketName, fileId } of newlyUploaded) {
        try {
          await deleteGridFsFileById(bucketName, fileId);
        } catch (rollbackErr) {
          console.warn("Rollback failed:", rollbackErr.message);
        }
      }
  
      return res.status(500).json({
        message: "Error adding additional image",
      });
    }
  },  

  removeAdminAdditionalImage: async (req, res) => {
    const { section } = req.params;
    const { link, imageFileId } = req.body;
    if (!link && !imageFileId) {
      return res.status(400).json({
        message: "link or imageFileId is required."
      });
    }
    try {
      const allowedSections = {
        main: "mainAdditionalImages",
        why: "whyAdditionalImages",
        approach: "approachAdditionalImages",
        inpatient: "inpatientAdditionalImages",
        outreach: "outreachAdditionalImages",
        mentor: "mentorAdditionalImages",
      };
      const arrayField = allowedSections[section];
      if (!arrayField) {
        return res.status(400).json({ message: "Invalid section." });
      }
      const admin = await db.Admin.findOne();
      if (!admin) {
        return res.status(404).json({ message: "Admin document not found." });
      }
      const existingImages = Array.isArray(admin[arrayField])
        ? admin[arrayField]
        : [];
      const imageToDelete = existingImages.find(img =>
        (link && img.link === link) ||
        (imageFileId && String(img.imageFileId) === String(imageFileId))
      );
      if (imageToDelete?.imageFileId) {
        await deleteGridFsFileById("images", imageToDelete.imageFileId);
      }
      const updatedImages = existingImages.filter(img =>
        !(imageToDelete && String(img.imageFileId) === String(imageToDelete.imageFileId))
      );
      admin[arrayField] = updatedImages;
      const updatedAdmin = await admin.save();
      return res.json({
        ...updatedAdmin.toObject(),
        message: "Selected image removed successfully!"
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error removing additional image."
      });
    }
  },
  

  getUpdateLanding: async (req, res) => {
    try {
      // Fetch the single (most recent) Admin landing document
      const adminLanding = await db.Admin
        .findOne({})
        .sort({ updatedAt: -1 }); // uses timestamps from your schema
      if (!adminLanding) {
        return res.json({ message: "No admin landing content found" });
      }

      return res.json(adminLanding);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Error fetching admin landing content" });
    }
  },



}

export default adminLandingControllers
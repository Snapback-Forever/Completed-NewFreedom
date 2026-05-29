// routes/uploadImages.js
import { Router } from 'express';
import { upload } from '../multer.js';
import {
  imagesBucket,
  otherBucket,
  videosBucket,
  audioBucket,
  ObjectId,
} from '../gridfs.js';

const uploadImages = Router();

/**
 * Decide which bucket to use based on mimetype
 */
function getBucketForMime(mimetype) {
  if (mimetype?.startsWith('image/')) {
    return { bucket: imagesBucket, bucketName: 'images' };
  }
  if (mimetype?.startsWith('video/')) {
    return { bucket: videosBucket, bucketName: 'videos' };
  }
  if (mimetype?.startsWith('audio/')) {
    return { bucket: audioBucket, bucketName: 'audio' };
  }
  // Everything else (PDF, DOCX, etc.)
  return { bucket: otherBucket, bucketName: 'other' };
}
/**
 * Get bucket by name (used when you already know bucketName)
 */
function getBucketByName(name) {
  if (name === 'images') return imagesBucket;
  if (name === 'videos') return videosBucket;
  if (name === 'audio') return audioBucket;
  if (name === 'other') return otherBucket;
  return null;
}

/**
 * POST /upload/image
 * Body: multipart/form-data with `image` field
 * Stores any file (image/video/audio/other) in the correct bucket based on mimetype.
 */
uploadImages.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const { bucket, bucketName } = getBucketForMime(req.file.mimetype);
  if (!bucket) {
    return res
      .status(500)
      .json({ message: 'GridFS bucket not initialized' });
  }
  const filename = `${Date.now()}_${req.file.originalname}`;
  const uploadStream = bucket.openUploadStream(filename, {
    contentType: req.file.mimetype,
  });
  uploadStream.end(req.file.buffer);
  uploadStream.on('finish', () => {
    res.json({
      message: 'File uploaded',
      fileId: uploadStream.id,
      filename,
      bucketName,
    });
  });
  uploadStream.on('error', (err) => {
    console.error('Upload stream error:', err);
    res.status(500).json({ message: 'Upload failed' });
  });
});

// DELETE /upload/image/:id?bucketName=images|videos|audio|other
uploadImages.delete('/image/:id', async (req, res) => {
  const { bucketName } = req.query;
  const { id } = req.params;
  if (!bucketName) {
    return res.status(400).json({
      message: 'Missing bucketName (images|videos|audio|other)',
    });
  }
  try {
    await deleteGridFsFileById(bucketName, id);
    return res.json({ message: 'File deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    return res
      .status(400)
      .json({ message: 'Delete failed', error: err.message });
  }
});

/**
 * POST /upload/image
 * Body: multipart/form-data with `image` field
 * Stores any file (image/video/audio/other) in the correct bucket based on mimetype.
 */
uploadImages.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const { bucket, bucketName } = getBucketForMime(req.file.mimetype);
  if (!bucket) {
    return res
      .status(500)
      .json({ message: 'GridFS bucket not initialized' });
  }
  const filename = `${Date.now()}_${req.file.originalname}`;
  const uploadStream = bucket.openUploadStream(filename, {
    contentType: req.file.mimetype,
  });
  uploadStream.end(req.file.buffer);
  uploadStream.on('finish', () => {
    res.json({
      message: 'File uploaded',
      fileId: uploadStream.id,
      filename,
      bucketName,
    });
  });
  uploadStream.on('error', (err) => {
    console.error('Upload stream error:', err);
    res.status(500).json({ message: 'Upload failed' });
  });
});

// DELETE /upload/image/:id?bucketName=images|videos|audio|other
uploadImages.delete('/image/:id', async (req, res) => {
  const { bucketName } = req.query;
  const { id } = req.params;
  if (!bucketName) {
    return res.status(400).json({
      message: 'Missing bucketName (images|videos|audio|other)',
    });
  }
  try {
    await deleteGridFsFileById(bucketName, id);
    return res.json({ message: 'File deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    return res
      .status(400)
      .json({ message: 'Delete failed', error: err.message });
  }
});

/**
 * PUT /upload/image/:id?bucketName=images|videos|audio|other
 * Body: multipart/form-data with `image` field
 * Replaces a file, auto-selecting a new bucket based on the new file mimetype.
 */
uploadImages.put('/image/:id', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const { bucketName } = req.query;
  const oldBucket = getBucketByName(bucketName);
  const {
    bucket: newBucket,
    bucketName: newBucketName,
  } = getBucketForMime(req.file.mimetype);
  if (!newBucket) {
    return res
      .status(500)
      .json({ message: 'GridFS bucket not initialized' });
  }
  if (oldBucket) {
    try {
      const oldId = new ObjectId(req.params.id);
      await oldBucket.delete(oldId);
    } catch (err) {
      console.warn('Old file delete failed (continuing):', err.message);
    }
  }
  const filename = `${Date.now()}_${req.file.originalname}`;
  const uploadStream = newBucket.openUploadStream(filename, {
    contentType: req.file.mimetype,
  });
  uploadStream.end(req.file.buffer);
  uploadStream.on('finish', () => {
    res.json({
      message: 'File replaced',
      fileId: uploadStream.id,
      filename,
      bucketName: newBucketName,
    });
  });
  uploadStream.on('error', (err) => {
    console.error('Replace upload error:', err);
    res.status(500).json({ message: 'Replace upload failed' });
  });
});

/**
 * GET /upload/image/:id?bucketName=images|videos|audio|other
 * Streams the file (image/video/audio/other) from the correct bucket.
 */
uploadImages.get('/image/:id', (req, res) => {
  const { bucketName } = req.query;
  const bucket = getBucketByName(bucketName);
  if (!bucket) {
    return res.status(400).json({
      message: 'Invalid or missing bucketName (images|videos|audio|other)',
    });
  }
  let fileId;
  try {
    fileId = new ObjectId(req.params.id);
  } catch {
    return res.status(400).json({ message: 'Invalid file id' });
  }
  const downloadStream = bucket.openDownloadStream(fileId);
  downloadStream.on('file', (file) => {
    // Set appropriate Content-Type so <img>, <video>, <audio> work correctly
    res.set('Content-Type', file.contentType || 'application/octet-stream');
    // For forced download instead of inline viewing:
    // res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
  });
  downloadStream.on('error', () => {
    res.status(404).json({ message: 'File not found' });
  });
  downloadStream.pipe(res);
});

/**
 * GET /upload/files?bucketName=images|videos|audio|other
 * Lists all files in the specified bucket.
 */
uploadImages.get('/files', async (req, res) => {
  const { bucketName } = req.query;
  const bucket = getBucketByName(bucketName);
  if (!bucket) {
    return res.status(400).json({
      message: 'Invalid or missing bucketName (images|videos|audio|other)',
    });
  }
  try {
    const files = [];
    const cursor = bucket.find({});
    for await (const doc of cursor) {
      files.push(doc);
    }
    res.json({ files });
  } catch (err) {
    console.error('List files error:', err);
    res.status(500).json({ message: 'Failed to list files' });
  }
});
export default uploadImages;
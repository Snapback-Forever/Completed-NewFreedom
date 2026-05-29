// gridfsHelpers.js
import {
  imagesBucket,
  videosBucket,
  audioBucket,
  otherBucket,
  ObjectId,
} from './gridfs.js';

export function getBucketByName(name) {
  switch (name) {
    case 'images':
      return imagesBucket;
    case 'videos':
      return videosBucket;
    case 'audio':
      return audioBucket;
    case 'other':
      return otherBucket;
    default:
      return null;
  }
}
export async function deleteGridFsFileById(bucketName, fileId) {
  if (!bucketName || !fileId) return;
  const bucket = getBucketByName(bucketName);
  if (!bucket) {
    console.warn(`deleteGridFsFileById: invalid bucketName "${bucketName}"`);
    return;
  }
  const id = typeof fileId === 'string' ? new ObjectId(fileId) : fileId;
  await bucket.delete(id);
}
// gridfs.js
import mongoose from 'mongoose';
const { GridFSBucket, ObjectId } = mongoose.mongo;
let imagesBucket;
let videosBucket;
let audioBucket;
let otherBucket;

function initBuckets() {
  if (!mongoose.connection.db) {
    throw new Error('MongoDB connection is not ready yet');
  }
  imagesBucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'images',
  });
  videosBucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'videos',
  });
  audioBucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'audio',
  });
  otherBucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'other',
  });
}
export {
  imagesBucket,
  videosBucket,
  audioBucket,
  otherBucket,
  initBuckets,
  ObjectId,
};
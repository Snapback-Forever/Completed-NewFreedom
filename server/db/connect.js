// db/connect.js
import config from "../config.js";
import mongoose from "mongoose";
import { server } from "../socket/index.js";
import { initBuckets } from "../gridfs.js";

const connect = () => {

  mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    console.log("The goose is on the loose");
    initBuckets(); // must not throw
    server.listen(config.PORT, () => {
      console.log(`Tiny ears listen on PORT ${config.PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

};

export default connect;
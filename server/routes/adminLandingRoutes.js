// adminLandingRoutes.js
import express from "express";
import multer from "multer";
import controllers from "../controller/index.js";

const adminLandingRoutes = express.Router();
const upload = multer(); // memory storage

// ✅
adminLandingRoutes
  .route('/addAdminLanding/admin')
  .post( upload.fields([
      { name: 'heroImgFile', maxCount: 1 },
      { name: 'whyImgFile', maxCount: 1 },
      { name: 'approachImgFile', maxCount: 1 },
      { name: 'inpatientImgFile', maxCount: 1 },
      { name: 'outreachImgFile', maxCount: 1 }, // match frontend
      { name: 'mentorImgFile', maxCount: 1 },
    ]), controllers.addAdminLanding );

// ✅
adminLandingRoutes
.route("/getUpdateLanding/admin")
.get(controllers.getUpdateLanding);

adminLandingRoutes
.route("/removeAdminAdditionalImage/:section/admin")
.post(controllers.removeAdminAdditionalImage);

adminLandingRoutes
.route("/addAdminAdditionalImage/admin")
.post(upload.fields([{ name: "imageFile", maxCount: 1 }]),
  controllers.addAdminAdditionalImage)



export default adminLandingRoutes;
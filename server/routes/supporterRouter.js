import express from "express";
import controllers from "../controller/index.js";
 
const supporterRouter = express.Router();

supporterRouter
    .route("/addSupporter/supporter")
    .post(controllers.addSupporter);

supporterRouter
    .route("/updateSupporter/:supporterId/supporter")
    .post(controllers.updateSupporter);

supporterRouter
    .route("/deleteSupporter/:supporterId/supporter")
    .post(controllers.deleteSupporter);

supporterRouter
    .route("/addAddress/:supporterId/supporter")
    .post(controllers.addAddress);

supporterRouter
    .route("/addSocial/:supporterId/supporter")
    .post(controllers.addSocial);

supporterRouter
    .route("/deleteSocial/:supporterId/:socialId/supporter")
    .post(controllers.deleteSocial);

supporterRouter
    .route("/updateSocial/:supporterId/supporter")
    .post(controllers.updateSocial);

supporterRouter
    .route("/updateSupporterTier/:supporterId/supporter")
    .post(controllers.updateSupporterTier);

supporterRouter
    .route("/getAllSupporters/supporter")
    .get(controllers.getAllSupporters);

export default supporterRouter;
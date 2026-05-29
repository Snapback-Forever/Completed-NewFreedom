import express from "express";
import controllers from "../controller/index.js";

const applyRouter = express.Router();

// ✅
applyRouter 
    .route("/addApplication/app")
    .post(controllers.addApplication);

// ✅
applyRouter
    .route("/updateApplication/:id/app")
    .post(controllers.updateApplication);

// ✅
applyRouter
    .route("/deleteApplication/:id/app")
    .post(controllers.deleteApplication);

// ✅
applyRouter
    .route("/addApplicationReview/:id/app")
    .post(controllers.addApplicationReview);

 // ✅   
applyRouter
    .route("/addApplicationInterview/:id/app")
    .post(controllers.addApplicationInterview);

// ✅     
applyRouter
    .route("/updateApplicationStatus/:id/app")
    .post(controllers.updateApplicationStatus);

// ✅  
applyRouter
    .route("/addWorkEthicNote/:id/app")
    .post(controllers.addWorkEthicNote);

// ✅  
applyRouter
    .route("/updateWorkEthicNote/:id/:noteId/app")
    .post(controllers.updateWorkEthicNote);

// ✅  
applyRouter
    .route("/addWorkDoneEntry/:id/:noteId/app")
    .post(controllers.addWorkDoneEntry);

// ✅ 
applyRouter
    .route("/updateWorkDoneEntry/:id/:noteId/:workDoneId/app")
    .post(controllers.updateWorkDoneEntry);

// ✅ 
applyRouter
    .route("/deleteWorkDoneEntry/:id/:noteId/:workDoneId/app")
    .post(controllers.deleteWorkDoneEntry);

// ✅   
applyRouter
    .route("/getAllApplications/app")
    .get(controllers.getAllApplications);


export default applyRouter;
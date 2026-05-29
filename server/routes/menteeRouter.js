import express from "express";
import controllers from "../controller/index.js";

const menteeRouter = express.Router();

// ✅
menteeRouter
    .route("/addMailUser/mailUser")
    .post(controllers.addMailUser);

// ✅ 
menteeRouter
    .route("/updateMailEntry/:mailId/mailUser")
    .post(controllers.updateMailEntry);

// ✅ 
menteeRouter
    .route("/addMentorAttached/:mailId/mentor")
    .post(controllers.addMentorAttached);

// ✅ 
menteeRouter
    .route("/removeMentor/:mailId/mentor")
    .post(controllers.removeMentor)

// ✅ 
menteeRouter
    .route("/addInmateNumber/:mailId/mailUser")
    .post(controllers.addInmateNumber);

// ✅ 
menteeRouter
    .route("/removeInmateNumber/:mailId/mailUser")
    .post(controllers.removeInmateNumber);

// ✅
menteeRouter
    .route("/searchMailUser")
    .get(controllers.searchMailList);

// ✅
menteeRouter
    .route("/addPastCharges/:mailId/mailUser")
    .post(controllers.addPastCharges);

// ✅
menteeRouter
    .route("/removePastCharges/:mailId/mailUser")
    .post(controllers.removePastCharges);

// ✅  
menteeRouter
    .route("/addPendingCharges/:mailId/mailUser")
    .post(controllers.addPendingCharges);

// ✅
menteeRouter
    .route("/removePendingCharges/:mailId/mailUser")
    .post(controllers.removePendingCharges);

// ✅   
menteeRouter
    .route("/addReceivedMsg/:mailId/mailUser")
    .post(controllers.addReceivedMsg);

// ✅
menteeRouter
    .route("/updateReceivedMsg/:mailId/:msgId/mailUser")
    .post(controllers.updateReceivedMsg);

// ✅
menteeRouter
    .route("/getSingleReceivedMsg/:mailId/:msgId/mailUser")
    .post(controllers.getSingleReceivedMsg);

// ✅
menteeRouter
    .route("/deleteReceivedMsg/:mailId/:msgId/mailUser")
    .post(controllers.deleteReceivedMsg);

// ✅
menteeRouter
    .route("/updatePaperwork/:mailId/mailUser")
    .post(controllers.updatePaperwork);

// ✅
menteeRouter
    .route("/deletePaperwork/:mailId/:paperworkId/mailUser")
    .post(controllers.deletePaperwork);

// ✅
menteeRouter
    .route("/updateApprovedAcceptance/:mailId/mailUser")
    .post(controllers.updateApprovedAcceptance);

// ✅    
menteeRouter
    .route("/updateStatus/:mailId/mailUser")
    .post(controllers.updateStatus);

// ✅     
menteeRouter
    .route("/updateProgramStatus/:mailId/mailUser")
    .post(controllers.updateProgramStatus);

// ✅  
menteeRouter
    .route("/getAllMailEntries/mailUser")
    .get(controllers.getAllMailEntries);

// ✅   
menteeRouter
    .route("/reduceMailUser/:mailId/:currentUserId/mailUser")
    .post(controllers.reduceMailUser);

// ✅   
menteeRouter
    .route("/deleteMailEntry/:mailId/mailUser")
    .post(controllers.deleteMailEntry);

export default menteeRouter;
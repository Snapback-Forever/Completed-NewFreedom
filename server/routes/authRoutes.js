import controllers from "../controller/index.js";
import express from "express";

const authRouter = express.Router()
// ✅
authRouter
    .route("/registerUser/user")
    .post(controllers.registerUser);

// ✅
authRouter
    .route("/loginUser/user")
    .post(controllers.loginUser)

// ✅
authRouter
    .route("/changePassword/:userId/user")
    .post(controllers.changePassword)

// ✅
authRouter
    .route("/adminChangePassword/:userId/user")
    .post(controllers.adminChangePassword)

// ✅
authRouter
    .route("/getUserById/:_id/user")
    .get(controllers.getUserById)

// ✅
authRouter
    .route("/adminGetAllUsers/user")
    .get(controllers.adminGetAllUsers)

// ✅
authRouter
    .route("/getAllUsers/user")
    .get(controllers.getAllUsers)

// ✅
authRouter
    .route("/deleteUser/:authId/:userId/user")
    .post(controllers.deleteUser);

// ✅
authRouter
    .route("/updateProfile/:userId/user")
    .post(controllers.updateProfile);

authRouter
    .route("/adminUpdateProfile/:adminId/:userId/user")
    .post(controllers.adminUpdateProfile);


// ✅ works for single OR multiple adds
authRouter
    .route("/addAllowedEmail/add")
    .post(controllers.addAllowedEmail);


// ✅ works for single OR multiple removal
authRouter
    .route("/removeAllowedEmail/remove")
    .post(controllers.removeAllowedEmail);

// ✅ works for single OR multiple add
authRouter
    .route("/addNotAllowedEmail/add")
    .post(controllers.addNotAllowedEmail);

// ✅ works for single OR multiple removal
authRouter
    .route("/removeNotAllowedEmail/remove")
    .post(controllers.removeNotAllowedEmail);

// ✅
authRouter
    .route("/getAllAllowedEmails")
    .get(controllers.getAllAllowedEmails);

// ✅
authRouter
    .route("/getAllNotAllowedEmails")
    .get(controllers.getAllNotAllowedEmails);

authRouter
    .route("/getAllAuditLogs/user")
    .get(controllers.getAllAuditLogs)

// ✅
authRouter
    .route("/getAllAuditLogs/log")
    .get(controllers.getAllAuditLogs);

authRouter
    .route("/deleteAuditLog/:id")
    .post(controllers.deleteAuditLog);

// ✅
authRouter
    .route("/setAdminNFStatus/:userId/:authId/user")
    .post(controllers.setAdminNFStatus);

// ✅ apply security access
authRouter
    .route("/setSecurityAccessLevels/:userId/:authId/user")
    .post(controllers.setSecurityAccessLevels);

// ✅ 
authRouter
    .route("/toggleCreatorFlag/:userId/:authId/user")
    .post(controllers.toggleCreatorFlag);

authRouter
    .route("/searchUser")
    .get(controllers.searchUserList);

authRouter
    .route("/selfServiceChangePassword/account/:accountName")
    .post(controllers.selfServiceChangePassword);

authRouter
    .route("/getAllForgotPasswords")
    .get(controllers.getAllForgotPasswords);

authRouter
    .route("/updateMessageStatus")
    .post(controllers.updateMessageStatus);

authRouter
    .route("/deleteForgotPassword/:id")
    .post(controllers.deleteForgotPassword);

authRouter
    .route("/getSingleForgotPassword/:id")
    .get(controllers.getSingleForgotPassword);





export default authRouter
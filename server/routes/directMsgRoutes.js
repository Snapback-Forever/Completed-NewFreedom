import express from "express";
import controllers from "../controller/index.js";

const directMsgRoutes = express.Router();

directMsgRoutes
.route("/addDirectMsg/:userId/direct")
.post(controllers.addDirectMsg)

directMsgRoutes
.route("/updateDirectMsg/:directMsgId/direct")
.post(controllers.updateDirectMsg)

directMsgRoutes
.route("/updateDirectMsgResponse/:directMsgId/:responseId/direct")
.post(controllers.updateDirectMsgResponse)

directMsgRoutes
.route("/forwardDirectMsg/:directMsgId/direct")
.post(controllers.forwardDirectMsg)

directMsgRoutes
.route("/deleteDirectMsg/:directMsgId/direct")
.post(controllers.deleteDirectMsg)

directMsgRoutes
.route("/getAllDirectMsgAdmin/direct")
.get(controllers.getAllDirectMsgAdmin)

export default directMsgRoutes;
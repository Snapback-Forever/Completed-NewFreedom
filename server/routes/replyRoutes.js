import {Router} from "express"
import controllers from "../controller/index.js"


const replyRouter = Router()

replyRouter
.route("/addReply/:postId")
.post(controllers.addReply) 

replyRouter
.route("/getSingleReply/:replyId")
.post(controllers.getSingleReply)

replyRouter
.route("/getAllReplys")
.get(controllers.getAllReplys) 

replyRouter
.route("/deleteReply/:replyId")
.post(controllers.deleteReply) 


export default replyRouter
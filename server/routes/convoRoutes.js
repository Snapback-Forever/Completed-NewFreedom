import { Router } from "express"
import controllers from "../controller/index.js";

const conversationRouter = Router()

conversationRouter
.route("/conversationDelete/:convoId/convo")
.post(controllers.conversationDelete)

conversationRouter
.route("/getAllConvo")
.get(controllers.getAllConvo)

conversationRouter
.route("/getSingleConvo/:convoId/convo")
.get(controllers.getSingleConvo)


export default conversationRouter
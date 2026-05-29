import express from "express"
import authRouter from "./authRoutes.js"
import conversationRouter from "./convoRoutes.js"
import postRouter from "./postRoutes.js"
import questionRouter from "./questionRoutes.js"
import programRouter from "./programRoutes.js"
import applicationRoutes from "./applicationRoutes.js"
import menteeRouter from "./menteeRouter.js"
import applyNFRoutes from "./ApllyNfRoutes.js"
import eventRouter from "./EventRouters.js"
import newsletter from "./newsLetterRouter.js"
import successRouter from "./successRouter.js"
import supportRouter from "./supporterRouter.js"
import directMsgRoutes from "./directMsgRoutes.js"
import adminLandingRoutes from "./adminLandingRoutes.js"
import drawingRoutes from "./drawingRoutes.js"
import uploadImages from "./uploadImageRoutes.js"
import replyRouter from "./replyRoutes.js"

const routes = express.Router()

routes.use("/admin", adminLandingRoutes)
routes.use("/convo", conversationRouter)
routes.use("/applyNf", applyNFRoutes)
routes.use("/app", applicationRoutes)
routes.use("/auth", authRouter)
routes.use("/convo", conversationRouter)
routes.use("/staffMsg", directMsgRoutes)
routes.use("/event", eventRouter)
routes.use("/mentee", menteeRouter)
routes.use("/news", newsletter)
routes.use("/post", postRouter)
routes.use("/pro", programRouter)
routes.use("/quest", questionRouter)
routes.use("/reply", replyRouter)
routes.use("/success", successRouter)
routes.use("/support", supportRouter)
routes.use("/draw", drawingRoutes)
routes.use("/upload", uploadImages); 


export default routes

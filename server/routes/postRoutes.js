import {Router} from "express"
import controllers from "../controller/index.js"

const postRouter = Router()

postRouter
.route("/addPost/:userId")
.post(controllers.addPost)

postRouter
.route("/groupPost/:userId")
.post(controllers.groupPost)

postRouter
.route("/deletePost/:postId")
.post(controllers.deletePost)

postRouter
.route("/updatePost/:postId")
.post(controllers.updatePost)

postRouter
.route("/markPostSeen/:postId")
.post(controllers.markPostSeen)

postRouter
.route("/resetPostSeen/:postId")
.post(controllers.resetPostSeen)

postRouter
.route("/getAllPost")
.get(controllers.getAllPost)

export default postRouter
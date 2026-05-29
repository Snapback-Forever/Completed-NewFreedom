import express from "express";
import controllers from "../controller/index.js";

const successRouter = express.Router();

successRouter
    .route("/addStory/story")
    .post(controllers.addStory);

successRouter
    .route("/updateStory/:id/story")
    .post(controllers.updateStory);

successRouter
    .route("/addAdditionalImages/:id")
    .put(controllers.addAdditionalSuccessImages);

successRouter
    .route("/deleteAdditionalImage/:id")
    .delete(controllers.deleteAdditionalImage);


successRouter
    .route("/deleteStory/:id/story")
    .post(controllers.deleteStory);

successRouter
    .route("/getStoryById/:storyId/story")
    .get(controllers.getStoryById);

successRouter
    .route("/getAllStories/story")
    .get(controllers.getAllStories);



export default successRouter;
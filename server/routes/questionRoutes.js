import express from "express";
import controllers from "../controller/index.js"


const questionRoutes = express.Router()

questionRoutes
    .route("/addQuestion/question")
    .post(controllers.addQuestion);

questionRoutes
    .route("/getAllQuestions/question")
    .get(controllers.getAllQuestions);

questionRoutes
    .route("/toggleRespondingStatus/:id/:userId/question")
    .post(controllers.toggleRespondingStatus);

questionRoutes
    .route("/updateQuestion/:id/question")
    .post(controllers.updateQuestion);

questionRoutes
    .route("/updateResponse/:id/:responseId/question")
    .post(controllers.updateResponse);

questionRoutes
    .route("/deleteQuestion/:id/question")
    .post(controllers.deleteQuestion);

questionRoutes
    .route("/updateQuestionSeen/:id/question")
    .post(controllers.updateQuestionSeen);

questionRoutes
    .route("/updateQuestionStatus/:id/question")
    .post(controllers.updateQuestionStatus);

questionRoutes
    .route("/forwardQuestionToDirectMsg/:id/question")
    .post(controllers.forwardQuestionToDirectMsg);

questionRoutes
    .route("/searchQuestions")
    .get(controllers.searchQuestions);



export default questionRoutes
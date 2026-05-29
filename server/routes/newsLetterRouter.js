import express from "express";
import controllers from "../controller/index.js";

const newsLetterRouter = express.Router();
 
// ✅
newsLetterRouter
    .route("/addNewsLetter/news")
    .post(controllers.addNewsLetter);

// ✅
newsLetterRouter
    .route("/updateNewsLetter/:id/news")
    .post(controllers.updateNewsLetter);

newsLetterRouter
    .route("/addAdditionalNewsImages/:id/news")
    .post(controllers.addAdditionalNewsImages)
    ;
    
newsLetterRouter
    .route("/deleteAdditionalImage/:id/news")
    .post(controllers.deleteAdditionalNewsImage);

 // ✅   
newsLetterRouter
    .route("/deleteNewsLetter/:id/news")
    .post(controllers.deleteNewsLetter);

// ✅  
newsLetterRouter
    .route("/addReview/:id/news")
    .post(controllers.addReview);

// ✅
newsLetterRouter
    .route("/updateReview/:id/:reviewId/news")
    .post(controllers.updateReview);

// ✅
newsLetterRouter
    .route("/deleteReview/:id/:reviewId/news")
    .post(controllers.deleteReview);

// ✅
newsLetterRouter
    .route("/updateNewsLetterStatus/:id/news")
    .post(controllers.updateNewsLetterStatus);

// ✅
newsLetterRouter
    .route("/getSingleNewsLetter/:id/news")
    .get(controllers.getSingleNewsLetter);

// ✅
newsLetterRouter
    .route("/getAllNewsLetters/news")
    .get(controllers.getAllNewsLetters);

// ✅
newsLetterRouter
    .route("/subscribeNewsLetter/subscribe")
    .post(controllers.subscribeNewsLetter);

// ✅
newsLetterRouter
    .route("/updateSubscription/:id/subscribe")
    .post(controllers.updateSubscription);

// ✅
newsLetterRouter
    .route("/deleteSubscription/:id/subscribe")
    .post(controllers.deleteSubscription);

// ✅
newsLetterRouter
    .route("/updateNewsletterStatus/:id/subscribe")
    .post(controllers.updateNewsletterStatus);

// ✅
newsLetterRouter
    .route("/getAllSubscriptions/subscribe")
    .get(controllers.getAllSubscriptions);

// ✅  email,  number,  state, firstName, lastName, phoneNumber, facilityName
newsLetterRouter
    .route("/searchSubscribers/subscribe")
    .get(controllers.searchSubscribers);


export default newsLetterRouter
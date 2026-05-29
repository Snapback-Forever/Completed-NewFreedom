import express from "express";
import controllers from "../controller/index.js";

const jobAppRouter = express.Router();

// ✅
jobAppRouter
    .route("/addJobListing/job")
    .post(controllers.addJobListing);

// ✅
jobAppRouter
    .route("/getAllJobListings/job")
    .get(controllers.getAllJobListings);

// ✅
jobAppRouter
    .route("/updateJobListing/:jobListingId/job")
    .post(controllers.updateJobListing);

// ✅
jobAppRouter
    .route("/deleteJobListingAndApplications/:jobId/job")
    .post(controllers.deleteJobListingAndApplications);

// ✅
jobAppRouter
    .route("/addJobApplicationToJob/:jobId/job")
    .post(controllers.addJobApplicationToJob);

// ✅   
jobAppRouter
    .route("/addReviewerToJobApplication/:jobAppId/job")
    .post(controllers.addReviewerToJobApplication);

// ✅ 
jobAppRouter
    .route("/updateJobApplicationStatus/:jobAppId/job")
    .post(controllers.updateJobApplicationStatus);

// ✅ 
jobAppRouter
    .route("/deleteJobApplicationsByJob/:jobAppId/job")
    .post(controllers.deleteJobApplicationsByJob);

// ✅ 
jobAppRouter
    .route("/getAllJobApplicationsToJob/:jobId/job")
    .get(controllers.getAllJobApplicationsToJob);

// ✅
jobAppRouter
    .route("/addInterviewToJobApplication/:jobAppId/job")
    .post(controllers.addInterviewToJobApplication);

// ✅
jobAppRouter
    .route("/updateInterviewToJobApplication/:jobAppId/:interviewId/job")
    .post(controllers.updateInterviewToJobApplication);

// ✅
jobAppRouter
    .route("/getAllInterviews")
    .get(controllers.getAllInterviews);

jobAppRouter
    .route("/getSingleJobListing/:id/job")
    .get(controllers.getSingleJobListing);

jobAppRouter
    .route("/getSingleJobApplicationsToJob/:jobId/:applicationId")
    .get(controllers.getSingleJobApplicationsToJob);

jobAppRouter
    .route("/getSingleInterview/interview/:jobAppId/:interviewId")
    .get(controllers.getSingleInterview);

    jobAppRouter
  .route("/toggleJobApplicationSeenStatus/:applicationId")
  .post(controllers.toggleJobApplicationSeenStatus);

  jobAppRouter
  .route("/searchJob")
  .get(controllers.searchJobs);



export default jobAppRouter;
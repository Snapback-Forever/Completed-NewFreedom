
import applyNFControllers from "./ApplyNFControllers.js"
import adminLandingControllers from "./adminLandingControllers.js"
import authController from "./authController.js"
import ConversationController from "./conversationController.js"
import directMsgControllers from "./directMsg.js"
import drawingControllers from "./drawingControllers.js"
import eventController from "./eventControllers.js"
import jobApplicationController from "./jobApplicationControllers.js"
import menteeController from "./menteeControllers.js"
import newsLetterController from "./newsLetterControllers.js"
import postControllers from "./postControllers.js"
import ProgramController from "./programsControllers.js"
import questionController from "./questionController.js"
import replyController from "./replyControllers.js"
import successController from "./successStoriesControllers.js"
import supporterController from "./supporterControllers.js"


const controllers = {

    // Admin Landing controllers
    addAdminLanding: adminLandingControllers.addAdminLanding,
    getUpdateLanding: adminLandingControllers.getUpdateLanding,
    addAdminAdditionalImage: adminLandingControllers.addAdminAdditionalImage,
    // ✅ 
    removeAdminAdditionalImage: adminLandingControllers.removeAdminAdditionalImage,

    // APPLY NF CONTROLLERS
    addApplication: applyNFControllers.addApplication,
    updateApplication: applyNFControllers.updateApplication,
    deleteApplication: applyNFControllers.deleteApplication,
    addApplicationReview: applyNFControllers.addApplicationReview,
    addApplicationInterview: applyNFControllers.addApplicationInterview,
    updateApplicationStatus: applyNFControllers.updateApplicationStatus,
    addWorkEthicNote: applyNFControllers.addWorkEthicNote,
    addWorkDoneEntry: applyNFControllers.addWorkDoneEntry,
    updateWorkEthicNote: applyNFControllers.updateWorkEthicNote,
    updateWorkDoneEntry: applyNFControllers.updateWorkDoneEntry,
    deleteWorkDoneEntry: applyNFControllers.deleteWorkDoneEntry,
    getAllApplications: applyNFControllers.getAllApplications,

    // AUTH CONTROLLERS
    registerUser: authController.registerUser,
    loginUser: authController.loginUser,
    changePassword: authController.changePassword,
    adminChangePassword: authController.adminChangePassword,
    getUserById: authController.getUserById,
    adminGetAllUsers: authController.adminGetAllUsers,
    getAllUsers: authController.getAllUsers,
    deleteUser: authController.deleteUser,
    updateProfile: authController.updateProfile,
    adminUpdateProfile: authController.adminUpdateProfile,
    addAllowedEmail: authController.addAllowedEmail,
    removeAllowedEmail: authController.removeAllowedEmail,
    addNotAllowedEmail: authController.addNotAllowedEmail,
    removeNotAllowedEmail: authController.removeNotAllowedEmail,
    getAllAllowedEmails: authController.getAllAllowedEmails,
    getAllNotAllowedEmails: authController.getAllNotAllowedEmails,
    getAllAuditLogs: authController.getAllAuditLogs,
    deleteAuditLog: authController.deleteAuditLog,
    setAdminNFStatus: authController.setAdminNFStatus,
    setSecurityAccessLevels: authController.setSecurityAccessLevels,
    toggleCreatorFlag: authController.toggleCreatorFlag,
    searchUserList: authController.searchUserList,

    selfServiceChangePassword: authController.selfServiceChangePassword,
    updateMessageStatus: authController.updateMessageStatus,
    getAllForgotPasswords: authController.getAllForgotPasswords,
    deleteForgotPassword: authController.deleteForgotPassword,
    getSingleForgotPassword: authController.getSingleForgotPassword,
  

    // conversation controllers
    conversationDelete: ConversationController.conversationDelete,
    getAllConvo: ConversationController.getAllConvo,
    getSingleConvo: ConversationController.getSingleConvo,

    // DirectMsg controllers
    addDirectMsg: directMsgControllers.addDirectMsg,
    updateDirectMsg: directMsgControllers.updateDirectMsg,
    updateDirectMsgResponse: directMsgControllers.updateDirectMsgResponse,
    forwardDirectMsg: directMsgControllers.forwardDirectMsg,
    deleteDirectMsg: directMsgControllers.deleteDirectMsg,
    getAllDirectMsgAdmin: directMsgControllers.getAllDirectMsgAdmin,
    
    // drawing controllers
    addDrawing: drawingControllers.addDrawing,
    getAllDrawings: drawingControllers.getAllDrawings,
    updateDrawing: drawingControllers.updateDrawing,
    deleteDrawing: drawingControllers.deleteDrawing,
    

    // Event Controllers
    addEvent: eventController.addEvent,
    updateEvent: eventController.updateEvent,
    updateEventStatus: eventController.updateEventStatus,
    addAdditionalEventImages: eventController.addAdditionalEventImages,
    deleteAdditionalEventImage: eventController.deleteAdditionalEventImage,
    addEventToLocation: eventController.addEventToLocation,
    removeEventFromLocation: eventController.removeEventFromLocation,
    addOrUpdateAttendee: eventController.addOrUpdateAttendee,
    updateAttendeeStatus: eventController.updateAttendeeStatus,
    removeAttendee: eventController.removeAttendee,
    getEventById: eventController.getEventById,
    getAllEvents: eventController.getAllEvents,
    deleteEvent: eventController.deleteEvent,

    // job application Controllers
    addJobListing: jobApplicationController.addJobListing,
    getSingleJobListing: jobApplicationController.getSingleJobListing,
    getAllJobListings: jobApplicationController.getAllJobListings,
    updateJobListing: jobApplicationController.updateJobListing,
    deleteJobListingAndApplications: jobApplicationController.deleteJobListingAndApplications,

    // job application controllers
    addJobApplicationToJob: jobApplicationController.addJobApplicationToJob,
    deleteJobApplicationsByJob: jobApplicationController.deleteJobApplicationsByJob,
    addReviewerToJobApplication: jobApplicationController.addReviewerToJobApplication,
    updateJobApplicationStatus: jobApplicationController.updateJobApplicationStatus,
    deleteJobApplicationsByJob: jobApplicationController.deleteJobApplicationsByJob,
    getSingleJobApplicationsToJob: jobApplicationController.getSingleJobApplicationsToJob,
    getAllJobApplicationsToJob: jobApplicationController.getAllJobApplicationsToJob,
    addInterviewToJobApplication: jobApplicationController.addInterviewToJobApplication,
    updateInterviewToJobApplication: jobApplicationController.updateInterviewToJobApplication,
    getAllInterviews: jobApplicationController.getAllInterviews,
    getSingleInterview: jobApplicationController.getSingleInterview,
    toggleJobApplicationSeenStatus: jobApplicationController.toggleJobApplicationSeenStatus,
    searchJobs: jobApplicationController.searchJobs,

    // Mentee Controllers (MAIL USERS)
    addMailUser: menteeController.addMailUser,
    addMentorAttached: menteeController.addMentorAttached,
    removeMentor: menteeController.removeMentor,
    addInmateNumber: menteeController.addInmateNumber,
    addPastCharges: menteeController.addPastCharges,
    removeInmateNumber: menteeController.removeInmateNumber,
    searchMailList: menteeController.searchMailList,
    removePastCharges: menteeController.removePastCharges,
    addPendingCharges: menteeController.addPendingCharges,
    removePendingCharges: menteeController.removePendingCharges,
    addReceivedMsg: menteeController.addReceivedMsg,
    updateReceivedMsg: menteeController.updateReceivedMsg,
    getSingleReceivedMsg: menteeController.getSingleReceivedMsg,
    deleteReceivedMsg: menteeController.deleteReceivedMsg,
    updatePaperwork: menteeController.updatePaperwork,
    deletePaperwork: menteeController.deletePaperwork,
    updateApprovedAcceptance: menteeController.updateApprovedAcceptance,
    updateStatus: menteeController.updateStatus,
    updateProgramStatus: menteeController.updateProgramStatus,
    getAllMailEntries: menteeController.getAllMailEntries,
    updateMailEntry: menteeController.updateMailEntry,
    reduceMailUser: menteeController.reduceMailUser,
    deleteMailEntry: menteeController.deleteMailEntry,


    // News letter controller
    addNewsLetter: newsLetterController.addNewsLetter,
    updateNewsLetter: newsLetterController.updateNewsLetter,
    addAdditionalNewsImages: newsLetterController.addAdditionalNewsImages,
    // ✅ 
    deleteAdditionalNewsImage: newsLetterController.deleteAdditionalNewsImage,
    deleteNewsLetter: newsLetterController.deleteNewsLetter,
    addReview: newsLetterController.addReview,
    updateReview: newsLetterController.updateReview,
    deleteReview: newsLetterController.deleteReview,
    updateNewsLetterStatus: newsLetterController.updateNewsLetterStatus,
    getSingleNewsLetter: newsLetterController.getSingleNewsLetter,
    getAllNewsLetters: newsLetterController.getAllNewsLetters,

    // subscriber controllers
    subscribeNewsLetter: newsLetterController.subscribeNewsLetter,
    updateSubscription: newsLetterController.updateSubscription,
    deleteSubscription: newsLetterController.deleteSubscription,
    updateNewsletterStatus: newsLetterController.updateNewsletterStatus,
    getAllSubscriptions: newsLetterController.getAllSubscriptions,
    searchSubscribers: newsLetterController.searchSubscribers,

    // post controllers
    addPost: postControllers.addPost,
    groupPost: postControllers.groupPost,
    deletePost: postControllers.deletePost,
    updatePost: postControllers.updatePost,
    markPostSeen: postControllers.markPostSeen,
    resetPostSeen: postControllers.resetPostSeen,
    getUserPosts: postControllers.getUserPosts,
    getAllPost: postControllers.getAllPost,

    // Location Controllers
    addLocation: ProgramController.addLocation,
    updateLocation: ProgramController.updateLocation,
    addAdditionalImages: ProgramController.addAdditionalImages,
        // ✅ 
    removeAdditionalImages: ProgramController.removeAdditionalImages,
    addLocationStaff: ProgramController.addLocationStaff,
    removeLocationStaff: ProgramController.removeLocationStaff,
    addLocationMentees: ProgramController.addLocationMentees,
    removeLocationMentee: ProgramController.removeLocationMentee,
    attachProgramToLocation: ProgramController.attachProgramToLocation,
    removeLocationFromProgram: ProgramController.removeLocationFromProgram,
    deleteLocation: ProgramController.deleteLocation,
    getProgramById: ProgramController.getProgramById,
    getAllPrograms: ProgramController.getAllPrograms,
    getAllLocations: ProgramController.getAllLocations,
    getLocationById: ProgramController.getLocationById,
    
    // ProgramController 
    addProgram: ProgramController.addProgram,
    addStudentToProgram: ProgramController.addStudentToProgram,
    removeStudentFromProgram: ProgramController.removeStudentFromProgram,
    addGraduate: ProgramController.addGraduate,
    removeGraduate: ProgramController.removeGraduate,
    updateGraduate: ProgramController.updateGraduate,
    updateProgram: ProgramController.updateProgram,
    addProgramImage: ProgramController.addProgramImage,
    deleteProgramImage: ProgramController.deleteProgramImage,
    deleteProgram: ProgramController.deleteProgram,
    addTeacherToProgram: ProgramController.addTeacherToProgram,
    removeTeacherFromProgram: ProgramController.removeTeacherFromProgram,
    getAllTeachers: ProgramController.getAllTeachers,
    getAllStudents: ProgramController.getAllStudents,
    getAllGraduates: ProgramController.getAllGraduates,
    addAdditionalImagesPro: ProgramController.addAdditionalImagesPro,
    removeAdditionalImages: ProgramController.removeAdditionalImages,

    // Question Controllers
    addQuestion: questionController.addQuestion,
    getAllQuestions: questionController.getAllQuestions,
    toggleRespondingStatus: questionController.toggleRespondingStatus,
    updateQuestion: questionController.updateQuestion,
    updateResponse: questionController.updateResponse,
    deleteQuestion: questionController.deleteQuestion,
    updateQuestionSeen: questionController.updateQuestionSeen,
    updateQuestionStatus: questionController.updateQuestionStatus,
    forwardQuestionToDirectMsg: questionController.forwardQuestionToDirectMsg,
    searchQuestions: questionController.searchQuestions,

    // REPLY Controllers
    addReply: replyController.addReply,
    getSingleReply: replyController.getSingleReply,
    getAllReplys: replyController.getAllReplys,
    deleteReply: replyController.deleteReply,

    // Success Controllers
    addStory: successController.addStory,
    updateStory: successController.updateStory,
    addAdditionalSuccessImages: successController.addAdditionalSuccessImages,
     // ✅ 
    deleteAdditionalImage: successController.deleteAdditionalImage,
    toggleConsent: successController.toggleConsent,
    deleteStory: successController.deleteStory,
    getStoryById: successController.getStoryById,
    getAllStories: successController.getAllStories,

    // Support Controllers
    addSupporter: supporterController.addSupporter,
    deleteSocial: supporterController.deleteSocial,
    updateSupporter: supporterController.updateSupporter,
    deleteSupporter: supporterController.deleteSupporter,
    addAddress: supporterController.addAddress,
    addSocial: supporterController.addSocial,
    updateSocial: supporterController.updateSocial,
    updateSupporterTier: supporterController.updateSupporterTier,
    getAllSupporters: supporterController.getAllSupporters,



}

export default controllers
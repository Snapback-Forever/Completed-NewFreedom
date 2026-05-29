// db/index.js
import connect from "./connect.js";
import User from "./models/user.js";
import MessagingModel from "./models/messagingModel.js";
import ConversationModel from "./models/conversationModel.js";
import Post from "./models/Post.js";
import Replies from "./models/Reply.js";
import Allowed from "./models/allowedRegisterModel.js";
import News from "./models/newsletter.js";
import AuditLog from "./models/auditLogModel.js"
import Question from "./models/adminQuestions.js";
import Forgot from "./models/forgotPasswordModel.js";
import Location from "./models/locationModel.js";
import Mail from "./models/mailingList.js";
import Program from "./models/currentPrograms.js";
import JobApp from "./models/applicationJob.js"
import Drawing from "./models/drawingSchema.js"
import JobList from "./models/jobListing.js"
import Event from "./models/eventModel.js"
import Success from "./models/successStories.js"
import Support from "./models/supportPartner.js"
import Subscribe from "./models/subscribeNews.js"
import AppNF from "./models/volunteerNFApplication.js"
import DirectMsg from "./models/directMessage.js"
import Admin from "./models/adminLandingModels.js"
import ForgotPassword from "./models/forgotPasswordModel.js";



export default {
    connect,
    Admin,
    Question,
    Allowed,
    JobApp,
    AuditLog,
    ConversationModel,
    Program,
    DirectMsg,
    Drawing,
    Event,
    Forgot,
    JobList,
    Location,
    Mail,
    MessagingModel,
    News,
    Post,
    Replies,
    Subscribe,
    Success,
    Support,
    User,
    AppNF,
    ForgotPassword
}
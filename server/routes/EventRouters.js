import express from "express";
import controllers from "../controller/index.js";

const eventRouter = express.Router();

// ✅
eventRouter
.route("/addEvent/event")
.post(controllers.addEvent);

eventRouter
.route("/updateEvent/:id/event")
.post(controllers.updateEvent)

// ✅
eventRouter
.route("/updateEventStatus/:eventId/event")
.post(controllers.updateEventStatus);

// ✅
eventRouter
.route("/addEventToLocation/event")
.post(controllers.addEventToLocation);

// ✅
eventRouter
.route("/removeEventFromLocation/event")
.post(controllers.removeEventFromLocation);

// ✅
eventRouter
.route("/addOrUpdateAttendee/:eventId/event")
.post(controllers.addOrUpdateAttendee);

// ✅
eventRouter
.route("/updateAttendeeStatus/:eventId/event")
.post(controllers.updateAttendeeStatus);

// ✅
eventRouter
.route("/removeAttendee/:eventId/event")
.post(controllers.removeAttendee);

// ✅
eventRouter
.route("/addAdditionalEventImages/:id/event")
.post(controllers.addAdditionalEventImages);

// ✅
eventRouter
.route("/deleteAdditionalEventImage/:id/event")
.post(controllers.deleteAdditionalEventImage);

// ✅
eventRouter
.route("/getEventById/:id/event")
.get(controllers.getEventById);

// ✅
eventRouter
.route("/getAllEvents/event")
.get(controllers.getAllEvents);

// ✅
eventRouter
.route("/deleteEvent/:eventId/event")
.post(controllers.deleteEvent);

export default eventRouter;
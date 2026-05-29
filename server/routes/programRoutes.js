import express from "express"; 
import controllers from "../controller/index.js";

const programRouter = express.Router()
// ✅
programRouter
.route("/addLocation/location")
.post(controllers.addLocation);

// ✅
programRouter
.route("/updateLocation/:id/location")
.post(controllers.updateLocation);

programRouter
.route("/addAdditionalImages/:id/location")
.post(controllers.addAdditionalImages);

programRouter
.route("/removeAdditionalImages/:id/location")
.post(controllers.removeAdditionalImages);

// ✅ 
programRouter
.route("/addLocationStaff/:locationId/location")
.post(controllers.addLocationStaff);

// ✅ 
programRouter
.route("/removeLocationStaff/:locationId/location")
.post(controllers.removeLocationStaff);

// ✅
programRouter
.route("/addLocationMentees/:locationId/location")
.post(controllers.addLocationMentees);

// ✅ 
programRouter
.route("/removeLocationMentee/:locationId/location")
.post(controllers.removeLocationMentee);


// PROGRAM LOCATION
// ✅ 
programRouter
.route("/addProgram/program")
.post(controllers.addProgram);

// ✅ 
programRouter
.route("/attachProgramToLocation/:locationId/:programId/location")
.post(controllers.attachProgramToLocation);

// ✅
programRouter
.route("/removeLocationFromProgram/:locationId/:programId/location")
.post(controllers.removeLocationFromProgram);

// ✅
programRouter
.route("/getProgramById/:programId/program")
.get(controllers.getProgramById);

// ✅
programRouter
.route("/getAllPrograms/program")
.get(controllers.getAllPrograms);

// ✅
programRouter
.route("/getLocationById/:id/location")
.get(controllers.getLocationById)

// ✅
programRouter
.route("/getAllLocations/location")
.get(controllers.getAllLocations)

// ✅
programRouter
.route("/addStudentToProgram/:programId/:mailUser/program")
.post(controllers.addStudentToProgram);

// ✅
programRouter
.route("/removeStudentFromProgram/:programId/:studentId/program")
.post(controllers.removeStudentFromProgram);

// ✅
programRouter
.route("/addGraduate/:programId/:mailId/program")
.post(controllers.addGraduate);

programRouter
.route("/removeGraduate/:programId/:mailId/program")
.post(controllers.removeGraduate);

programRouter
.route("/updateGraduate/:programId/program")
.post(controllers.updateGraduate);

// ✅
programRouter
.route("/updateProgram/:programId/program")
.post(controllers.updateProgram);

programRouter
.route("/addProgramImage/:programId/program")
.post(controllers.addProgramImage);

programRouter
.route("/deleteProgramImage/:programId/program")
.post(controllers.deleteProgramImage);

// ✅
programRouter
.route("/deleteProgram/:programId/program")
.post(controllers.deleteProgram);

// ✅
programRouter
.route("/addTeacherToProgram/:programId/:userId/program")
.post(controllers.addTeacherToProgram);

// ✅
programRouter
.route("/removeTeacherFromProgram/:programId/:userId/program")
.post(controllers.removeTeacherFromProgram);

// ✅
programRouter
.route("/getAllTeachers/:programId/program")
.get(controllers.getAllTeachers);

// ✅
programRouter
.route("/getAllStudents/:programId/program")
.get(controllers.getAllStudents);

// ✅
programRouter
.route("/getAllGraduates/program")
.get(controllers.getAllGraduates);

programRouter
  .route("/addAdditionalImages/:id/program")
  .post(controllers.addAdditionalImagesPro);

programRouter
  .route("/removeAdditionalImages/:id/program")
  .post(controllers.removeAdditionalImages);

// ✅
programRouter
.route("/deleteLocation/:locationId/location")
.post(controllers.deleteLocation);


export default programRouter;

import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({

    adminQuestionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },

    action: {
        type: String,
        
    },

    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  
    },

    performedByFirstName: {
        type: String,
        
    },

    performedByLastName: {
        type: String,
        
    },

    affectedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  
    },

    affectedUserAccountName: {
        type: String 
    },

    userMakingLog: {
        type: String,
    },

      auditLogStatus: {
        type: String,
    },

      aboutAuditLog: {
        type: String,
    },

    details: {
        type: String // Extra info such as newAccountName, newLocation, additional notes, etc.
    },

    adminQuestionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },

      

}, {
    timestamps: true
});

export default mongoose.model("AuditLog", auditLogSchema);
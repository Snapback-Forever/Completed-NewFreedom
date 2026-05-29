import mongoose from "mongoose";

const volunteerNFApplication = new mongoose.Schema(
    {

      // Who reviewed the application (review history)
      reviewedBy: [{

          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },

          name: {
            type: String,
            trim: true,
          }, // optional denormalized name

          role: {
            type: String,
            trim: true,
          }, // e.g. "recruiter", "hiring_manager"

          comment: {
            type: String,
            trim: true,
          }, // short review note

          createdAt: {
            type: Date,
            default: Date.now,
          },

        }],

      // Overall application status (canonical state)
      status: {
        type: String,
        enum: ["submitted", "in_review", "interview_scheduled", "rejected", "hired"],
        default: "submitted",
        index: true,
      },

      firstName: {
        type: String,
        required: true,
        trim: true,
      },

      lastName: {
        type: String,
        required: true,
        trim: true,
      },

      applyingMentor: {
        type: Boolean,
        default: false,
      },

      applyingVolunteer: {
        type: Boolean,
        default: false,
      },

      startDate: {
        type: Date,
      },

      // Work-ethic notes with nested workDone
      workEthicNotes: [{

          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },

          referringEmployment: {
            type: Boolean,
            default: false,
          },

          workDone: [{

              userWhoMadeJobPlacement: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },

              placement: {
                type: String,
                trim: true,
              },

              // consider Number if you ever need to sum/filter
              hours: {
                type: String,
                trim: true,
              },

              goodJobConducted: {
                type: Boolean,
                default: false,
              },

              commentAboutJob: {
                type: String,
                trim: true,
              },

            }],
        },
      ],

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: /.+\@.+\..+/, // simple email validation
      },

      phone: {
        type: String,
        trim: true,
        // match: /^\+?[0-9\- ]{7,20}$/,
      },

      resumeUrl: {
        type: String,
        trim: true,
      },

      coverLetter: {
        type: String,
        trim: true,
      },

      fullOrPart: {
        type: String,
        enum: ["fullTime", "partTime", "asNeeded", "courtOrder"],
        default: "asNeeded",
      },

      // Embedded interviews for this application
      interviews: [{

          // when the interview is scheduled
          scheduledAt: {
            type: Date,
            required: true,
          },

          // who is conducting the interview
          interviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },

          // where the interview is held (human readable)
          location: {
            type: String, // e.g. "HQ – Room 201" or "Zoom: <link>"
            required: true,
            trim: true,
          },

          // optional: link back to a Location document
          locationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Location",
          },

          // type of interview
          type: {
            type: String,
            enum: ["phone", "video", "onsite"],
            default: "onsite",
          },

          // notes about this interview
          notes: {
            type: String,
            trim: true,
          },

          // status per interview
          applicationStatus: {
            type: String,
            enum: ["scheduled", "completed", "canceled", "no_show"],
            default: "scheduled",
          },
          
          createdAt: {
            type: Date,
            default: Date.now,
          },

        }],
    },
    
    {
      timestamps: true, // adds createdAt / updatedAt for the application itself
    }
  );

  export default mongoose.model("AppNF", volunteerNFApplication);
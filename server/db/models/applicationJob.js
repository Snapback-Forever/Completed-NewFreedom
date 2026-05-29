
import mongoose from "mongoose"

const jobApplicationSchema = new mongoose.Schema(
  
    {
        jobId: {
             type: mongoose.Schema.Types.ObjectId,
            ref: "JobList",   // <-- this needs to match your job listing model name
            required: true,
            index: true,
          },

      // Who reviewed the application (review history)
      reviewedBy: [
        {
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

        },
      ],

      // Overall application status (canonical state)
      status: {
        type: String,
        enum: ["submitted", "in_review", "interview scheduled", "rejected", "hired"],
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
        // optionally add a regex here
        // match: /^\+?[0-9\- ]{7,20}$/
      },

      resumeUrl: {
        type: String,
        trim: true,
      },

      resumeFileId: { 
        type: mongoose.Schema.Types.ObjectId, 
        default: null 
      },

      resumeBucketName: { 
        type: String, 
        default: null 
      }, // 'images' or 'other'

      coverLetter: {
        type: String,
        trim: true,
      },

      // Parsed resume details (optional, structured)
      resume: {
        summary: {
          type: String,
          trim: true,
        },

        skills: [String],
        experience: [
          {
            company: {
              type: String,
              trim: true,
            },

            title: {
              type: String,
              trim: true,
            },

            startDate: Date,

            endDate: Date,

            description: {
              type: String,
              trim: true,
            },

          },
        ],

        education: [
          {
            school: {
              type: String,
              trim: true,
            },

            degree: {
              type: String,
              trim: true,
            },

            field: {
              type: String,
              trim: true,
            },

            startDate: Date,
            endDate: Date,

          },
        ],
      },

      // Embedded interviews for this application
      interviews: [
        {
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
          status: {
            type: String,
            enum: ["scheduled", "completed", "canceled", "no_show"],
            default: "scheduled",
          },

          createdAt: {
            type: Date,
            default: Date.now,
          },
          
        },
      ],

      seenByAuthor: {
        type: Boolean,
        default: false,
      },

      seenAt: {
        type: Date,
        default: null,
      },
      

    },
    {
      timestamps: true, // adds createdAt / updatedAt on the application itself
    }
  );


export default mongoose.model("JobApp", jobApplicationSchema);



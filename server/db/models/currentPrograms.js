
import mongoose from "mongoose";

const programSchema = new mongoose.Schema({

      location: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location"
      }],

      // Users who are teachers for this program
      teachers: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        }],

      // Users who completed this program
      graduates: [{ 

          mailUser: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Mail" 
          },

          firstName: {
            type: String
          },

          lastName: {
            type: String
          },

          inmateNumbers: [
            {
              number: {
                type: String,
                trim: true,
                set: v =>
                  typeof v === 'string'
                    ? v.replace(/\s+/g, '') // remove *all* whitespace
                    : v,
              },
              state: {
                type: String,
                trim: true,
              },
            },
          ],

          gradImage: {
            type: String
          },

          gradImageFileId: { 
            type: mongoose.Schema.Types.ObjectId, 
            default: null 
          },
      
          gradImageBucketName: { 
            type: String, 
            default: null 
          },

          gradDate: {
            type: String
          }
          
        }],

        programType: {
          type: String,
          enum: ["vocational", "reg-Program"],
          default: "reg-Program",
      },

        additionalImages: [{
          link: {
            type: String
          },
      
          imageFileId: { 
            type: mongoose.Schema.Types.ObjectId, 
            default: null 
          },
      
          imageBucketName: { 
            type: String, 
            default: null 
          },
          
          description: {
            type: String
          }
        }],

        programName: {
          type: String,
          required: true,
        },

        programNameNormalized: {
          type: String,
          unique: true, // enforce uniqueness on normalized name
        },

      descriptionOfProgram: {
        type: String
      },

      descriptionOfProgramVideo: {
        type: String
      },

      lengthOfProgram: {
        type: String,
        set: v => { 
          if (v == null) return v; // allow null/undefined
          const digits = String(v).match(/\d+/g);
          return digits ? digits.join("") : ""; // "90 days" -> "90", "3 months" -> "3"
        },
      },

      maxCapacity: {
        type: Number,
        min: 0,
        required: true,
      },

      currentCapacity: {
        type: Number,
        min: 0,
        default: function () {
          // initial default (before any students)
          return this.maxCapacity;
        },
      },
      
      students: [{
        mailUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Mail',
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
      }],

      openToPublic: {
        type: Boolean
      }

    },
    {
      timestamps: true,
    }
  );

  programSchema.path('students').validate(function (students) {
    if (this.maxCapacity == null) return true;
    return students.length <= this.maxCapacity;
  }, 'Number of students exceeds maxCapacity');

  // Keep currentCapacity = maxCapacity - students.length
  programSchema.pre('save', function (next) {
    const studentCount = this.students ? this.students.length : 0;
    if (this.maxCapacity != null) {
      this.currentCapacity = this.maxCapacity - studentCount;
      if (this.currentCapacity < 0) {
        return next(new Error('currentCapacity cannot be negative'));
      }
    }
    next();
  });

  export default mongoose.model("Program", programSchema);
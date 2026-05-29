
import mongoose from "mongoose"

const jobListingSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      applicationsAttached: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "JobApp",
        }],

      title: {
        type: String,
        required: true,
        trim: true,
      }, 

      location: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        required: true,
      },

      requirements: {
        type: [String],
        default: [],
      },

      responsibilities: {
        type: [String],
        default: [],
      },

      jobType: {
        type: String,
        enum: ["full-time", "part-time", "contract", "volunteer", "temporary"],
        required: true,
      },

      seniority: {
        type: String,
        enum: ["junior", "mid", "senior", "lead"],
        default: "junior",
      },

      salaryMin: String,

      salaryMax: String,

      salaryCurrency: {
        type: String,
        default: "USD",
      },

      isActive: {
        type: Boolean,
        default: true,
        index: true,
      },
      
    },
    {
      timestamps: true,
    }
  );


  export default mongoose.model("JobList", jobListingSchema);


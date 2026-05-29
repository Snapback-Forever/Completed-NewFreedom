import mongoose from "mongoose";


const locationSchema = new mongoose.Schema(
  {
    locationImage: {
      type: String,
    },

    locImageFileId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },

    locImageBucketName: {
      type: String,
      default: null
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

    locationName: {
      type: String,
    },

    aboutLocation: {
      type: String,
    },

    aboutLocationVideo: {
      type: String,
    },

    locationPhoneNumber: {
      type: String,
    },

    mailingAddress: {
      street: {
        type: String
      },

      city: {
        type: String
      },

      state: {
        type: String
      },

      zipCode: {
        type: String
      }
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
        // start with full capacity
        return this.maxCapacity;
      },
    },

    locationMentee: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mail",
      },
    ],

    programs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
      },
    ],

    upcomingEvent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],

    locationStaff: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    facilitySex: {
      type: String,
      enum: ["men", "women", "coed"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 1) Validate that locationMentee.length does not exceed maxCapacity
locationSchema.path('locationMentee').validate(function (mentees) {
  if (this.maxCapacity == null) return true;
  return mentees.length <= this.maxCapacity;
}, 'Number of mentees exceeds maxCapacity');
// 2) Keep currentCapacity = maxCapacity - locationMentee.length
locationSchema.pre('save', function (next) {
  const menteeCount = this.locationMentee ? this.locationMentee.length : 0;
  if (this.maxCapacity != null) {
    this.currentCapacity = this.maxCapacity - menteeCount;
    if (this.currentCapacity < 0) {
      return next(new Error('currentCapacity cannot be negative'));
    }
  }
  next();
});


export default mongoose.model("Location", locationSchema);
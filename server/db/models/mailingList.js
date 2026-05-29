import mongoose from "mongoose"


const mailingList = new mongoose.Schema({
 
  livingLocation: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  }],

  successStory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SuccessStory" // or whatever model
  },

  menteeImage: {
    type: String,
  },
  
  menteeImageFileId:  { 
    type: mongoose.Schema.Types.ObjectId, 
    default: null 
  },

  menteeImageBucketName:  { 
    type: String, 
    default: null 
  },

  // Current mentor assigned
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  successStory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Success",
  },

  // History of mentor assignments
  mentorAttached: [
    { 
      mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      assignedAt: { type: Date, default: Date.now },
      unassignedAt: { type: Date },
      reason: { type: String },
      active: { type: Boolean, default: true }, // NEW
    },
  ],

  // In Mail
  programsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
    },
  ],

  programsCompleted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program"
    },
  ],

  programLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  },

  inmateNumbers: [
    {
      number: {
        type: String,
        required: true,
        trim: true,
        set: v =>
          typeof v === 'string'
            ? v.replace(/\s+/g, '') // remove *all* whitespace
            : v,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: String,
  },

  currentLocation: {
    type: String,

  },

  sex: {
    type: String,
    enum: ["male", "female"],
  },

  email: {
    type: String,
    lowercase: true,
    trim: true,
  },

  dateOfBirth: {
    type: String,
    required: true,
  },

  projectedReleaseDate: {
    type: String,
  },

  maxReleaseDate: {
    type: String,
  },

  currentCharge: {
    type: String,
  },

  pastCharges: [
    {
      charge: {
        type: String,
        required: true,
      }, // description/name of the past charge

      dateOfCharge: {
        type: Date,
      }, // when the charge was made

      releaseDate: {
        type: Date,
      }, // when they were released for this charge

      disposition: {
        type: String,
      }, // e.g. "completed sentence", "dismissed"

      state: {
        type: String,
    
      },

      city: {
        type: String,
        trim: true,
      },

      notes: {
        type: String,
      }, // optional notes
    },
  ],
  
  pendingCharges: [
    {
      charge: {
        type: String,
        required: true,
      }, // e.g. "Burglary", "Violation of probation"

      dateOfCharge: {
        type: Date,
      }, // when the charge was filed

      courtDate: {
        type: Date,
      }, // upcoming court date, if known

      facility: {
        type: String,
      }, // where they are currently held (if applicable)

      state: {
        type: String,
      },

      city: {
        type: String,
        trim: true,
      },

      notes: {
        type: String,
      }, // any extra context
    },
  ],

  currentInsurance: {
    type: String,
  },

  lastContact: {
    type: String,
  },

  receivedMsgs: [
    {
      msgBody: {
        type: String
      }, // message from mentee or about mentee

      msgResponse: {
        type: String
      }, // mentor or staff response
      // user who created the message (could be mentor, admin, teacher)

      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      // which channel the message came from
      channel: {
        type: String,
        enum: ["mail", "email", "family_outreach", "referral_list", "other"],
      },

      timestamp: { type: Date, default: Date.now },
    },
  ],

  // 3) Paperwork / approval workflow
  //
  // Has required paperwork been completed?
  completedRequiredPaperwork: {
    type: Boolean,
    default: false,
  },

  // List missing paperwork items (if any)
  missingPaperwork: [
    {
      name: {
        type: String
      },         // e.g. "Consent Form", "ID Copy"

      notes: {
        type: String
      },        // any details
    },
  ],

  // If someone approves this mentee for acceptance
  approvedAcceptance: {

    isApproved: {
      type: Boolean,
      default: false,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: {
      type: Date,
    },

    notes: {
      type: String,
    },
  },

  // If the mentee is rejected
  rejectedAcceptance: {
    isRejected: {
      type: Boolean,
      default: false,
    },

    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // user who rejected
    },

    rejectedAt: {
      type: Date,
    },

    reason: {
      type: String,
    },
  },

  // Optional overall status derived from approvals
  status: {
    type: String,
    enum: [
      "new",
      "pending_review",
      "approved",
      "rejected",
      "removedFromProgram",
      "quitProgram",
      "active",
      "inactive",
      "completed",
    ],
    default: "new",
  },

  programStatus: {
    type: String,
    enum: [
      "incarcerated",
      "attendingProgram",
      "Did-Not-Arrive",
      "removedFromProgram",
      "quitProgram",
      "completedProgram",
    ],
  },

  msgSentCount: {
    type: Number,
    default: 0,
  },
},
{
  timestamps: true,
}

);
// Compound unique index on inmateNumbers.number + inmateNumbers.state
mailingList.index(
{ "inmateNumbers.number": 1, "inmateNumbers.state": 1 },
{ unique: true, sparse: true }
);


export default mongoose.model("Mail", mailingList);


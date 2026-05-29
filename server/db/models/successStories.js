
import mongoose from "mongoose"

const successStory = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  mailingUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mail",
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

  inmateNumber: {
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

  firstName: {
    type: String
  },

  lastName: {
    type: String
  },

  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },

  storyText: {
    type: String,
    required: true,
  },

  storyVideo: {
    type: String,
  },

  programName: {
    type: String,
    trim: true,
  },

  graduationDate: {
    type: String,
    trim: true,
  },

  outcomeSummary: {
    type: String, // e.g., “Got a new job as a developer”
    trim: true,
  },

  // Consent and publishing state
  consentToPublish: {
    type: Boolean,
    default: false,
  },

  // Optional: anonymization
  displayName: {
    type: String, // e.g., "Alex R., New York"
    trim: true,
  },

  location: {
   city: {
    type: String
   }, 
   state: {
    type: String
   }
  },

  // Optional: media
  imageUrl: {
    type: String, // link to a photo if you show it on the site
    trim: true,
  },

  imageFileId: { 
    type: mongoose.Schema.Types.ObjectId, 
    default: null 
  },

  imageBucketName: { 
    type: String, 
    default: null 
  },

  // Internal notes (not shown to user)
  internalNotes: {
    type: String,
  },

},
  {
    timestamps: true,
  }
);

successStory.index(
  { "inmateNumbers.number": 1, "inmateNumbers.state": 1 },
  { unique: true, sparse: true })


export default mongoose.model("Success", successStory);



import mongoose from 'mongoose';


const userSchema = new mongoose.Schema(
  {

    conversation: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      default: [],
    }],

    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: [],
      },
    ],

    successStoryAuthor: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Success",
    }],

    workLocation: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    }],

    currentMentee: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mail',
      default: [],
    }],

    programsTeaching: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
      },
    ],

    questionsResponded: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],

    directMsg: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DirectMsg",
        default: [],
      },
    ],

    news: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'News',
      },
    ],

    post: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: [],
      },
    ],

    Reply: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply',
        default: [],
      },
    ],

    upcomingEvent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],

    staffPosition: {
      type: String
    },

    profilePic: {
      type: String,

    },

    profilePicFileId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },

    profilePicBucketName: {
      type: String,
      default: null
    },

    accountName: {
      type: String,
      required: true
    },

    accountNameNormalized: {
      type: String,
      required: true,
      unique: true
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    sex: {
      type: String,
      enum: ['male', 'female'],
    },

    yourAddress: {
      type: String,
      required: true,
    },

    yourPhoneNumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
    },

    dateOfBirth: {
      type: String,
      required: true,
    },

    securityQuestions: [
      {
        question: {
          type: String,
        },
        answer: {
          type: String,
          lowercase: true,
          trim: true,
        },
      },
    ],

    secreteKey: {
      type: String,
    },

    admin: {
      type: Boolean,
      default: false,
    },

    // Main admin
    NFadmin: {
      type: Boolean,
      default: false,
    },

    creator: {
      type: Boolean,
      default: false,
    },

    // ONLY FOR THE WEBSITE CREATOR
    webBoss: {
      type: Boolean,
      default: false,
    },

    // mentors to mentee
    mentor: {
      type: Boolean,
      default: false,
    },

    // teachers
    teacher: {
      type: Boolean,
      default: false,
    },

    // Newsletter staff/ success stories
    newsLetter: {
      type: Boolean,
      default: false,
    },

    // job application/hiring staff
    hiring: {
      type: Boolean,
      default: false,
    },

    // Program director
    programDirector: {
      type: Boolean,
      default: false,
    },

    // responsible for mentee information and placement
    staffCustomerService: {
      type: Boolean,
      default: false,
    },

    // responsible for mentee information and placement
    websiteSupportTeam: {
      type: Boolean,
      default: false,
    },

    // schedule of events
    eventStaff: {
      type: Boolean,
      default: false,
    },

    // dark mode
    darkMode: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    accountDisabled: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

export default mongoose.model('User', userSchema);



import mongoose from "mongoose";


const newFreedomAdmin = new mongoose.Schema({

  mainAdditionalImages: [{
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

  mainContent: {
    type: String,
  },

  mainVideo: {
    type: String,
  },

  mainTitle: {
    type: String,
  },

  subTitle: {
    type: String,
  },

  heroImage: {
    type: String,
  },

  heroImgFileId: { 
    type: mongoose.Schema.Types.ObjectId, 
    default: null 
  },

  heroImgBucketName: {
    type: String,
  },


// why landing page

whyAdditionalImages: [{
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

  whyMainImg: {
    type: String,
  },

  whyImgFileId: { 
    type: mongoose.Schema.Types.ObjectId, 
      default: null 
  },

  whyImgBucketName: {
    type: String,
  },

  whySub: {
    type: String,
  },

  whyContent: {
    type: String,
  },

  whyTitle: {
    type: String,
  },


// approach landing page

approachAdditionalImages: [{
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

  approachMainImg: {
    type: String,
  },

  approachSub: {
    type: String,
  },

  approachImgFileId: { 
    type: mongoose.Schema.Types.ObjectId, 
      default: null 
  },

  approachImgBucketName: {
    type: String,
  },

  approachVideo: {
    type: String,
  },

  approachContent: {
    type: String,
  },

  approachTitle: {
    type: String,
  },


  // inpatient landing page

  inpatientAdditionalImages: [{
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

  inpatientMainImg: {
    type: String,
  }, 

  impatientImgFileId: { 
    type: mongoose.Schema.Types.ObjectId, 
      default: null 
  },
 
  impatientImgBucketName: {
    type: String,
  },

  InpatientSub: {
    type: String,
  },

  InpatientVideo: {
    type: String,
  },

  InpatientContent: {
    type: String,
  },

  InpatientTitle: {
    type: String,
  },


  // outreach landing page
  outreachAdditionalImages: [{
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

  outreachMainImg: {
    type: String,
  },

  outReachImgFileId: { 
    type: mongoose.Schema.Types.ObjectId, 
      default: null 
  },

  outReachImgBucketName: {
    type: String,
  },

  outReachSub: {
    type: String,
  },

  outReachVideo: {
    type: String,
  },

  outReachContent: {
    type: String,
  },

  outReachTitle: {
    type: String,
  },


  // mentorship page
  mentorAdditionalImages: [{
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
  mentorMainImg: {
    type: String,
  },

  mentorImgFileId: { 
    type: mongoose.Schema.Types.ObjectId, 
      default: null 
  },

  mentorImgBucketName: {
    type: String,
  },

  mentorSub: {
    type: String,
  },

  mentorVideo: {
    type: String,
  },

  mentorContent: {
    type: String,
  },

  mentorTitle: {
    type: String,
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

},
  {
    timestamps: true,
  }

);

export default mongoose.model("Admin", newFreedomAdmin);


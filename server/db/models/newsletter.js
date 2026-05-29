
import mongoose from "mongoose" 

const newsLetterSchema = new mongoose.Schema(
    {
      // who authored / owns the post
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
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

      reviewedBy: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },

          reviewStatus: {
            type: String,
            enum: ["approved", "denied", "needs editing"],
            default: "needs editing",
          },

          reviewSuggestion: {
            type: String,
            trim: true,
          },  
          
          reviewedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],

      postTitle: {
        type: String,
        required: true,
        trim: true,
      },

      postBody: {
        type: String,
        required: true,
      },
    
      periodStart: { 
        type: Date
     },

      periodEnd: { 
        type: Date
     },

     StoriesThisNews: {
      type: String
     },

      // optional: publishing controls
      status: {
        type: String,
        enum: ["draft", "reviewed", "published", "rejected"],
        default: "draft",
      },

      isFeatured: {
        type: Boolean,
        default: false,
      },

    },
    {
      timestamps: true,
    }
  );

  export default mongoose.model("News", newsLetterSchema);


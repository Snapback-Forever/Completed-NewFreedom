
import mongoose from "mongoose"

const drawingSchema = new mongoose.Schema(
    {
      imageLink: {
        type: String,
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

      mailingList: {
         type: mongoose.Schema.Types.ObjectId,
        ref: "Mail",
      },

      uploadedBy: {
         type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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

      notes: {
        type: String,
      },

    },
    {
      timestamps: true,
    }
  );

  export default mongoose.model("Drawing", drawingSchema);



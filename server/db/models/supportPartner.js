import mongoose from "mongoose";

const supportPartnerSchema = new mongoose.Schema(
    {


        // Display / identity
        name: {
            type: String,
            required: true,
            trim: true,
        },

        logoUrl: {
            type: String, // URL to logo image
            trim: true,
        },

        logoFileId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
          },
      
          logoBucketName: {
            type: String,
            default: null
          },

        shortDescription: {
            type: String,
            trim: true,
            maxlength: 500,
        },

        // Contact info
        address: [{
            street: { 
                type: String, 
                trim: true 
            },
            city: { 
                type: String, 
                trim: true 
            },
            state: { 
                type: String, 
                trim: true 
            },
            zip: { 
                type: String, 
                trim: true 
            },
            country: { 
                type: String, 
                trim: true 
            },
        }],

        phoneNumber: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
        },

        contactName: {
            type: String
        },

        websiteLink: [{
            type: String,
            trim: true,
        }],

        // Extra links (optional)
        social: [{
            socialName: {
                type: String,
                enum: ["faceBook", "linkedIn", "instagram", "x", "other"],
                default: "supporter",
            },
            socialLogo: String,
            socialFileId: {
                type: mongoose.Schema.Types.ObjectId,
                default: null
              },
          
              socialBucketName: {
                type: String,
                default: null
              },
            socialLink: String,
            socialTitle: String
        }],

        // How you show them on your site
        tier: {
            type: String,
            enum: ["platinum", "gold", "silver", "bronze", "supporter"],
            default: "supporter",
        },

    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Support", supportPartnerSchema);
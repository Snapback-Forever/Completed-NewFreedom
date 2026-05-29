import mongoose from "mongoose"

const eventSchema = new mongoose.Schema(
    {

        upcomingEvent: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Location",
            },
          ],

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

        title: {
            type: String,
            required: true,
            trim: true,
        },

        titleChecked: {
            type: String,
            unique: true,
            index: true,
          },

        description: {
            type: String,
            trim: true,
        },

        // When the event happens
        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
        },

        // Capacity fields
        maxCapacity: {
            type: Number,
            required: true,
            min: 1,
        },

        capacityRemaining: {
            type: Number,
            min: 0,
            default: function () {
              return this.maxCapacity;
            },
          },

        // Where the event happens (one location)
        location: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Location",
        },

        // Who created/owns this event
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // People attending (main mentee + guests)
        attendees: [
            {
                menteeComing: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Mail",
                },

                userComing: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },

                firstName: {
                    type: String,
                    trim: true,
                },

                lastName: {
                    type: String,
                    trim: true,
                },

                email: {
                    type: String,
                    trim: true,
                },

                // Number of additional people this mentee is bringing
                bringingAlong: {
                    type: Number,
                    min: 0,
                    default: 0,
                  },

                statusOnAttendence: {
                    type: String,
                    enum: ["requested", "approved", "denied"],
                    default: "requested",
                },

                bringingAlongEmails: [{
                        type: String,
                        trim: true,
                    }],
            },
        ],

        // (Optional) simple status tracking
        status: {
            type: String,
            enum: ["draft", "published", "cancelled"],
            default: "draft",
        },

        // (Optional) quick denormalized fields for faster reads
        locationName: String,

    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Event", eventSchema);

import mongoose from "mongoose"



const subscribeNewsController = new mongoose.Schema(
  {

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    newsLetterRequested: {
      type: String,
      enum: ["emailed", "mail"],
      default: "emailed",
    },

    inmateNumbers: [
      {
        number: {
          type: String,
          trim: true,
          set: v =>
            typeof v === "string"
              ? v.replace(/\s+/g, "") // remove *all* whitespace
              : v,
        },

        state: {
          type: String,
          trim: true,
        },

      },
    ],

    firstName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    phoneNumber: {
      type: String,
    },

    address: [
      {
        facilityName: {
          type: String,
        },

        street: {
          type: String,
        },

        city: {
          type: String,
        },

        state: {
          type: String,
        },

        zipCode: {
          type: String,
          trim: true,
          validate: {
            validator: function (v) {
              if (!v) return true; // allow empty if not required
              return /^\d{5}(?:-\d{4})?$/.test(v);
            },
            message:
              "Please provide a valid US ZIP code (e.g. 12345 or 12345-6789).",
          },
        },

      },
    ],

    // Subscription status
    status: {
      type: String,
      enum: ["subscribed", "unsubscribed", "subscriptionPaused"],
      default: "subscribed",
    },

    // Auto-expiration when unsubscribed ONLY can be set by updating status "unsubscribed"
    expiredDate: {
      type: Date,
      default: null,
    },

    lastNewsLetterSentAt: {
      type: Date,
      default: null,
    },

    unsubscribedAt: {
      type: Date,
    },

  },
  {
    timestamps: true,
  }
);

// Compound unique index on inmateNumbers.number + inmateNumbers.state
subscribeNewsController.index(
  { "inmateNumbers.number": 1, "inmateNumbers.state": 1 },
  { unique: true, sparse: true }
);
// TTL index: delete when expiredDate is reached
subscribeNewsController.index({ expiredDate: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Subscribe", subscribeNewsController);


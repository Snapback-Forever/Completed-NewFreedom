import mongoose from "mongoose"

const forgotPasswordSchema = new mongoose.Schema({

  reportAttempt: {
    type: String
  },

  reportType: {
    type: String,
    enum: ["attempt", "completed"],
  },

    email: { 
        type: String, 
        required: true 
      },

      accountName: {
        type: String
      },

      firstName: {
        type: String,
      },

      lastName: {
        type: String,
      },

      securityQuestions: [
        {
            question: { 
                type: String, 
                required: true 
            },
            
            answer: { 
                type: String, 
                required: true,
                lowercase: true, 
                trim: true 
            }
        }
    ],

    dateOfBirth: {
      type: String,
      required: true,
  },

  messageToAdmin: [
    {
      field: String,
      status: String, // 'correct' or 'incorrect'
      provided: String,
      expected: String // Only for incorrect
    }
  ],

  messageStatus: {
    type: String,
    enum: ["send-email", "sent-Email", "received-Response", "completed-Password-Change"],
    default: "send-email"
  },

  adminName: {
    type: String
  },

  emailDate: {
    type: String
  }

    }, {
      timestamps: true
    });


export default mongoose.model('ForgotPassword', forgotPasswordSchema)


import axios from "axios";
import { questionReducers } from "../creator.js";
import { toast } from "react-hot-toast";

const questBaseURL = "http://127.0.0.1:8080/quest"

const initialState = {
  question: {},
  searchQuest: [],
  allQuestions: [],
  successMessage: "",
  errorMessage: ""
};

const questionSlice = questionReducers({
  name: "question",
  initialState,


  reducers: (create) => ({

    resetSuccessMessage: (state, action) => {
      state.successMessage = ""
    },

    resetErrorMessage: (state, action) => {
      state.errorMessage = ""
    },

    makeQuestion: create.asyncThunk(
      async (form, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/quest/addQuestion/question`,
            form
          );
          // Use success message from controller if present
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          // Use error message from controller if present
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.question = Object.assign(state.question, action.payload);
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    getAllQuestions: create.asyncThunk(
      async (_, thunkApi) => {
        try {
          const res = await axios.get(
            "http://localhost:8080/quest/getAllQuestions/question"
          );
          return res.data;
        } catch (error) {
          // Use error message from controller if present
          const message = error.response?.data?.message;
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          const payload = action.payload;
        
          state.allQuestions = Array.isArray(payload) ? payload : [];
          state.successMessage = payload?.message || "";
          state.errorMessage = "";
        },        
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    toggleRespondingStatus: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/quest/toggleRespondingStatus/${payload?.id}/${payload?.userId}/question`
          );
          // Controller returns { message, question }
          return res.data;
        } catch (error) {
          const message =
            error.response?.data?.message || "Something went wrong.";
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          const updatedQuestion = action.payload?.question;
          // Update single question entry
          state.question = updatedQuestion;
          // Also update it inside the list, so all cards see it
          if (updatedQuestion && Array.isArray(state.allQuestions)) {
            state.allQuestions = state.allQuestions.map((q) =>
              q._id === updatedQuestion._id ? updatedQuestion : q
            );
          }
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        },
      }
    ),

    updateQuestion: create.asyncThunk(
      async (payload, thunkApi) => {
        // console.log("payload", payload)
        try {
          const res = await axios.post(
            `http://localhost:8080/quest/updateQuestion/${payload.id}/question`,
            payload
          );
          // Use success message from controller if present
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          // Use error message from controller if present
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          // Assuming controller returns the updated question
          state.question = Object.assign(state.question, action.payload);
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    updateResponse: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/quest/updateResponse/${payload.id}/${payload.responseId}/question`,
            payload
          );
          // Use success message from controller if present
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          // Use error message from controller if present
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          // Assuming controller returns the updated question or response data
          state.question = Object.assign(state.question, action.payload);
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    deleteQuestion: create.asyncThunk(
      async (id, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/quest/deleteQuestion/${id}/question`,
          );
          // Use success message from controller if present
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          // Use error message from controller if present
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          // Adjust this depending on what your controller returns:
          // Option A: controller returns { allQuestions: [...], message: '...' }
          state.allQuestions = action.payload?.allQuestions;
          // Option B (if controller returns the updated array directly):
          // state.allQuestions = action.payload;
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    updateQuestionSeen: create.asyncThunk(
      async (updateQuestionSeenData, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/quest/updateQuestionSeen/${updateQuestionSeenData.id}/question`,
            updateQuestionSeenData
          );
          // Use success message from controller if present
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          // Use error message from controller if present
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          // Assuming controller returns the updated question
          state.question = Object.assign(state.question, action.payload);
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    updateQuestionStatus: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/quest/updateQuestionStatus/${payload.id}/question`,
            payload
          );
          // Use success message from controller if present
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          // Use error message from controller if present
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          // Assuming controller returns the updated question
          state.question = Object.assign(state.question, action.payload);
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    forwardQuestionToDirectMsg: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          // payload should contain at least: { id, recipientUserId, ... }
          const res = await axios.post(
            `http://localhost:8080/quest/forwardQuestionToDirectMsg/${payload.id}/question`,
            payload
          );
          const message = res.data?.message;
          if (message) {
            toast.success(message);
          }
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message || "Forwarding failed.";
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          // Controller returns: { message, directMsg }
          // You can store the new direct message, or just the message
          state.directMsg = action.payload?.directMsg;
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        },
      }
    ),

    searchQuestions: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          // payload should contain at least: { q }
          const res = await axios.get(
            `http://localhost:8080/quest/searchQuestions?q=${encodeURIComponent(payload.q)}`
          );
    
          const message = res.data?.message;
          if (message) {
            toast.success(message);
          }
    
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message || "Question search failed.";
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          // Controller returns: { message, count, results }
          state.searchQuest = action.payload?.results || [];
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        },
      }
    ),
    

  })
})


export const {

  resetSuccessMessage,
  resetErrorMessage,
  makeQuestion,
  getAllQuestions,
  toggleRespondingStatus,
  updateQuestion,
  updateResponse,
  deleteQuestion,
  updateQuestionSeen,
  updateQuestionStatus,
  forwardQuestionToDirectMsg,
  searchQuestions

} = questionSlice.actions

export default questionSlice.reducer
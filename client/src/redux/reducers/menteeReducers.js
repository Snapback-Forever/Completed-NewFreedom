import axios from "axios"
import { createMenteeReducer } from "../creator.js"
import { toast } from "react-hot-toast";


const locationBaseURL = "http://localhost:8080/mentee"


const initialState = {

  mailUser: {},
  mentorAttached: {},
  mentorRemoved: {},
  inmateNumber: {},
  mailUserSearchResults: [],
  pastCharges: {},
  pendingCharges: {},
  receivedMsg: {},
  singleReceivedMsg: {},
  paperwork: {},
  approvedAcceptance: {},
  status: {},
  programStatus: {},

  allMailEntries: [],
  mailEntryDeleted: {},
  successMessage: "",
  errorMessage: ""

};

const menteeReducers = createMenteeReducer({
  name: "mentee",
  initialState,

  reducers: (create) => ({

    resetSuccessMessage: (state, action) => {
      state.successMessage = ""
    },

    resetErrorMessage: (state, action) => {
      state.errorMessage = ""
    },


    addMailUser: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            "http://localhost:8080/mentee/addMailUser/mailUser",
            payload
          );
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.mailUser = Object.assign(state.mailUser || {}, action.payload);
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    updateMailEntry: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/mentee/updateMailEntry/${payload.mailId}/mailUser`,
            payload
          );
    
          toast.success(res.data?.message);
    
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.mailUser = Object.assign(state.mailUser || {}, action.payload);
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),


    addMentorAttached: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          console.log(payload);
          const res = await axios.post(
            `http://localhost:8080/mentee/addMentorAttached/${payload.mailId}/mentor`,
            payload
          );
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.mentorAttached = Object.assign(
            state.mentorAttached || {},
            action.payload
          );
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    removeMentor: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/mentee/removeMentor/${payload.mailId}/mentor`,
            payload
          );
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.mentorRemoved = Object.assign(
            state.mentorRemoved || {},
            action.payload
          );
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    addInmateNumber: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/mentee/addInmateNumber/${payload.mailId}/mailUser`,
            payload
          );
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.inmateNumber = Object.assign(
            state.inmateNumber || {},
            action.payload
          );
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    removeInmateNumber: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/mentee/removeInmateNumber/${payload.mailId}/mailUser`,
            payload
          );
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.inmateNumber = Object.assign(
            state.inmateNumber || {},
            action.payload
          );
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    searchMailUser: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.get(
            "http://localhost:8080/mentee/searchMailUser",
            { params: payload }
          );
          const message =
            res.data?.message ??
            `Found ${res.data?.count ?? 0} mentee(s) matching your search`;
          toast.success(message);
          return res.data;
        } catch (error) {
          const message =
            error.response?.data?.message || "Failed to search mail users";
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.mailUserSearchResults = action.payload; // { count, results, message? }
          state.successMessage =
            action.payload?.message ??
            `Found ${action.payload?.count ?? 0} mentee(s)`;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        },
      }
    ),

    addPastCharges: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/mentee/addPastCharges/${payload.mailId}/mailUser`,
            payload
          );
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.pastCharges = Object.assign(
            state.pastCharges || {},
            action.payload
          );
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    removePastCharges: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/mentee/removePastCharges/${payload.mailId}/mailUser`,
            payload
          );
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.pastCharges = Object.assign(
            state.pastCharges || {},
            action.payload
          );
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    addPendingCharges: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/mentee/addPendingCharges/${payload.mailId}/mailUser`,
            payload
          );
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.pendingCharges = Object.assign(
            state.pendingCharges || {},
            action.payload
          );
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    removePendingCharges: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/mentee/removePendingCharges/${payload.mailId}/mailUser`,
            payload
          );
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.pendingCharges = Object.assign(
            state.pendingCharges || {},
            action.payload
          );
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    addReceivedMsg: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/mentee/addReceivedMsg/${payload.mailId}/mailUser`,
            payload
          );
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.receivedMsg = Object.assign(
            state.receivedMsg || {},
            action.payload
          );
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    updateReceivedMsg: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/mentee/updateReceivedMsg/${payload.mailId}/${payload.msgId}/mailUser`,
            payload
          );
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.receivedMsg = Object.assign(
            state.receivedMsg || {},
            action.payload
          );
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    getSingleReceivedMsg: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/mentee/getSingleReceivedMsg/${payload?.mailId}/${payload?.msgId}/mailUser`,
            {} // body if your route expects one; here it's params only
          );
          return res.data;
        } catch (error) {
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.singleReceivedMsg = Object.assign(state.singleReceivedMsg, action.payload)
          state.successMessage = action.payload?.message;
          state.errorMessage = "";

        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        },
      }
    ),

    deleteReceivedMsg: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/mentee/deleteReceivedMsg/${payload.mailId}/${payload.msgId}/mailUser`,
            payload
          );
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.receivedMsg = Object.assign(
            state.receivedMsg || {},
            action.payload
          );
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    updatePaperwork: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/mentee/updatePaperwork/${payload.mailId}/mailUser`,
            payload
          );
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.paperwork = Object.assign(
            state.paperwork || {},
            action.payload
          );
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    deletePaperwork: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/mentee/deletePaperwork/${payload.mailId}/${payload.paperworkId}/mailUser`,
            payload
          );
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.paperwork = Object.assign(
            state.paperwork || {},
            action.payload
          );
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),


    updateApprovedAcceptance: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/mentee/updateApprovedAcceptance/${payload.mailId}/mailUser`,
            payload
          );
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.approvedAcceptance = Object.assign(
            state.approvedAcceptance || {},
            action.payload
          );
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    updateStatus: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/mentee/updateStatus/${payload.mailId}/mailUser`,
            payload
          );
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.status = Object.assign(
            state.status || {},
            action.payload
          );
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    updateProgramStatus: create.asyncThunk(
      async (payload, thunkApi) => {

        try {
          const res = await axios.post(
            `http://localhost:8080/mentee/updateProgramStatus/${payload.mailId}/mailUser`,
            payload
          );
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.programStatus = Object.assign(
            state.programStatus || {},
            action.payload
          );
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    reduceMailUser: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/mentee/reduceMailUser/${payload.mailId}/${payload.currentUserId}/mailUser`,
            payload
          );
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.mailUser = Object.assign(
            state.mailUser || {},
            action.payload
          );
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    deleteMailEntry: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.post(
            `http://localhost:8080/mentee/deleteMailEntry/${payload.mailId}/mailUser`,
            payload
          );
          const message = res.data?.message;
          toast.success(message);
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message;
          toast.error(message);
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.mailEntryDeleted = Object.assign(
            state.mailEntryDeleted || {},
            action.payload
          );
          state.successMessage = action.payload?.message;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

    getAllMailEntries: create.asyncThunk(
      async (payload, thunkApi) => {
        try {
          const res = await axios.get(
            "http://localhost:8080/mentee/getAllMailEntries/mailUser",
            { params: payload }
          );
          return res.data;
        } catch (error) {
          return thunkApi.rejectWithValue(message);
        }
      },
      {
        fulfilled: (state, action) => {
          state.allMailEntries = Array.isArray(action.payload) ? action.payload : [];
          state.successMessage = action.payload?.message || "";
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.errorMessage = action.payload;
          state.successMessage = "";
        }
      }
    ),

  })

})

export const {

  resetSuccessMessage, resetErrorMessage,
  addMailUser, updateMailEntry,
  addMentorAttached, removeMentor,
  addInmateNumber, removeInmateNumber,
  searchMailUser,
  addPastCharges, removePastCharges,
  addPendingCharges, removePendingCharges,
  addReceivedMsg, updateReceivedMsg, getSingleReceivedMsg, deleteReceivedMsg,
  updatePaperwork, deletePaperwork,
  updateApprovedAcceptance,
  updateStatus,
  updateProgramStatus,
  reduceMailUser, deleteMailEntry,
  getAllMailEntries,

} = menteeReducers.actions

export default menteeReducers.reducer
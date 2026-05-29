import axios from "axios"
import { staffMsgReducer } from "../creator.js"
import { toast } from "react-hot-toast";


const staffMsgBaseURL = "http://127.0.0.1:8080/staffMsg"


const initialState = {
    // Single direct message (for create/update/forward/etc.)
    directMsg: {},
    // List of direct messages (for admin listing, etc.)
    directMsgs: [],
    // Global feedback
    successMessage: "",
    errorMessage: "",
    // Optional loading flags if you want them
    isLoading: false,
  }; 

const directMsgStaffReducers = staffMsgReducer({
    name: "directStaff",
    initialState,

    reducers: (create) => ({

        directMsg: create.asyncThunk(
            async (form, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/staffMsg/addDirectMsg/${form?.userId}/direct`,
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
                state.directMsg = Object.assign(state.directMsg, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          updateDirectMsg: create.asyncThunk(
            async (payload, thunkApi) => {
            
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/staffMsg/updateDirectMsg/${payload.directMsgId}/direct`,
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
                // Adjust this depending on how your API returns the updated message
                state.directMsg = Object.assign(state.directMsg, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          updateDirectMsgResponse: create.asyncThunk(
            async ({ directMsgId, responseId, form }, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/staffMsg/updateDirectMsgResponse/${directMsgId}/${responseId}/direct`,
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
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          forwardDirectMsg: create.asyncThunk(
            async (payload, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/staffMsg/forwardDirectMsg/${payload.directMsgId}/direct`,
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
                // Adjust depending on what forwardDirectMsg returns
                // Example if it returns the updated/forwarded message:
                // state.directMsg = action.payload.directMsg;
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          deleteDirectMsg: create.asyncThunk(
            async (directMsgId, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/staffMsg/deleteDirectMsg/${directMsgId}/direct`,
                
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
                // Tailor this to how your state is structured and what the API returns
                // Example A: if the API returns remaining messages as an array
                // state.directMsgs = action.payload.directMsgs;
                // Example B: if the API only returns a message and you track current item separately
                // state.currentDirectMsg = null;
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          getAllDirectMsgAdmin: create.asyncThunk(
            async (_, thunkApi) => {
              try {
                const res = await axios.get(
                  `http://127.0.0.1:8080/staffMsg/getAllDirectMsgAdmin/direct`
                );
                return res.data;
              } catch (error) {
                const message =
                  error.response?.data?.message || "Failed to load messages";
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                const payload = action.payload;
                state.directMsgs = Array.isArray(payload)
                  ? payload
                  : Array.isArray(payload?.directMsgs)
                  ? payload.directMsgs
                  : [];
                state.successMessage = payload?.message || "";
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.directMsgs = [];
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          resetSuccessMessage: (state, action) => {
            state.successMessage = ""
          },
      
          resetErrorMessage: (state, action) => {
            state.errorMessage = ""
          },

    })

})

export const {

  directMsg,
  updateDirectMsg,
  updateDirectMsgResponse,
  forwardDirectMsg,
  deleteDirectMsg,
  getAllDirectMsgAdmin,
  resetSuccessMessage,
  resetErrorMessage,


} = directMsgStaffReducers.actions

export default directMsgStaffReducers.reducer
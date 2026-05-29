import axios from "axios"
import { createApplyNfReducer } from "../creator.js"
import { toast } from "react-hot-toast";
import { resetErrorMessage } from "./directMsgStaffReducers.js";

const applyNfBaseURL = "http://127.0.0.1:8080/applyNf"


const initialState = {

  application: {},
  applications: [],

  successMessage: "", 
  errorMessage: "",


}


const applyNfReducer = createApplyNfReducer({
    name: "apply",
    initialState,


    reducers: (create) => ({

        addApplication: create.asyncThunk(
            async (state, thunkApi) => {
              try {
                const res = await axios.post(
                  `${applyNfBaseURL}/addApplication/app`,
                  state
                );
                return res.data;
              } catch (error) {
                // Return error message for rejected handler
                return thunkApi.rejectWithValue(
                  error.response?.data?.message ||
                    "Error creating volunteer application"
                );
              }
            },
            {
              fulfilled: (state, action) => {
                // Backend success: 201 with saved application + message
                state.application = action.payload; // or map to specific fields if you prefer
                state.successMessage =
                  action.payload.message ||
                  "Volunteer application created successfully!";
                state.errorMessage = "";
                toast.success(state.successMessage); // success toast
              },
              rejected: (state, action) => {
                // Backend error: 400 validation or 500 server error
                state.errorMessage =
                  action.payload || "Error creating volunteer application";
                toast.error(state.errorMessage); // error toast
              }
            }
          ),

          updateApplication: create.asyncThunk(
            async (state, thunkApi) => {
              try {
                // Assuming the application ID is on state._id or state.id
                const id = state._id || state.id;
                const res = await axios.post(
                  `${applyNfBaseURL}/updateApplication/${id}/app`,
                  state
                );
                return res.data;
              } catch (error) {
                // Return error message for rejected handler
                return thunkApi.rejectWithValue(
                  error.response?.data?.message ||
                    "Error updating volunteer application"
                );
              }
            },
            {
              fulfilled: (state, action) => {
                // Backend success: 200 with updated application + message
                // Merge updated fields into state.application (or whatever slice you use)
                state.application = {
                  ...(state.application || {}),
                  ...action.payload,
                };
                state.successMessage =
                  action.payload.message ||
                  "Volunteer application updated successfully!";
                state.errorMessage = "";
                toast.success(state.successMessage); // success toast
              },
              rejected: (state, action) => {
                // Backend error: 404 not found, 400 validation, or 500 server error
                state.errorMessage =
                  action.payload || "Error updating volunteer application";
                toast.error(state.errorMessage); // error toast
              }
            }
          ),

          deleteApplication: create.asyncThunk(
            async (state, thunkApi) => {
              try {
                // Assuming the application ID is on state._id or state.id
                const id = state._id || state.id;
                const res = await axios.post(
                  `${applyNfBaseURL}/deleteApplication/${id}/app`,
                  state
                );
                return res.data;
              } catch (error) {
                // Return error message for rejected handler
                return thunkApi.rejectWithValue(
                  error.response?.data?.message ||
                    "Error deleting volunteer application"
                );
              }
            },
            {
              fulfilled: (state, action) => {
                // Backend success: 200 with deleted application + message
                state.successMessage =
                  action.payload.message ||
                  "Volunteer application deleted successfully!";
                state.errorMessage = "";
                // Optionally, remove from a list if you keep one:
                // state.applications = state.applications.filter(
                //   (app) => app._id !== (action.payload._id || action.payload.id)
                // );
                toast.success(state.successMessage); // success toast
              },
              rejected: (state, action) => {
                // Backend error: 404 not found or 500 server error
                state.errorMessage =
                  action.payload || "Error deleting volunteer application";
                toast.error(state.errorMessage); // error toast
              }
            }
          ),

          addApplicationReview: create.asyncThunk(
            async (state, thunkApi) => {
              try {
                // Assuming the application ID is on state._id or state.id
                const id = state._id || state.id;
                const res = await axios.post(
                  `${applyNfBaseURL}/addApplicationReview/${id}/app`,
                  state
                );
                return res.data;
              } catch (error) {
                // Return error message for rejected handler
                return thunkApi.rejectWithValue(
                  error.response?.data?.message ||
                    "Error adding review to application"
                );
              }
            },
            {
              fulfilled: (state, action) => {
                // Backend success: 200 with updated application + message
                state.application = {
                  ...(state.application || {}),
                  ...action.payload,
                };
                state.successMessage =
                  action.payload.message ||
                  "Review added and application updated successfully!";
                state.errorMessage = "";
                toast.success(state.successMessage); // success toast
              },
              rejected: (state, action) => {
                // Backend error: 404 not found, 400 validation, or 500 server error
                state.errorMessage =
                  action.payload || "Error adding review to application";
                toast.error(state.errorMessage); // error toast
              }
            }
          ),

          addApplicationInterview: create.asyncThunk(
            async (state, thunkApi) => {
              try {
                // Assuming the application ID is on state._id or state.id
                const id = state._id || state.id;
                const res = await axios.post(
                  `${applyNfBaseURL}/addApplicationInterview/${id}/app`,
                  state
                );
                return res.data;
              } catch (error) {
                // Return error message for rejected handler
                return thunkApi.rejectWithValue(
                  error.response?.data?.message ||
                    "Error adding interview to application"
                );
              }
            },
            {
              fulfilled: (state, action) => {
                // Backend success: 200 with updated application + message
                state.application = {
                  ...(state.application || {}),
                  ...action.payload,
                };
                state.successMessage =
                  action.payload.message ||
                  "Interview added and application updated successfully!";
                state.errorMessage = "";
                toast.success(state.successMessage); // success toast
              },
              rejected: (state, action) => {
                // Backend error: 404 not found, 400 validation, or 500 server error
                state.errorMessage =
                  action.payload || "Error adding interview to application";
                toast.error(state.errorMessage); // error toast
              }
            }
          ),

          updateApplicationStatus: create.asyncThunk(
            async (state, thunkApi) => {
              try {
                // Assuming the application ID is on state._id or state.id
                const id = state._id || state.id;
                const res = await axios.post(
                  `${applyNfBaseURL}/updateApplicationStatus/${id}/app`,
                  state
                );
                return res.data;
              } catch (error) {
                // Return error message for rejected handler
                return thunkApi.rejectWithValue(
                  error.response?.data?.message ||
                    "Error updating application status"
                );
              }
            },
            {
              fulfilled: (state, action) => {
                // Backend success: 200 with updated application + message
                state.application = {
                  ...(state.application || {}),
                  ...action.payload,
                };
                state.successMessage =
                  action.payload.message ||
                  "Application status updated successfully!";
                state.errorMessage = "";
                toast.success(state.successMessage); // success toast
              },
              rejected: (state, action) => {
                // Backend error: 404 not found, 400 validation, or 500 server error
                state.errorMessage =
                  action.payload || "Error updating application status";
                toast.error(state.errorMessage); // error toast
              }
            }
          ),

          addWorkEthicNote: create.asyncThunk(
            async (state, thunkApi) => {
              try {
                // Assuming the application ID is on state._id or state.id
                const id = state._id || state.id;
                const res = await axios.post(
                  `${applyNfBaseURL}/addWorkEthicNote/${id}/app`,
                  state
                );
                return res.data;
              } catch (error) {
                // Return error message for rejected handler
                return thunkApi.rejectWithValue(
                  error.response?.data?.message ||
                    "Error adding work ethic note"
                );
              }
            },
            {
              fulfilled: (state, action) => {
                // Backend success: 200 with updated application + message
                state.application = {
                  ...(state.application || {}),
                  ...action.payload,
                };
                state.successMessage =
                  action.payload.message ||
                  "Work ethic note added successfully!";
                state.errorMessage = "";
                toast.success(state.successMessage); // success toast
              },
              rejected: (state, action) => {
                // Backend error: 404 not found, 400 validation, or 500 server error
                state.errorMessage =
                  action.payload || "Error adding work ethic note";
                toast.error(state.errorMessage); // error toast
              }
            }
          ),

          updateWorkEthicNote: create.asyncThunk(
            async (state, thunkApi) => {
              try {
                // Assuming the application ID is on state._id or state.id
                const id = state._id || state.id;
                // Assuming the note ID is on state.noteId (adjust if you use a different key)
                const noteId = state.noteId;
                const res = await axios.post(
                  `${applyNfBaseURL}/updateWorkEthicNote/${id}/app`,
                  {
                    ...state,
                    noteId, // sent in body since the route as written only has :id
                  }
                );
                return res.data;
              } catch (error) {
                // Return error message for rejected handler
                return thunkApi.rejectWithValue(
                  error.response?.data?.message ||
                    "Error updating work ethic note"
                );
              }
            },
            {
              fulfilled: (state, action) => {
                // Backend success: 200 with updated application + message
                state.application = {
                  ...(state.application || {}),
                  ...action.payload,
                };
                state.successMessage =
                  action.payload.message ||
                  "Work ethic note updated successfully!";
                state.errorMessage = "";
                toast.success(state.successMessage); // success toast
              },
              rejected: (state, action) => {
                // Backend error: 404 not found, 400 validation, or 500 server error
                state.errorMessage =
                  action.payload || "Error updating work ethic note";
                toast.error(state.errorMessage); // error toast
              }
            }
          ),

          addWorkDoneEntry: create.asyncThunk(
            async (state, thunkApi) => {
              try {
                // Assuming the application ID is on state._id or state.id
                const id = state._id || state.id;
                // Assuming the work ethic note ID is on state.noteId
                const noteId = state.noteId;
                const res = await axios.post(
                  `${applyNfBaseURL}/addWorkDoneEntry/${id}/${noteId}/app`,
                  state
                );
                return res.data;
              } catch (error) {
                // Return error message for rejected handler
                return thunkApi.rejectWithValue(
                  error.response?.data?.message ||
                    "Error adding work done entry"
                );
              }
            },
            {
              fulfilled: (state, action) => {
                // Backend success: 200 with updated application + message
                state.application = {
                  ...(state.application || {}),
                  ...action.payload,
                };
                state.successMessage =
                  action.payload.message ||
                  "Work done entry added successfully!";
                state.errorMessage = "";
                toast.success(state.successMessage); // success toast
              },
              rejected: (state, action) => {
                // Backend error: 404 not found, 400 validation, or 500 server error
                state.errorMessage =
                  action.payload || "Error adding work done entry";
                toast.error(state.errorMessage); // error toast
              }
            }
          ),


          deleteWorkDoneEntry: create.asyncThunk(
            async (state, thunkApi) => {
              try {
                // Assuming IDs are stored on state
                const id = state._id || state.id;        // application id
                const noteId = state.noteId;            // work ethic note id
                const workDoneId = state.workDoneId;    // workDone entry id
                const res = await axios.post(
                  `${applyNfBaseURL}/deleteWorkDoneEntry/${id}/${noteId}/${workDoneId}/app`,
                  state
                );
                return res.data;
              } catch (error) {
                // Return error message for rejected handler
                return thunkApi.rejectWithValue(
                  error.response?.data?.message ||
                    "Error deleting work done entry"
                );
              }
            },
            {
              fulfilled: (state, action) => {
                // Backend success: 200 with updated application + message
                state.application = {
                  ...(state.application || {}),
                  ...action.payload,
                };
                state.successMessage =
                  action.payload.message ||
                  "Work done entry deleted successfully!";
                state.errorMessage = "";
                toast.success(state.successMessage); // success toast
              },
              rejected: (state, action) => {
                // Backend error: 404 not found or 500 server error
                state.errorMessage =
                  action.payload || "Error deleting work done entry";
                toast.error(state.errorMessage); // error toast
              }
            }
          ),
 
          getAllApplications: create.asyncThunk(
            async (_form, thunkApi) => {
              try {
                const res = await axios.get(
                  "http://127.0.0.1:8080/applyNf/getAllApplications/app"
                  // adjust base path `/apply` to match how you mounted applyRouter
                );
            
                return res.data;
              } catch (error) {
                const message =
                  error.response?.data?.message || "Failed to load applications";
             
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                const payload = action.payload;
                state.applications = Array.isArray(payload)
                  ? payload
                  : Array.isArray(payload?.applications)
                  ? payload.applications
                  : [];
                state.successMessage = payload?.message || "";
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

  addApplication,
  updateApplication,
  deleteApplication,
  addApplicationReview,
  addApplicationInterview,
  updateApplicationStatus,
  addWorkEthicNote,
  updateWorkEthicNote,
  addWorkDoneEntry,
  deleteWorkDoneEntry,
  getAllApplications,

} = applyNfReducer.actions

export default applyNfReducer.reducer
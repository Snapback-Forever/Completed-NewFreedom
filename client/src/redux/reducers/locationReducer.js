import axios from "axios"
import { createLocationReducer } from "../creator.js"
import { toast } from "react-hot-toast";


const locationBaseURL = "http://127.0.0.1:8080/pro"


const initialState = {
  question: {},
  location: {},
  program: {},

  singleProgram: [],
  allPrograms: [],
  allLocations: [],
  singleLocation: [],
  programTeachers: [],
  programStudents: [],
  allGraduates: [],
  
  successMessage: "",
  errorMessage: ""
};

const locationReducer = createLocationReducer({
    name: "location",
    initialState,

    reducers: (create) => ({

        makeLocation: create.asyncThunk(
            async (form, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/addLocation/location`,
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
                state.location = Object.assign(state.location, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          updateLocation: create.asyncThunk(
            async (form, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/updateLocation/${form.id}/location`,
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
                state.location = Object.assign(state.location, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            } 
          ),

          addAdditionalImages: create.asyncThunk(
            async (payload, thunkApi) => {

              try {
                console.log("payload ME",payload)
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/addAdditionalImages/${payload.id}/location`,
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
                state.location = Object.assign(state.location, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          removeAdditionalImages: create.asyncThunk(
            async (payload, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/removeAdditionalImages/${payload.id}/location`,
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
                state.location = Object.assign(state.location, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = ""; 
              }
            }
          ),

          addLocationStaff: create.asyncThunk(
            async (form, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/addLocationStaff/${form.locationId}/location`,
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
                state.location = Object.assign(state.location, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          removeLocationStaff: create.asyncThunk(
            async (form, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/removeLocationStaff/${form.locationId}/location`,
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
                state.location = Object.assign(state.location, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          addLocationMentees: create.asyncThunk(
            async (payload, thunkApi) => {
              console.log("payload", payload)
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/addLocationMentees/${payload.locationId}/location`,
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
                state.location = Object.assign(state.location, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          removeLocationMentee: create.asyncThunk(
            async (form, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/removeLocationMentee/${form.locationId}/location`,
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
                state.location = Object.assign(state.location, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          makeProgram: create.asyncThunk(
            async (payload, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/addProgram/program`,
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
                state.program = action.payload;
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          attachProgramToLocation: create.asyncThunk(
            async (form, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/attachProgramToLocation/${form.locationId}/${form.programId}/location`,
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
                state.location = Object.assign(state.location, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          removeLocationFromProgram: create.asyncThunk(
            async (payload, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/removeLocationFromProgram/${payload.locationId}/${payload.programId}/location`,
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
                state.location = Object.assign(state.location, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          getProgramById: create.asyncThunk(
            async (programId, thunkApi) => {
              try {
                const res = await axios.get(
                  `http://127.0.0.1:8080/pro/getProgramById/${programId}/program`
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
                state.singleProgram = action.payload; // or adjust based on your API response shape
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          getAllPrograms: create.asyncThunk(
            async (_, thunkApi) => {
              try {
                const res = await axios.get(
                  `http://127.0.0.1:8080/pro/getAllPrograms/program`
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
                state.allPrograms = Array.isArray(action.payload) ? action.payload : [];
                state.successMessage = action.payload?.message || "";
                state.errorMessage = "";
              },              
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          getLocationById: create.asyncThunk(
            async (id, thunkApi) => {
              try {
                const res = await axios.get(
                  `http://127.0.0.1:8080/pro/getLocationById/${id}/location`
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
                state.singleLocation = action.payload; // adjust to match your API response
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),
          
          getAllLocations: create.asyncThunk(
            async (_, thunkApi) => {
              try {
                const res = await axios.get(
                  `http://127.0.0.1:8080/pro/getAllLocations/location`
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
                state.allLocations = Array.isArray(payload?.locations)
                  ? payload.locations
                  : Array.isArray(payload)
                  ? payload
                  : [];
                state.successMessage = payload?.message || "";
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            } 
          ),

          addStudentToProgram: create.asyncThunk(
            async (payload, thunkApi) => {
              // console.log("payload",payload);
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/addStudentToProgram/${payload.programId}/${payload.mailUser}/program`,
                  payload
                );
                // Use success message from controller if present
                const message = res.data?.message || "Mentee Added To Program!"
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
                state.program = Object.assign(state.program, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          removeStudentFromProgram: create.asyncThunk(
            async (payload, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/removeStudentFromProgram/${payload.programId}/${payload.studentId}/program`,
                  {
                    currentUserId: payload.currentUserId, // ✅ NOW USED BY BACKEND
                  }
                );
          
                const message =
                  res.data?.message || "Student removed from program!";
          
                toast.success(message);
          
                return res.data;
              } catch (error) {
                const message =
                  error.response?.data?.message || "Error removing student";
          
                toast.error(message);
          
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                state.program = {
                  ...state.program,
                  ...action.payload,
                };
          
                state.successMessage = "Student removed successfully";
                state.errorMessage = "";
              },
          
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              },
            }
          ),

          addGraduate: create.asyncThunk(
            async (payload, thunkApi) => {
              console.log("payload",payload)
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/addGraduate/${payload.programId}/${payload.mailId}/program`,
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
                state.program = Object.assign(state.program, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          updateGraduate: create.asyncThunk(
            async (payload, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/updateGraduate/${payload.programId}/program`,
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
                state.program = Object.assign(state.program, action.payload.programUpdate);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          removeGraduate: create.asyncThunk(
            async (payload, thunkApi) => {
              console.log("payload", payload);
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/removeGraduate/${payload.programId}/${payload.mailId}/program`,
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
                state.program = Object.assign(state.program, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          updateProgram: create.asyncThunk(
            async (form, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/updateProgram/${form.programId}/program`,
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
                state.program = Object.assign(state.program, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          addProgramImage: create.asyncThunk(
            async (form, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/addProgramImage/${form.programId}/program`,
                  form
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
                state.program = Object.assign(state.program, action.payload.program);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          deleteProgramImage: create.asyncThunk(
            async (payload, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/deleteProgramImage/${payload.programId}/program`,
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
                state.program = Object.assign(state.program, action.payload.program);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          deleteProgram: create.asyncThunk(
            async (form, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/deleteProgram/${form.programId}/program`,
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
                state.program = Object.assign(state.program, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          addTeacherToProgram: create.asyncThunk(
            async (form, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/addTeacherToProgram/${form.programId}/${form.userId}/program`,
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
                state.program = Object.assign(state.program, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          removeTeacherFromProgram: create.asyncThunk(
            async (form, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/removeTeacherFromProgram/${form.programId}/${form.userId}/program`,
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
                state.program = Object.assign(state.program, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),
          
          getAllTeachers: create.asyncThunk(
            async (form, thunkApi) => {
              // Fallback when no programId is provided
              if (!form?.programId) {
                const message = "programId is required.";
                return thunkApi.rejectWithValue(message);
              }
              try {
                const res = await axios.get(
                  `http://127.0.0.1:8080/pro/getAllTeachers/${form.programId}/program`
                );
                return res.data;
              } catch (error) {
                const message =
                  error.response?.data?.message || "Error getting teachers.";
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                state.programTeachers = action.payload;
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          getAllStudents: create.asyncThunk(
            async (form, thunkApi) => {
              // Fallback when no programId is provided
              if (!form?.programId) {
                const message = "programId is required.";
                return thunkApi.rejectWithValue(message);
              }
              try {
                const res = await axios.get(
                  `http://127.0.0.1:8080/pro/getAllStudents/${form.programId}/program`
                );
                // Use success message from controller if present
                const message = res.data?.message;
       
                return res.data;
              } catch (error) {
                // Use error message from controller if present
                const message =
                  error.response?.data?.message || "Error getting students.";

                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                state.programStudents = action.payload; // adjust key if needed
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          getAllGraduates: create.asyncThunk(
            async (_, thunkApi) => {
              try {
                const res = await axios.get(
                  "http://127.0.0.1:8080/pro/getAllGraduates/program"
                );
                return res.data;
              } catch (error) {
                const message =
                  error.response?.data?.message || "Error getting graduates.";
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                const payload = action.payload;
                state.allGraduates = Array.isArray(payload?.graduates)
                  ? payload.graduates
                  : Array.isArray(payload)
                  ? payload
                  : [];
                state.successMessage = payload?.message || "";
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
                state.allGraduates = [];
              }
            }
          ),

          deleteLocation: create.asyncThunk(
            async (locationId, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/deleteLocation/${locationId}/location`,
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
                state.location = Object.assign(state.location, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          addAdditionalImagesPro: create.asyncThunk(
            async (payload, thunkApi) => {
              try {
                
          
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/addAdditionalImages/${payload.id}/program`,
                  payload
                );
          
                const message = res.data?.message;
                toast.success(message);
                return res.data;
              } catch (error) {
                const message = error.response?.data?.message || "Failed to add additional images";
                toast.error(message);
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                state.program = Object.assign(state.program, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              },
            }
          ),
          
          removeAdditionalImagesPro: create.asyncThunk(
            async (payload, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/pro/removeAdditionalImages/${payload.id}/program`,
                  payload
                );
          
                const message = res.data?.message;
                toast.success(message);
                return res.data;
              } catch (error) {
                const message = error.response?.data?.message || "Failed to remove additional images";
                toast.error(message);
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                state.program = Object.assign(state.program, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              },
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

 makeLocation, 
 updateLocation,
 addAdditionalImages,
 removeAdditionalImages,
 addLocationStaff,
 removeLocationStaff,
 addLocationMentees,
 removeLocationMentee,

 makeProgram,
 attachProgramToLocation,
 removeLocationFromProgram,
 getProgramById,
 getAllPrograms,
 getLocationById,
 getAllLocations,
 addStudentToProgram,
 removeStudentFromProgram,
 addGraduate, 
 updateGraduate,
 removeGraduate,
 updateProgram,
 addProgramImage, deleteProgramImage,
 deleteProgram,
 addTeacherToProgram,
 removeTeacherFromProgram,
 getAllTeachers,
 getAllStudents,
 getAllGraduates,
 deleteLocation,
 addAdditionalImagesPro, removeAdditionalImagesPro,
 resetErrorMessage, resetSuccessMessage


} = locationReducer.actions

export default locationReducer.reducer
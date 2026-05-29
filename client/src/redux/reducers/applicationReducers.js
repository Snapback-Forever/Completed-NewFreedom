import axios from "axios";
import { createApplicationReducers } from "../creator.js";
import { toast } from "react-hot-toast";

const questBaseURL = "http://127.0.0.1:8080/app"

const initialState = {
    jobs: [],
    allJobs: [],
    searchedJobs: [],
  
    jobApplications: [],
    allJobApplications: [],
    singleJobListing: null,
  
    interviews: [],
    allInterviews: [],
  
    successMessage: "",
    errorMessage: ""
  };
  

const applicationReducers = createApplicationReducers({
    name: "app",
    initialState,


    reducers: (create) => ({

        resetSuccessMessage: (state, action) => {
            state.successMessage = ""
          },
      
          resetErrorMessage: (state, action) => {
            state.errorMessage = ""
          },
      

        addJobListing: create.asyncThunk(
            async (nextForm, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/app/addJobListing/job`,
                        nextForm
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
                    
                    state.jobs = state.jobs || [];
                    state.jobs.push(action.payload);
                    state.successMessage = action.payload?.message;
                    state.errorMessage = "";
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = "";
                }
            }
        ),

        getSingleJobListing: create.asyncThunk(
            async (id, thunkApi) => {
              try {
                const res = await axios.get(
                  `http://127.0.0.1:8080/app/getSingleJobListing/${id}/job/`
                );
                const message = res.data?.message;
                if (message) {
                  toast.success(message);
                }
                return res.data;
              } catch (error) {
                const message =
                  error.response?.data?.message || "Error fetching job listing";
                toast.error(message);
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                state.singleJobListing = action.payload;
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              },
            }
          ),
          

        getAllJobListings: create.asyncThunk(
            async (_, thunkApi) => {
                try {
                    const res = await axios.get(
                        `http://127.0.0.1:8080/app/getAllJobListings/job`
                    );
                    return res.data;
                } catch (error) {
                    const message = error.response?.data?.message;
                    
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    state.allJobs = Array.isArray(action.payload) ? action.payload : [];
                    state.successMessage = action.payload?.message || "";
                    state.errorMessage = "";
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = "";
                }
            }
        ),

        updateJobListing: create.asyncThunk(
            async ({ jobListingId, form }, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/app/updateJobListing/${jobListingId}/job`,
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
                    state.jobs = state.jobs || [];
                    const idx = state.jobs.findIndex(
                        (job) => job._id === action.payload?._id
                    );
                    if (idx !== -1) {
                        state.jobs[idx] = action.payload;
                    }
                    state.successMessage = action.payload?.message;
                    state.errorMessage = "";
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = "";
                }
            }
        ),

        deleteJobListingAndApplications: create.asyncThunk(
            async (jobId, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/app/deleteJobListingAndApplications/${jobId}/job`
                    );
                    const message = res.data?.message;
                    toast.success(message);
                    return { ...res.data, jobId };
                } catch (error) {
                    const message = error.response?.data?.message;
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    const { jobId } = action.payload || {};
                    state.jobs = state.jobs || [];
                    if (jobId) {
                        state.jobs = state.jobs.filter((job) => job._id !== jobId);
                    }
                    state.successMessage = action.payload?.message;
                    state.errorMessage = "";
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = "";
                }
            }
        ),

        addJobApplicationToJob: create.asyncThunk(
            async ( payload , thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/app/addJobApplicationToJob/${payload?.jobId}/job`,
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
                    state.jobs = state.jobs || [];
                    const updatedJob = action.payload?.job || action.payload;
                    const idx = state.jobs.findIndex(
                        (job) => job._id === updatedJob?._id
                    );
                    if (idx !== -1) {
                        state.jobs[idx] = updatedJob;
                    }
                    state.successMessage = action.payload.message;
                    state.errorMessage = "";
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = "";
                }
            }
        ),

        addReviewerToJobApplication: create.asyncThunk(
            async (payload, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/app/addReviewerToJobApplication/${payload?.jobAppId}/job`,
                  payload.form
                );
                toast.success(res.data?.message);
                return res.data;
              } catch (error) {
                const message = error.response?.data?.message || "Error adding reviewer";
                toast.error(message);
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                const { message, ...updatedJobApp } = action.payload || {};
          
                if (!state.jobs) state.jobs = [];
          
                const idx = state.jobs.findIndex((job) => job._id === updatedJobApp._id);
                if (idx !== -1) {
                  state.jobs[idx] = updatedJobApp;
                }
          
                state.successMessage = message || "";
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              },
            }
          ),
          

        updateJobApplicationStatus: create.asyncThunk(
            async ({ jobAppId, form }, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/app/updateJobApplicationStatus/${jobAppId}/job`,
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
                    state.jobs = state.jobs || [];
                    const updatedJob = action.payload?.job || action.payload;
                    const idx = state.jobs.findIndex(
                        (job) => job._id === updatedJob?._id
                    );
                    if (idx !== -1) {
                        state.jobs[idx] = updatedJob;
                    }
                    state.successMessage = action.payload?.message;
                    state.errorMessage = "";
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = "";
                }
            }
        ),


        toggleJobApplicationSeenStatus: create.asyncThunk(
            async (applicationId, thunkApi) => {
                console.log("jobID", applicationId)
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/app/toggleJobApplicationSeenStatus/${applicationId}`
                );
                return res.data;
              } catch (error) {
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
          

        deleteJobApplicationsByJob: create.asyncThunk(
            async (jobAppId, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/app/deleteJobApplicationsByJob/${jobAppId}/job`
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
                    state.successMessage = action.payload?.message;
                    state.errorMessage = "";
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = "";
                }
            }
        ),

        getSingleJobApplicationsToJob: create.asyncThunk(
            async ({ jobId, applicationId }, thunkApi) => {
                try {
                    const res = await axios.get(
                        `http://127.0.0.1:8080/app/getSingleJobApplicationsToJob/${jobId}/${applicationId}/job`
                    );
                    const message = res.data?.message;
                    if (message) {
                        toast.success(message);
                    }
                    return res.data;
                } catch (error) {
                    const message = error.response?.data?.message || "Error fetching job application";
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    state.singleJobApplication = action.payload;
                    state.successMessage = action.payload?.message;
                    state.errorMessage = "";
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = "";
                },
            }
        ),

        getAllJobApplicationsToJob: create.asyncThunk(
            async (jobId, thunkApi) => {
                if (!jobId) {
                    const message = "Job ID is required";
                    // Reject so it goes to the rejected case
                    return thunkApi.rejectWithValue(message);
                }
                try {
                    const res = await axios.get(
                        `http://127.0.0.1:8080/app/getAllJobApplicationsToJob/${jobId}/job`
                    );
              
                    return res.data;
                } catch (error) {
                    const message = error.response?.data?.message || "Failed to load applications";
        
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    state.allJobApplications = action.payload;
                    state.successMessage = action.payload?.message;
                    state.errorMessage = "";
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = "";
                }
            }
        ),

        addInterviewToJobApplication: create.asyncThunk(
            async (payload, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/app/addInterviewToJobApplication/${payload?.jobAppId}/job`,
                  payload?.form
                );
                toast.success(res.data?.message);
                return res.data;
              } catch (error) {
                const message = error.response?.data?.message || "Error adding interview";
                toast.error(message);
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                const { message, ...updatedJobApp } = action.payload || {};
                state.jobs = state.jobs || [];
                const idx = state.jobs.findIndex((job) => job._id === updatedJobApp?._id);
                if (idx !== -1) {
                  state.jobs[idx] = updatedJobApp;
                }
                state.successMessage = message || "";
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),
          
          

          updateInterviewToJobApplication: create.asyncThunk(
            async (payload, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/app/updateInterviewToJobApplication/${payload?.jobAppId}/${payload?.interviewId}/job`,
                  payload?.form
                );
          
                toast.success(res.data?.message || "Interview updated successfully!");
                return res.data;
              } catch (error) {
                const message =
                  error.response?.data?.message || "Error updating interview";
          
                toast.error(message);
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              pending: (state) => {
                state.loading = true;
                state.errorMessage = "";
                state.successMessage = "";
              },
              fulfilled: (state, action) => {
                state.loading = false;
          
                const { message, ...updatedJobApp } = action.payload || {};
          
                state.jobs = state.jobs || [];
          
                const idx = state.jobs.findIndex(
                  (job) => job._id === updatedJobApp._id
                );
          
                if (idx !== -1) {
                  state.jobs[idx] = updatedJobApp;
                }
          
                state.successMessage = message || "Interview updated successfully!";
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload || "Error updating interview";
                state.successMessage = "";
              },
            }
          ),
          
          
        getSingleInterview: create.asyncThunk(
            async (payload, thunkApi) => {
                try {
                    const res = await axios.get(
                        `http://127.0.0.1:8080/app/getSingleInterview/interview/${payload?.jobAppId}/${payload?.interviewId}`
                    );
                    const message = res.data?.message;
                    if (message) {
                        toast.success(message);
                    }
                    return res.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || "Error fetching interview";
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    state.singleInterview = action.payload;
                    state.successMessage = action.payload?.message;
                    state.errorMessage = "";
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = "";
                },
            }
        ),

        getAllInterviews: create.asyncThunk(
            async (_, thunkApi) => {
                try {
                    const res = await axios.get(
                        `http://127.0.0.1:8080/app/getAllInterviews`
                    );
        
                    return res.data;
                } catch (error) {
                    const message = error.response?.data?.message;
              
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    const payload = action.payload;
                  
                    state.allInterviews = Array.isArray(payload) ? payload : [];
                    state.successMessage = payload?.message || "";
                    state.errorMessage = "";
                  },                  
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = "";
                }
            }
        ),

        searchJobs: create.asyncThunk(
            async (searchTerm, thunkApi) => {
              try {
                const res = await axios.get(
                  `http://127.0.0.1:8080/app/searchJob`,
                  {
                    params: { q: searchTerm }
                  }
                );
                return res.data;
              } catch (error) {
                const message = error.response?.data?.message || "Search failed";
                toast.error(message);
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                state.searchedJobs = action.payload?.results || [];
                state.successMessage = action.payload?.message || "";
                state.errorMessage = "";
          
                if (!action.payload?.results?.length) {
                  toast(action.payload?.message || "No Job Listings Found", {
                    icon: "ℹ️"
                  });
                } else {
                  toast.success(action.payload?.message || "Search complete");
                }
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
                toast.error(action.payload || "Search failed");
              }
            }
          ),
          
  

    })
})
 

export const {

    resetErrorMessage, resetSuccessMessage,
    addJobListing,
    getSingleJobListing,
    getAllJobListings,
    updateJobListing,
    deleteJobListingAndApplications,
    addJobApplicationToJob,
    addReviewerToJobApplication,
    updateJobApplicationStatus,
    toggleJobApplicationSeenStatus,
    deleteJobApplicationsByJob,
    getSingleJobApplicationsToJob,
    getAllJobApplicationsToJob,
    addInterviewToJobApplication,
    updateInterviewToJobApplication,
    getSingleInterview,
    getAllInterviews,
    searchJobs



} = applicationReducers.actions

export default applicationReducers.reducer
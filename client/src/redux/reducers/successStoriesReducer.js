import axios from "axios"
import { createSuccessStoriesReducers } from "../creator.js"
import { toast } from "react-hot-toast";


const successBaseURL = "http://127.0.0.1:8080/success/"


const initialState = {
    // For makeLocation
    stories: {},

    // For single-supporter operations
    storyById: [],
    allStories: [],

    // For status messages
    successMessage: "",
    errorMessage: ""

  };

const successStoriesReducers = createSuccessStoriesReducers({
    name: "success",
    initialState,

    reducers: (create) => ({

        addStory: create.asyncThunk(
            async (payload, thunkApi) => {
              try {
                const res = await axios.post(
                  "http://127.0.0.1:8080/success/addStory/story",
                  payload
                );
                const message = res.data?.message;
                toast.success(message);
                return res.data; // expect { message, story, ... }
              } catch (error) {
                const message = error.response?.data?.message || "Failed to add story";
                toast.error(message);
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                state.story = action.payload;
                state.successMessage = action.payload?.message || "Story added successfully";
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload || "Failed to add story";
                state.successMessage = "";
              }
            }
          ),

          updateStory: create.asyncThunk(
            async (payload, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/success/updateStory/${payload?.id}/story`,
                  payload
                );
                const message = res.data?.message;
                toast.success(message);
                return res.data; // e.g. { message, story }
              } catch (error) {
                const message = error.response?.data?.message || "Failed to update story";
                toast.error(message);
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                // Ensure state.story (or stories) exists in your initialState
                // If you keep a single story:
                state.story = {
                  ...(state.story || {}),
                  ...(action.payload.story || {})
                };
                state.successMessage = action.payload?.message || "Story updated successfully";
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload || "Failed to update story";
                state.successMessage = "";
              }
            }
          ),

          addAdditionalSuccessImages: create.asyncThunk(
            async ({ id, additionalImages }, thunkApi) => {
              try {
                const res = await axios.put(
                  `http://127.0.0.1:8080/success/addAdditionalImages/${id}`,
                  { additionalImages }
                );
          
                const message = res.data?.message;
                toast.success(message);
          
                return res.data;
              } catch (error) {
                const message =
                  error.response?.data?.message || "Failed to add additional images";
          
                toast.error(message);
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                state.story = action.payload;
                state.successMessage =
                  action.payload?.message || "Additional images added successfully";
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage =
                  action.payload || "Failed to add additional images";
                state.successMessage = "";
              }
            }
          ),          
          
          deleteAdditionalSuccessImage: create.asyncThunk(
            async ({ id, imageFileId, link }, thunkApi) => {
              try {
                const res = await axios.delete(
                  `http://127.0.0.1:8080/success/deleteAdditionalImage/${id}`,
                  {
                    data: { imageFileId, link }
                  }
                );
          
                const message = res.data?.message;
                toast.success(message);
          
                return res.data;
              } catch (error) {
                const message =
                  error.response?.data?.message || "Failed to delete image";
          
                toast.error(message);
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                state.story = action.payload;
                state.successMessage =
                  action.payload?.message || "Image deleted successfully";
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload || "Failed to delete image";
                state.successMessage = "";
              }
            }
          ),
          

          deleteStory: create.asyncThunk(
            async (id, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/success/deleteStory/${id}/story`
                );
                const message = res.data?.message;
                toast.success(message);
                return res.data; // e.g. { message, id } or { message, story }
              } catch (error) {
                const message = error.response?.data?.message || "Failed to delete story";
                toast.error(message);
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                // If you keep an array of stories:
                const deletedId =
                  action.payload.id || action.payload.story?._id;
                if (Array.isArray(state.stories) && deletedId) {
                  state.stories = state.stories.filter(
                    (s) => s._id !== deletedId
                  );
                }
                state.successMessage =
                  action.payload?.message || "Story deleted successfully";
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload || "Failed to delete story";
                state.successMessage = "";
              }
            }
          ),

          getStoryById: create.asyncThunk(
            // First arg is the payload; here it's the story id
            async (storyId, thunkApi) => {
              try {
                const res = await axios.get(
                  `http://127.0.0.1:8080/success/getStoryById/${storyId}/story`
                );
               
                return res.data;
              } catch (error) {
                const message =
                  error.response?.data?.message || "Failed to fetch story";
              
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                state.storyById = action.payload;
                state.successMessage =
                  action.payload?.message || "Story fetched successfully";
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage =
                  action.payload || "Failed to fetch story";
                state.successMessage = "";
              }
            }
          ),

          getAllStories: create.asyncThunk(
            async (_, thunkApi) => {
              try {
          
                const res = await axios.get(
                  "http://127.0.0.1:8080/success/getAllStories/story"
                );
          
                return res.data;
          
              } catch (error) {
          
                const message =
                  error.response?.data?.message || "Failed to fetch stories";
          
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
          
                state.allStories = action.payload.data || [];
          
                state.replyDeleted = false;
          
                state.seeReplys = false;
          
                state.errorMessage = "";
          
              },
          
              rejected: (state, action) => {
          
                state.errorMessage =
                  action.payload || "Failed to fetch stories";
          
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

    addStory,
    updateStory,
    addAdditionalSuccessImages, deleteAdditionalSuccessImage,
    deleteStory,
    getStoryById,
    getAllStories,
    resetErrorMessage, resetSuccessMessage

} = successStoriesReducers.actions

export default successStoriesReducers.reducer
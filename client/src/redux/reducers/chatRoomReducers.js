import axios from "axios";
import { createChatRoomReducer } from "../creator.js";
import { toast } from "react-hot-toast";

const initialState = {

    postRefresh: false,

}

const messagesSlice = createChatRoomReducer({
    name: "chatRoomPost",
    initialState,


    reducers: (create) => ({


        makePost: create.asyncThunk(
            async (form, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://localhost:8080/post/addPost/${form.userId}`,
                  {
                    areaOfPost: form.areaOfPost,
                    postTitle: form.postTitle,
                    postBody: form.postBody,
                  }
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
                // Assuming state.post exists in your initial state
                state.post = Object.assign(state.post, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              },
            }
          ),

        // CREATE GROUP POST
        groupPost: create.asyncThunk(
            async (payload, thunkApi) => {
             
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/post/groupPost/${payload.userId}`,
                  payload
                );
                const message = res.data?.message;
                toast.success(message);
                return res.data; // backend returns the created post spread + message
              } catch (error) {
                const message = error.response?.data?.message;
                toast.error(message);
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                // Assuming state.posts exists in your initial state
                const createdPost = action.payload;
                state.posts = state.posts || [];
                const existingIndex = state.posts.findIndex(
                  (p) => p._id === createdPost._id
                );
                if (existingIndex !== -1) {
                  state.posts[existingIndex] = createdPost;
                } else {
                  state.posts.push(createdPost);
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

          deletePost: create.asyncThunk(
            async (postId, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://localhost:8080/post/deletePost/${postId}`
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
                state.postRefresh = true;
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              },
            }
          ),

          updatePost: create.asyncThunk(
            async ({ postId, data }, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://localhost:8080/post/updatePost/${postId}`,
                  data
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
                // If your backend returns the updated post as `post`
                // (e.g. { post, message }), keep this:
                if (action.payload?.post) {
                  state.post = action.payload.post;
                }
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
                state.postRefresh = false;
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              },
            }
          ),

        // Mark post as seen
        markPostSeen: create.asyncThunk(
            async ({ postId, userId, seen = true }, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/post/markPostSeen/${postId}`,
                        { userId, seen }
                    );
                    const message =
                        res.data?.message || 'Post seen status updated for this user';
                    toast.success(message);
                    return res.data; // expect { post, message }
                } catch (error) {
                    const message =
                        error.response?.data?.message ||
                        'Failed to update seen status for this post';
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    const updatedPost = action.payload?.post;
                    const message =
                        action.payload?.message || 'Post seen status updated for this user';
                    if (updatedPost) {
                        state.posts = state.posts || [];
                        const idx = state.posts.findIndex(p => p._id === updatedPost._id);
                        if (idx !== -1) {
                            state.posts[idx] = updatedPost;
                        } else {
                            state.posts.push(updatedPost);
                        }
                    }
                    state.successMessage = message;
                    state.errorMessage = '';
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = '';
                },
            }
        ),

        // Reset (remove) seen for this user
        resetPostSeen: create.asyncThunk(
            async ({ postId, userId }, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/post/resetPostSeen/${postId}`,
                        { userId }
                    );
                    const message =
                        res.data?.message || 'Seen status reset for this user';
                    toast.success(message);
                    return res.data; // expect { post, message }
                } catch (error) {
                    const message =
                        error.response?.data?.message ||
                        'Failed to reset seen status for this post';
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    const updatedPost = action.payload?.post;
                    const message =
                        action.payload?.message || 'Seen status reset for this user';
                    if (updatedPost) {
                        state.posts = state.posts || [];
                        const idx = state.posts.findIndex(p => p._id === updatedPost._id);
                        if (idx !== -1) {
                            state.posts[idx] = updatedPost;
                        } else {
                            state.posts.push(updatedPost);
                        }
                    }
                    state.successMessage = message;
                    state.errorMessage = '';
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = '';
                },
            }
        ),

        getAllPost: create.asyncThunk(
          async (_, thunkApi) => {
            try {
              const res = await axios.get(`http://localhost:8080/post/getAllPost`);
              return res.data;
            } catch (error) {
              const message = error.response?.data?.message || "Failed to load posts";
              return thunkApi.rejectWithValue(message);
            }
          },
          {
            fulfilled: (state, action) => {
              state.post = Array.isArray(action.payload) ? action.payload : [];
              state.postRefresh = false;
            },
            rejected: (state, action) => {
              state.post = [];
              state.errorMessage = action.payload;
              state.postRefresh = false;
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

    makePost,
    groupPost,
    deletePost,
    updatePost,
    markPostSeen,
    resetPostSeen,
    getAllPost,
    resetErrorMessage, resetSuccessMessage

} = messagesSlice.actions

export default messagesSlice.reducer
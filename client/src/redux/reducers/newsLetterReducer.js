import axios from "axios"
import { createNewsLetterReducers } from "../creator.js"
import { toast } from "react-hot-toast";


const successBaseURL = "http://127.0.0.1:8080/news/"


const initialState = {
    // Single entities
    newsLetter: {},        // for create/update single newsletter
    subscription: {},      // for a single subscription

    // Collections
    newsLetters: [],       // for getAllNewsLetters
    singleNews: [],       
    subscriptions: [],     // for getAllSubscriptions and searchSubscribers

    // Status flags
    isLoading: false,      // if you want, you can toggle this in pending/fulfilled/rejected
    successMessage: "",
    errorMessage: ""
  };

const newsLetterReducers = createNewsLetterReducers({
    name: "news",
    initialState,

    reducers: (create) => ({

        makeNewsLetter: create.asyncThunk(
            async (form, thunkApi) => {
                try {
                    const res = await axios.post(
                        'http://127.0.0.1:8080/news/addNewsLetter/news',
                        form
                    );
                    const message = res.data?.message;
                    toast.success(message);
                    return res.data;
                } catch (error) {
                    const message = error.response?.data?.message || 'Failed to add newsletter';
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    state.newsLetter = action.payload.news;
                    state.successMessage = action.payload?.message || "Newsletter added";
                    state.errorMessage = "";
                  },                  
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = '';
                }
            }
        ),

        updateNewsLetter: create.asyncThunk(
            async (form, thunkApi) => {
                const { id, ...payload } = form;
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/news/updateNewsLetter/${id}/news`,
                        payload
                    );
                    const message = res.data?.message;
                    toast.success(message);
                    return res.data;
                } catch (error) {
                    const message = error.response?.data?.message || 'Failed to update newsletter';
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    state.newsLetter = Object.assign(state.newsLetter || {}, action.payload);
                    state.successMessage = action.payload?.message || 'Newsletter updated';
                    state.errorMessage = '';
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = '';
                }
            }
        ),

        addAdditionalNewsImages: create.asyncThunk(
            async (payload, thunkApi) => {
              
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/news/addAdditionalNewsImages/${payload.id}/news`,
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
                state.newsLetter = Object.assign(state.newsLetter, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          deleteAdditionalImage: create.asyncThunk(
            async (payload, thunkApi) => {
              console.log(payload, "payload");
          
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/news/deleteAdditionalImage/${payload.id}/news`,
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
                state.newsLetter = Object.assign(state.newsLetter, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),          

        deleteNewsLetter: create.asyncThunk(
            async (id, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/news/deleteNewsLetter/${id}/news`
                    );
                    const message = res.data?.message;
                    toast.success(message || 'Newsletter deleted');
                    return res.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Failed to delete newsletter';
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    // If you keep a list, remove the deleted item here using action.payload or id
                    state.successMessage = action.payload?.message || 'Newsletter deleted';
                    state.errorMessage = '';
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = '';
                }
            }
        ),

        addReview: create.asyncThunk(
            async (payload, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/news/addReview/${payload?.id}/news`,
                        payload
                    );
                    const message = res.data?.message;
                    toast.success(message || 'Review added');
                    return res.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Failed to add review';
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    // Adjust this to match your slice structure
                    state.newsLetter = Object.assign(state.newsLetter || {}, action.payload);
                    state.successMessage = action.payload?.message || 'Review added';
                    state.errorMessage = '';
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = '';
                }
            }
        ),

        updateReview: create.asyncThunk(
            async ({ id, reviewId, data }, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/news/updateReview/${id}/${reviewId}/news`,
                        data
                    );
                    const message = res.data?.message;
                    toast.success(message || 'Review updated');
                    return res.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Failed to update review';
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    // Adjust this to match your slice structure
                    state.newsLetter = Object.assign(state.newsLetter || {}, action.payload);
                    state.successMessage = action.payload?.message || 'Review updated';
                    state.errorMessage = '';
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = '';
                }
            }
        ),

        deleteReview: create.asyncThunk(
            async ({ id, reviewId }, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/news/deleteReview/${id}/${reviewId}/news`
                    );
                    const message = res.data?.message;
                    toast.success(message || 'Review deleted');
                    return res.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Failed to delete review';
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    // Adjust based on your state shape; for example, remove the review from state
                    state.successMessage = action.payload?.message || 'Review deleted';
                    state.errorMessage = '';
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = '';
                }
            }
        ),

        updateNewsLetterStatus: create.asyncThunk(
            async (payload, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/news/updateNewsLetterStatus/${payload?.id}/news`,
                        payload
                    );
                    const message = res.data?.message;
                    toast.success(message || 'Newsletter status updated');
                    return res.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Failed to update newsletter status';
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    // Adjust to match your state shape; for example, merge updated newsletter
                    state.newsLetter = Object.assign(state.newsLetter || {}, action.payload);
                    state.successMessage =
                        action.payload?.message || 'Newsletter status updated';
                    state.errorMessage = '';
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = '';
                }
            }
        ),

        getSingleNewsLetter: create.asyncThunk(
            async (id, thunkApi) => {
                try {
                    const res = await axios.get(
                        `http://127.0.0.1:8080/news/getSingleNewsLetter/${id}/news`
                    );
                    
                    return res.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Failed to fetch newsletters';
              
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    // If your API returns `{ data: [...] }`, adjust accordingly
                    state.singleNews = action.payload?.data || action.payload || [];
                    state.successMessage =
                        action.payload?.message || 'Fetched newsletters';
                    state.errorMessage = '';
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = '';
                }
            }
        ),

        getAllNewsLetters: create.asyncThunk(
            async (_, thunkApi) => {
                try {
                    const res = await axios.get(
                        'http://127.0.0.1:8080/news/getAllNewsLetters/news'
                    );
                    
                    return res.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Failed to fetch newsletters';
              
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    const payload = action.payload;
                    state.newsLetters = action.payload
                    state.successMessage = payload?.message || "Fetched newsletters";
                    state.errorMessage = "";
                  },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = '';
                }
            }
        ),

        subscribeNewsLetter: create.asyncThunk(
            async (form, thunkApi) => {
                try {
                    const res = await axios.post(
                        'http://127.0.0.1:8080/news/subscribeNewsLetter/subscribe',
                        form
                    );
                    const message = res.data?.message;
                    toast.success(message || 'Subscribed to newsletter');
                    return res.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Failed to subscribe to newsletter';
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    // Adjust based on how you store subscription info
                    state.subscription = action.payload;
                    state.successMessage =
                        action.payload?.message || 'Subscribed to newsletter';
                    state.errorMessage = '';
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = '';
                }
            }
        ),

        updateSubscription: create.asyncThunk(
            async ({ id, data }, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/news/updateSubscription/${id}/subscribe`,
                        data
                    );
                    const message = res.data?.message;
                    toast.success(message || 'Subscription updated');
                    return res.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Failed to update subscription';
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    // Adjust to match your slice shape
                    state.subscription = action.payload;
                    state.successMessage =
                        action.payload?.message || 'Subscription updated';
                    state.errorMessage = '';
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = '';
                }
            }
        ),

        deleteSubscription: create.asyncThunk(
            async (id, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/news/deleteSubscription/${id}/subscribe`
                    );
                    const message = res.data?.message;
                    toast.success(message || 'Subscription deleted');
                    return res.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Failed to delete subscription';
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    // Adjust based on your state: e.g. clear subscription info or remove from list
                    state.successMessage =
                        action.payload?.message || 'Subscription deleted';
                    state.errorMessage = '';
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = '';
                }
            }
        ),

        updateNewsletterStatus: create.asyncThunk(
            async ({ id, data }, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/news/updateNewsletterStatus/${id}/subscribe`,
                        data
                    );
                    const message = res.data?.message;
                    toast.success(message || 'Newsletter status updated');
                    return res.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Failed to update newsletter status';
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    // Adjust based on your slice shape
                    state.subscription = action.payload;
                    state.successMessage =
                        action.payload?.message || 'Newsletter status updated';
                    state.errorMessage = '';
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = '';
                }
            }
        ),

        getAllSubscriptions: create.asyncThunk(
            async (_, thunkApi) => {
                try {
                    const res = await axios.get(
                        'http://127.0.0.1:8080/news/getAllSubscriptions/subscribe'
                    );
                  
                    return res.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Failed to fetch subscriptions';
                   
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    const payload = action.payload;
                    state.subscriptions = Array.isArray(payload?.data)
                      ? payload.data
                      : Array.isArray(payload)
                      ? payload
                      : [];
                    state.successMessage = payload?.message || "Fetched subscriptions";
                    state.errorMessage = "";
                  },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = '';
                }
            }
        ),


        searchSubscribers: create.asyncThunk(
            async (params, thunkApi) => {
                try {
                    // params could be { term, email, status, ... }
                    const res = await axios.get(
                        'http://127.0.0.1:8080/news/searchSubscribers/subscribe',
                        { params }
                    );
                
                    return res.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Failed to search subscribers';
           
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    // Adjust to match your API response; assuming { data: [...] }
                    state.subscriptions = action.payload?.data || action.payload || [];
                    state.successMessage =
                        action.payload?.message || 'Search completed';
                    state.errorMessage = '';
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = '';
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

    makeNewsLetter,
    updateNewsLetter,
    addAdditionalNewsImages,
    deleteAdditionalImage,
    deleteNewsLetter,
    addReview,
    updateReview,
    deleteReview,
    updateNewsLetterStatus,
    getSingleNewsLetter,
    getAllNewsLetters,
    subscribeNewsLetter,
    updateSubscription,
    deleteSubscription,
    updateNewsletterStatus,
    getAllSubscriptions,
    searchSubscribers,
    resetErrorMessage, resetSuccessMessage
    

} = newsLetterReducers.actions

export default newsLetterReducers.reducer
import axios from "axios"
import { createSupporterReducers } from "../creator.js"
import { toast } from "react-hot-toast";


const supporterBaseURL = "http://127.0.0.1:8080/support/"


const initialState = {
  // Single supporter (used after creation or when editing)
  supporter: null,
  // All supporters list
  supporters: [],
  // Messages
  successMessage: "",
  errorMessage: ""
};

const supporterReducers = createSupporterReducers({
    name: "supporter",
    initialState,

    reducers: (create) => ({

      addSupporter: create.asyncThunk(
        async (form, thunkApi) => {
          try {
            const res = await axios.post(
              "http://127.0.0.1:8080/support/addSupporter/supporter",
              form
            );
            const message = res.data?.message || "Supporter created successfully!";
            toast.success(message);
            return res.data;
          } catch (error) {
            const message =
              error.response?.data?.message || "Failed to create supporter";
            toast.error(message);
            return thunkApi.rejectWithValue(message);
          }
        },
        {
          fulfilled: (state, action) => {
            // Store the created supporter
            state.supporter = action.payload;
            state.successMessage = action.payload?.message || "";
            state.errorMessage = "";
          },
          rejected: (state, action) => {
            state.errorMessage = action.payload || "Error creating supporter";
            state.successMessage = "";
          }
        }
      ),

          updateSupporter: create.asyncThunk(
            async ({ supporterId, form }, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/support/updateSupporter/${supporterId}/supporter`,
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
                state.supporter = Object.assign(state.supporter, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          deleteSupporter: create.asyncThunk(
            async (supporterId, thunkApi) => {
              console.log("supID",supporterId);
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/support/deleteSupporter/${supporterId}/supporter`
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

          addAddress: create.asyncThunk(
            async ({ supporterId, form }, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/support/addAddress/${supporterId}/supporter`,
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
              
                state.supporter = Object.assign(state.supporter, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          addSocial: create.asyncThunk(
            async (payload, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/support/addSocial/${payload?.supporterId}/supporter`,
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
               
                state.supporter = Object.assign(state.supporter, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          deleteSocial: create.asyncThunk(
            async (payload, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/support/deleteSocial/${payload.supporterId}/${payload.socialId}/supporter`
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
                state.supporter = Object.assign(state.supporter, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          updateSupporterTier: create.asyncThunk(
            async ({ supporterId, form }, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/support/updateSupporterTier/${supporterId}/supporter`,
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
       
                state.supporter = Object.assign(state.supporter, action.payload);
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          getAllSupporters: create.asyncThunk(
            async (_, thunkApi) => {
              try {
                const res = await axios.get(
                  "http://127.0.0.1:8080/support/getAllSupporters/supporter"
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
          
                state.supporters = action.payload.data
          
                state.successMessage = payload?.message || "";
                state.errorMessage = "";
              },
          
              rejected: (state, action) => {
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

    addSupporter,
    updateSupporter,
    deleteSupporter,
    addAddress, deleteSocial,
    addSocial,
    updateSupporterTier,
    getAllSupporters,
    resetErrorMessage, resetSuccessMessage

} = supporterReducers.actions

export default supporterReducers.reducer
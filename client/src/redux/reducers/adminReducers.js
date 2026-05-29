import axios from "axios"
import { createAdminReducers } from "../creator.js"
import { toast } from "react-hot-toast";

const applyNfBaseURL = "http://127.0.0.1:8080/admin/"


const initialState = {
    adminLanding: {},

    successMessage: "", 
    errorMessage: "",
};

const adminReducer = createAdminReducers({
    name: "admin",
    initialState,


    reducers: (create) => ({


        // Add Admin Landing
        addAdminLanding: create.asyncThunk(
          async (form, thunkApi) => {
            try {
              const nextForm = { ...form };
              const fd = new FormData();
              const prefixes = [
                'heroImg',
                'whyImg',
                'approachImg',
                'inpatientImg',
                'outreachImg',   // fix casing if your state uses this
                'mentorImg',
              ];
              // Normalize delete flags to strings if you like
              prefixes.forEach((prefix) => {
                const deleteFlagKey = `${prefix}Deleted`;
                if (nextForm[deleteFlagKey]) {
                  nextForm[deleteFlagKey] = 'true';
                }
              });
              // Append all non-file, non-preview fields (including delete flags)
              Object.entries(nextForm).forEach(([key, value]) => {
                if (
                  key.endsWith('ImgFile') ||  // heroImgFile, whyImgFile, etc.
                  key.endsWith('Preview')     // heroImgPreview, etc.
                ) {
                  return;
                }
                if (value !== undefined && value !== null) {
                  fd.append(key, value);
                }
              });
              // Append image files
              prefixes.forEach((prefix) => {
                const fileKey = `${prefix}File`;
                const file = nextForm[fileKey];
                if (file) {
                  fd.append(fileKey, file);
                }
              });
              const res = await axios.post(
                'http://127.0.0.1:8080/admin/addAdminLanding/admin',
                fd
              );
            
              return res.data;
            } catch (error) {
       
              return thunkApi.rejectWithValue(message);
            }
          },
          {
            fulfilled: (state, action) => {
              state.adminLanding = Object.assign(
                state.adminLanding || {},
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

        // Update Admin Landing
        updateAdminLanding: create.asyncThunk(
            async (form, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/admin/updateAdminLanding/${form?.userId}admin`,
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
                    state.adminLanding = Object.assign(
                        state.adminLanding || {},
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

        // Get (Fetch) Admin Landing
        getUpdateLanding: create.asyncThunk(
            async (_, thunkApi) => {
                try {
                    const res = await axios.get(
                        `http://127.0.0.1:8080/admin/getUpdateLanding/admin`
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
                state.adminLanding = action.payload;
                state.successMessage = action.payload?.message || "";
                state.errorMessage = "";
              },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = "";
                }
            }
        ),

        addAdminAdditionalImage: create.asyncThunk(
          async (payload, thunkApi) => {
            try {
        
              const fd = new FormData()
        
              fd.append("section", payload.section)
              fd.append("description", payload.description || "")
              fd.append("link", payload.link || "")
        
              if (payload.file) {
                fd.append("imageFile", payload.file)
              }
        
              const res = await axios.post(
                "http://127.0.0.1:8080/admin/addAdminAdditionalImage/admin",
                fd
              )
        
              const message = res.data?.message
              toast.success(message)
        
              return res.data
        
            } catch (error) {
        
              const message = error.response?.data?.message
              toast.error(message)
        
              return thunkApi.rejectWithValue(message)
            }
          },
          {
            fulfilled: (state, action) => {
        
              const image = action.payload?.image
              const admin = action.payload?.admin
        
              if (!image || !admin) return
        
              state.adminLanding = admin
              state.successMessage = action.payload?.message
              state.errorMessage = ""
        
            },
            rejected: (state, action) => {
              state.errorMessage = action.payload
              state.successMessage = ""
            }
          }
        ),

        removeAdminAdditionalImage: create.asyncThunk(
          async (payload, thunkApi) => {
            try {
              const res = await axios.post(
                `http://127.0.0.1:8080/admin/removeAdminAdditionalImage/${payload.section}/admin`,
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
              state.admin = { ...(state.admin||{}), ...(action.payload||{}) }
              state.successMessage = action.payload?.message
              state.errorMessage = ""
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

  
    addAdminLanding,
    updateAdminLanding,
    getUpdateLanding,
    addAdminAdditionalImage, removeAdminAdditionalImage,
    resetSuccessMessage,
    resetErrorMessage

} = adminReducer.actions

export default adminReducer.reducer
import axios from "axios"
import { createAuthSlice } from "../creator.js"
import { toast } from "react-hot-toast";

const authBaseURL = "http://127.0.0.1:8080/auth"


const initialState = {

    user: {},
    allUsers: [],
    allLogs: [],
    adminAllUsers: [],

    forgotMessages: [],
    singleForgotMessages: [],

    singleUser: {},

    socketConnection: null,
    onlineUser: [],

    allAllowedEmails: [],
    allowedEmail: [],

    notAllowedEmail: [],
    allNotAllowedEmail: [],

    userSearchResults: [],

    // CHATROOM
    inChatRoomJustChatting: [],

    withCredentials: false,
    isAuth: false,
    isLogin: false,
    loginModalMessage: false,

    successMessage: "",
    errorMessage: "",

    token: "",

}

// im going to provide you a route, and then a controller. Some controllers might be in sections so I will signal this by 1 of 2 for example. So if the controller is in more then one section please wait to respond. When you collect this information I need a reducer using the proper format like the example I provided. OK?

const authSlice = createAuthSlice({
    name: "user",
    initialState,


    reducers: (create) => ({

        setToken: (state, action) => {
            state.token = action.payload
        },

        setNavPath: (state, action) => {
            state.navPath = action.payload
            state.navPath = ""

        },

        register: create.asyncThunk(
            async (formData, thunkApi) => {
                try {
                    const res = await axios.post(`${authBaseURL}/registerUser/user`, formData);
                    return res.data;
                } catch (error) {
                    // Return error message for rejected handler
                    return thunkApi.rejectWithValue(error.response?.data?.message || "Registration failed");
                }
            },
            {
                fulfilled: (state, action) => {
                    if (action.payload.message) {
                        toast.error(action.payload.message); // Show error as toast
                        state.errorMessage = action.payload.message;
                    } else {
                        state.user = Object.assign(state.user, action.payload.data);
                        state.withCredentials = true;
                        state.isAuth = false;
                        state.isLogin = false;
                        state.loginModalOpen = false;
                        state.token = action.payload.token;
                        state.onlineUser = state.onlineUser.concat(action.payload._id);
                        state.successMessage = "Registration successful!";
                        state.errorMessage = "";
                        toast.success("Registration successful!"); // Show success as toast
                    }
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload || "Something went wrong";
                    toast.error(state.errorMessage); // Show error toast
                }
            }
        ),

        login: create.asyncThunk(
            async (state, thunkApi) => {
                const res = await axios.post(`${authBaseURL}/loginUser/user`, state);
                return res.data;
            },
            {
                fulfilled: (state, action) => {
                    if (action.payload.error) {
                        state.errorMessage = action.payload.error;
                        state.successMessage = "";
                        state.isAuth = false;
                        toast.error(action.payload.error);
                    } else if (action.payload.token && action.payload.data) {
                        state.user = { ...state.user, ...action.payload.data };
                        state.withCredentials = true;
                        state.isAuth = true;
                        state.isLogin = true;
                        state.loginModalOpen = false;
                        state.token = action.payload.token;
                        state.successMessage = "Login successful!";
                        state.errorMessage = "";
                        state.loginModalMessage = true;
                        toast.success("Login successful!");
                    } else {
                        // Optionally handle unexpected responses
                        state.errorMessage = "Unexpected response.";
                        state.successMessage = "";
                        state.isAuth = false;
                        toast.error("Unexpected response.");
                    }
                },
                rejected: (state, action) => {
                    const errorMsg = action.error?.message || "Login failed";
                    state.errorMessage = errorMsg;
                    state.successMessage = "";
                    state.isAuth = false;
                    toast.error(errorMsg);
                }
            }
        ),

        changePassword: create.asyncThunk(
            async (payload, thunkApi) => {
                try {
                    const res = await axios.post(
                        `${authBaseURL}/changePassword/${payload.userId}/user`,
                        payload
                    );
                    return res.data;
                } catch (error) {
                    return thunkApi.rejectWithValue(
                        error.response?.data?.message
                    );
                }
            },
            {
                fulfilled: (state, action) => {
                    state.successMessage = action.payload?.message;
                    state.errorMessage = "";
                    toast.success(state.successMessage);
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = "";
                    toast.error(state.errorMessage);
                }
            }
        ),

        adminChangePassword: create.asyncThunk(
            async (payload, thunkApi) => {
                try {
                    const res = await axios.post(
                        `${authBaseURL}/adminChangePassword/${payload?.userId}/user`,
                        payload.state
                    );
                    return res.data;
                } catch (error) {
                    // Pass error message to rejected handler
                    return thunkApi.rejectWithValue(error.response?.data?.message || "Admin password change failed");
                }
            },
            {
                fulfilled: (state, action) => {
                    if (action.payload.message) {
                        state.errorMessage = action.payload.message;
                        state.successMessage = "";
                        toast.error(action.payload.message); // Show error toast
                    } else {
                        state.successMessage = "Admin password changed successfully!";
                        state.errorMessage = "";
                        toast.success("Admin password changed successfully!"); // Show success toast
                    }
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload || "Admin password change failed";
                    state.successMessage = "";
                    toast.error(state.errorMessage); // Show error toast
                }
            }
        ),


        deleteUser: create.asyncThunk(
            async (payload, thunkApi) => {
                console.log(payload)
                try {
                    const res = await axios.post(
                        `${authBaseURL}/deleteUser/${payload?.authId}/${payload?.userId}/user`,
                        { reason: payload.reason }
                    );
                    return res.data;
                } catch (error) {
                    return thunkApi.rejectWithValue(error.response?.data?.message || "User delete failed");
                }
            },
            {
                fulfilled: (state, action) => {
                    state.successMessage = action.payload.message;
                    state.errorMessage = "";
                    toast.success(action.payload.message);
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload || "User delete failed";
                    state.successMessage = "";
                    toast.error(state.errorMessage);
                }
            }
        ),

        logout: create.reducer((state) => {

            state.user = {}
            state.isAuth = false
            state.loginModalOpen = false
            state.isLogin = false
            state.withCredentials = false
            state.token = ""
            state.message = ""
            state.onlineUser = []
            state.inChatRoomRandom = []
            state.socketConnection = null

        }),


        editUser: create.asyncThunk(
            async (payload, thunkApi) => {
                try {
                    const res = await axios.post(
                        `${authBaseURL}/editProfile/${payload.id}/user`,
                        payload.state
                    );
                    return res.data;
                } catch (error) {
                    return thunkApi.rejectWithValue(error.response?.data?.message || "Profile update failed");
                }
            },
            {
                fulfilled: (state, action) => {
                    if (action.payload.message) {
                        state.errorMessage = action.payload.message;
                        state.successMessage = "";
                        toast.error(action.payload.message); // Show error toast
                    } else {
                        state.user = Object.assign(state.user, action.payload.data);
                        state.isEdit = false;
                        state.successMessage = "Profile updated!";
                        state.errorMessage = "";
                        toast.success("Profile updated!"); // Show success toast
                    }
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload || "Profile update failed";
                    state.successMessage = "";
                    toast.error(state.errorMessage); // Show error toast
                    state.isEdit = false;
                }
            }
        ),

        adminUpdateProfile: create.asyncThunk(
            async (payload, thunkApi) => {
                console.log(payload);
                try {
                    const res = await axios.post(
                        `${authBaseURL}/adminUpdateProfile/${payload?.authId}/${payload?.userId}/user`,
                        payload
                    );
                    return res.data;
                } catch (error) {
                    return thunkApi.rejectWithValue(error.response?.data?.message || "Profile update failed");
                }
            },
            {
                fulfilled: (state, action) => {
                    if (action.payload.message) {
                        state.errorMessage = action.payload.message;
                        state.successMessage = "";
                        toast.error(action.payload.message); // Show error toast
                    } else {
                        state.user = Object.assign(state.user, action.payload);
                        state.isEdit = false;
                        state.successMessage = "Profile updated!";
                        state.errorMessage = "";
                        toast.success("Profile updated!"); // Show success toast
                    }
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload || "Profile update failed";
                    state.successMessage = "";
                    toast.error(state.errorMessage); // Show error toast
                    state.isEdit = false;
                }
            }
        ),

        adminGetAllUsers: create.asyncThunk(
            async (thunkApi) => {
                const res = await axios.get(authBaseURL + "/adminGetAllUsers/user");
                return res.data;
            },
            {
                fulfilled: (state, action) => {
                    const payload = action.payload;
                    if (Array.isArray(payload)) {
                        state.adminAllUsers = payload;
                        state.message = "";
                    } else {
                        state.adminAllUsers = [];
                        state.message = payload?.message || "";
                    }
                },
            }
        ),

        getAllUsers: create.asyncThunk(
            async (thunkApi) => {
                const res = await axios.get(authBaseURL + "/getAllUsers/user");
                return res.data;
            },
            {
                fulfilled: (state, action) => {
                    if (action.payload.message) {
                        {
                            state.message = action.payload.message;
                        }
                    } else {
                        state.allUsers = action.payload
                    }
                },
            }
        ),

        getSingleUser: create.asyncThunk(
            async (_id, thunkApi) => {
                // console.log("SINGLE HIT")
                // console.log("SINGLE HIT _id", _id)
                const res = await axios.get(`${authBaseURL}/getUserById/${_id}/user`);
                // console.log("RES_DATA", res.data)
                return res.data;
            },
            {
                fulfilled: (state, action) => {
                    if (action.payload.message) {
                        state.message = action.payload.message;
                    } else {

                        state.singleUser = Object.assign(state.singleUser, action.payload)
                    }
                },
            }
        ),


        blockedUser: create.asyncThunk(
            async (payload, thunkApi) => {
                try {
                    const res = await axios.post(
                        `${authBaseURL}/blockUser/${payload.userId}/Block/${payload.blockedUserId}/user`
                    );
                    return res.data;
                } catch (error) {
                    return thunkApi.rejectWithValue(error.response?.data?.message || "Block user failed");
                }
            },
            {
                fulfilled: (state, action) => {
                    if (action.payload.message) {
                        state.errorMessage = action.payload.message;
                        state.successMessage = "";
                        toast.error(action.payload.message); // Error toast
                    } else {
                        state.successMessage = "User blocked successfully!";
                        state.errorMessage = "";
                        toast.success("User blocked successfully!"); // Success toast
                    }
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload || "Block user failed";
                    state.successMessage = "";
                    toast.error(state.errorMessage); // Error toast
                }
            }
        ),

        unBlockedUser: create.asyncThunk(
            async (payload, thunkApi) => {
                try {
                    const res = await axios.post(
                        `${authBaseURL}/blockUser/${payload?.userId}/unBlock/${payload?.blockedUserId}/user`
                    );
                    return res.data;
                } catch (error) {
                    return thunkApi.rejectWithValue(error.response?.data?.message || "Unblock user failed");
                }
            },
            {
                fulfilled: (state, action) => {
                    if (action.payload.message) {
                        state.errorMessage = action.payload.message;
                        state.successMessage = "";
                        toast.error(action.payload.message); // Error toast
                    } else {
                        state.successMessage = "User unblocked successfully!";
                        state.errorMessage = "";
                        toast.success("User unblocked successfully!"); // Success toast
                    }
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload || "Unblock user failed";
                    state.successMessage = "";
                    toast.error(state.errorMessage); // Error toast
                }
            }
        ),

        setSecurityAccessLevels: create.asyncThunk(
            async (state, thunkApi) => {
                try {
                    const res = await axios.post(
                        `${authBaseURL}/setSecurityAccessLevels/${state.userId}/${state.authId}/user`,
                        {
                            access: state.access, // ✅ wrap in { access: ... } to match controller
                        }
                    );
                    return res.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message ||
                        error.message ||
                        "Failed to update security access levels";
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    if (!action.payload || action.payload.error) {
                        const message =
                            action.payload?.message || "Failed to update security access levels";
                        toast.error(message);
                        state.errorMessage = message;
                        return;
                    }
                    const { message, user, changes = [] } = action.payload;
                    const granted = changes
                        .filter((c) => c.to === true)
                        .map((c) => c.flag);
                    const revoked = changes
                        .filter((c) => c.to === false)
                        .map((c) => c.flag);
                    let toastMsg = message || "Security access levels updated.";
                    const parts = [];
                    if (granted.length) parts.push(`Granted: ${granted.join(", ")}`);
                    if (revoked.length) parts.push(`Revoked: ${revoked.join(", ")}`);
                    if (parts.length) {
                        toastMsg = parts.join(" | ");
                    }
                    state.user = Object.assign(state.user || {}, user || {});
                    state.successMessage = message || "Security access levels updated.";
                    state.errorMessage = "";
                    toast.success(toastMsg);
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload || "Something went wrong";
                    toast.error(state.errorMessage);
                },
            }
        ),

        setOnlineUser: (state, action) => {
            state.onlineUser = action.payload
        },

        // CHATROOMs
        setInChatRoomJustChatting: (state, action) => {
            state.inChatRoomJustChatting = action.payload
        },

        setSocketConnection: (state, action) => {
            state.socketConnection = action.payload
        },

        makeAllowedEmail: create.asyncThunk(
            async (form, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/auth/addAllowedEmail/add`,
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
                    state.allowedEmail = Object.assign(state.allowedEmail, action.payload);
                    state.successMessage = action.payload?.message;
                    state.errorMessage = "";
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = "";
                }
            }
        ),

        removeAllowedEmail: create.asyncThunk(
            async (form, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/auth/removeAllowedEmail/remove`,
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
                    state.allowedEmail = Object.assign(state.allowedEmail, action.payload);
                    state.successMessage = action.payload?.message;
                    state.errorMessage = "";
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = "";
                }
            }
        ),

        getAllAllowedEmails: create.asyncThunk(
            async (_, thunkApi) => {
                try {
                    const res = await axios.get(
                        `http://127.0.0.1:8080/auth/getAllAllowedEmails`
                    );
                    return res.data;
                } catch (error) {
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    state.allAllowedEmails = action.payload;
                    state.successMessage = action.payload?.message;
                    state.errorMessage = "";
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = "";
                }
            }
        ),

        addNotAllowedEmail: create.asyncThunk(
            async (form, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/auth/addNotAllowedEmail/add`,
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
                    state.notAllowedEmail = Object.assign(
                        state.notAllowedEmail,
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

        removeNotAllowedEmail: create.asyncThunk(
            async (form, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/auth/removeNotAllowedEmail/remove`,
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
                    state.notAllowedEmail = Object.assign(
                        state.notAllowedEmail,
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

        getAllNotAllowedEmails: create.asyncThunk(
            async (_, thunkApi) => {
                try {
                    const res = await axios.get(
                        `http://127.0.0.1:8080/auth/getAllNotAllowedEmails`
                    );
                    return res.data;
                } catch (error) {

                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    state.allNotAllowedEmail = action.payload;
                    state.successMessage = action.payload?.message;
                    state.errorMessage = "";
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload;
                    state.successMessage = "";
                }
            }
        ),

        searchUserList: create.asyncThunk(
            async (payload, thunkApi) => {
                try {
                    const res = await axios.get(
                        "http://127.0.0.1:8080/auth/searchUser", // matches your authRouter route
                        { params: payload }                      // e.g. { q: 'admin' }
                    );
                    const message =
                        res.data?.message ??
                        `Found ${res.data?.count ?? 0} user(s) matching your search`;
                    toast.success(message);
                    return res.data; // { count, results, message? }
                } catch (error) {
                    const message =
                        error.response?.data?.message || "Failed to search users";
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    // store the results from searchUserList controller
                    state.userSearchResults = action.payload; // { count, results, message? }
                    state.successMessage =
                        action.payload?.message ??
                        `Found ${action.payload?.count ?? 0} user(s)`;
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

        getAllAuditLogs: create.asyncThunk(
            async (thunkApi) => {
                const res = await axios.get(authBaseURL + "/getAllAuditLogs/log");
                return res.data;
            },
            {
                fulfilled: (state, action) => {
                    if (action.payload.message) {
                        {
                            state.message = action.payload.message;
                        }
                    } else {
                        state.allLogs = action.payload
                    }
                },
            }
        ),

        deleteAuditLog: create.asyncThunk(
            async ({ id }, thunkApi) => {
              try {
                const res = await axios.post(authBaseURL + `/deleteAuditLog/${id}`)
                const message = res.data?.message ?? "Audit log deleted successfully."
                toast.success(message)
                return res.data
              } catch (error) {
                const message = error.response?.data?.message || "Failed to delete audit log."
                toast.error(message)
                return thunkApi.rejectWithValue(message)
              }
            },
            {
              fulfilled: (state, action) => {
                state.successMessage = action.payload?.message ?? "Audit log deleted successfully."
                state.errorMessage = ""
          
                if (action.payload?.deletedLog?._id) {
                  state.allLogs = state.allLogs.filter(
                    (log) => log._id !== action.payload.deletedLog._id
                  )
                }
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload
                state.successMessage = ""
              },
            }
          ),

          selfServiceChangePassword: create.asyncThunk(
            async (payload, thunkApi) => {
              try {
                const res = await axios.post(
                  `${authBaseURL}/selfServiceChangePassword/account/${payload.accountName}`,
                  payload
                );
                return res.data;
              } catch (err) {
                const message = err.response?.data?.message || err.message || "Internal Server Error";
                return thunkApi.rejectWithValue(message);
              }
            },
            {
                fulfilled: (state, action) => {
                    state.successMessage = action.payload.message;
                    state.errorMessage = "";
                    if (action.payload.message?.startsWith("✅")) {
                      toast.success(action.payload.message);
                    } else if (Array.isArray(action.payload.details)) {
                      action.payload.details.forEach(detail => toast.error(detail));
                    } else {
                      toast.error(action.payload.message);
                    }
                  },
                  rejected: (state, action) => {
                    const errMsg = action.payload || action.error?.message || "Internal Server Error";
                    state.errorMessage = errMsg;
                    state.successMessage = "";
                    toast.error(errMsg);
                  }
            }
          ),

          getAllForgotPasswords: create.asyncThunk(
            async (thunkApi) => {
                const res = await axios.get(`${authBaseURL}/getAllForgotPasswords`);
                return res.data;
            },
            {
                fulfilled: (state, action) => {
                    if (action.payload.message) {
                        {
                            state.message = action.payload.message;
                        }
                    } else {
                        state.forgotMessages = action.payload
                    }
                },
            }
        ),

        // asyncThunk to update message status
        updateMessageStatus: create.asyncThunk(
            async (payload, thunkApi) => {
                const res = await axios.post(`${authBaseURL}/updateMessageStatus`, {
                    id: payload.id,
                    status: payload.status,
                    adminName: payload.adminName,
                    emailDate: payload.emailDate
                });
                return res.data;
            },
            {
                fulfilled: (state, action) => {
                    if (action.payload?.error) {
                        state.errorMessage = action.payload.error;
                        state.successMessage = "";
                        toast.error(action.payload.error);
                    } else {
                        state.successMessage = "Message status updated successfully";
                        state.errorMessage = "";
                        toast.success(state.successMessage);
                        // Optionally refresh or update your list/report here
                    }
                },
                rejected: (state, action) => {
                    const errorMsg = action.error?.message || "Failed to update message status";
                    state.errorMessage = errorMsg;
                    state.successMessage = "";
                    toast.error(errorMsg);
                }
            }
        ),

        deleteForgotPassword: create.asyncThunk(
            async (id, thunkApi) => {
              const res = await axios.post(authBaseURL + `/deleteForgotPassword/${id}`);
              return { id, message: res.data.message, error: res.data.error };
            },
            {
              fulfilled: (state, action) => {
                if (action.payload?.error) {
                  state.errorMessage = action.payload.error;
                  state.successMessage = "";
                  toast.error(action.payload.error);
                } else {
                  state.forgotMessages = state.forgotMessages.filter(
                    (item) => item._id !== action.payload.id
                  );
                  state.successMessage = action.payload.message || "Deleted successfully";
                  state.errorMessage = "";
                  toast.success(state.successMessage);
                }
              },
              rejected: (state, action) => {
                const errorMsg = action.error?.message || "Failed to delete message";
                state.errorMessage = errorMsg;
                state.successMessage = "";
                toast.error(errorMsg);
              }
            }
          ),

        getSingleForgotPassword: create.asyncThunk(
            async (_id, thunkApi) => {
       
                const res = await axios.get(`${authBaseURL}/getSingleForgotPassword/${_id}/user`);
                return res.data;
            },
            {
                fulfilled: (state, action) => {
                    if (action.payload.message) {
                        state.message = action.payload.message;
                    } else {

                        state.singleForgotMessages = Object.assign(state.singleForgotMessages, action.payload)
                    }
                },
            }
        ),
          


    })
})

export const {

    setToken, setNavPath,
    register, login, logout,
    editUser, adminUpdateProfile, changePassword, adminChangePassword,
    deleteUser,
    getAllUsers, adminGetAllUsers, getSingleUser,
    setOnlineUser, setSocketConnection,
    setInChatRoomJustChatting,
    blockedUser, unBlockedUser,
    setSecurityAccessLevels,
    closeLoginModalMessage,
    makeAllowedEmail, removeAllowedEmail, getAllAllowedEmails,
    addNotAllowedEmail, removeNotAllowedEmail, getAllNotAllowedEmails,
    searchUserList,
    resetErrorMessage, resetSuccessMessage,
    getAllAuditLogs,
    deleteAuditLog,

    selfServiceChangePassword,
    getAllForgotPasswords,
    updateMessageStatus,
    getSingleForgotPassword,
    deleteForgotPassword
    

} = authSlice.actions

export default authSlice.reducer
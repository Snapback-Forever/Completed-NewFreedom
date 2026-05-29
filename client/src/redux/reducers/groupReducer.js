import axios from "axios"
import { createGroupSlice } from "../creator.js"
import { toast } from "react-hot-toast";


const groupBaseURL = "http://127.0.0.1:8080/group"


const initialState = {

    groups: [],
    lastCreatedGroup: null,
    errorMessage: "",
    successMessage: "",

}

const groupSlice = createGroupSlice({
    name: "group",
    initialState,

    reducers: (create) => ({

        addGroup: create.asyncThunk(
            async (state, thunkApi) => {
                try {
                    const res = await axios.post(`${groupBaseURL}/addGroup/${state.userId}`, state.groupData);
                    return res.data;
                } catch (error) {
                    // Return error message for rejected handler
                    return thunkApi.rejectWithValue(error.response?.data?.message || "Group creation failed");
                }
            },
            {
                fulfilled: (state, action) => {
                    if (action.payload.message && action.payload.message !== "Group created and user updated successfully!") {
                        toast.error(action.payload.message); // Error toast for messages other than success
                        state.errorMessage = action.payload.message;
                    } else {
                        // Success case
                        state.lastCreatedGroup = action.payload;
                        state.groups = state.groups ? state.groups.concat(action.payload) : [action.payload];
                        state.successMessage = "Group created and user updated successfully!";
                        state.errorMessage = "";
                        toast.success("Group created and user updated successfully!");
                    }
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload || "Something went wrong";
                    toast.error(state.errorMessage); // Show error toast
                }
            }
        ),

        deleteGroup: create.asyncThunk(
            async (state, thunkApi) => {
                try {
                    const res = await axios.post(`${groupBaseURL}/deleteGroup/${state.groupId}`);
                    return res.data;
                } catch (error) {
                    return thunkApi.rejectWithValue(
                        error.response?.data?.message || "Group deletion failed"
                    );
                }
            },
            {
                fulfilled: (state, action) => {
                    // Error message handling
                    if (action.payload.message
                        && (
                            action.payload.message.startsWith("Group not found") ||
                            action.payload.message.startsWith("NO Group WITH THAT ID")
                        )
                    ) {
                        toast.error(action.payload.message);
                        state.errorMessage = action.payload.message;
                    } else if (action.payload.message
                        && action.payload.message.includes("deleted successfully")) {
                        // Success case: clear appropriate state, update success message
                        state.groups = state.groups.filter(group => group._id !== state.groupId);
                        state.successMessage = action.payload.message;
                        state.errorMessage = "";
                        toast.success(action.payload.message);
                    }
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload || "Something went wrong during deletion";
                    toast.error(state.errorMessage);
                }
            }
        ),


        updateGroup: create.asyncThunk(
            async (state, thunkApi) => {
                try {
                    const res = await axios.post(
                        `${groupBaseURL}/updateGroup/${state.groupId}`,
                        state.updateFields // Expects an object like {groupLogo, groupName, location, description, groupWebsite}
                    );
                    return res.data;
                } catch (error) {
                    return thunkApi.rejectWithValue(
                        error.response?.data?.message || "Group update failed"
                    );
                }
            },
            {
                fulfilled: (state, action) => {
                    if (action.payload.message) {
                        toast.error(action.payload.message);
                        state.errorMessage = action.payload.message;
                    } else {
                        // Update the group in state.groups if present
                        state.groups = state.groups.map(group =>
                            group._id === state.groupId ? action.payload : group
                        );
                        state.successMessage = "Group updated successfully!";
                        state.errorMessage = "";
                        toast.success("Group updated successfully!");
                    }
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload || "Something went wrong during update";
                    toast.error(state.errorMessage);
                }
            }
        ),

        getUserGroup: create.asyncThunk(
            async (state, thunkApi) => {
                try {
                    const res = await axios.get(`${groupBaseURL}/getUserGroup/${state.groupId}`);
                    return res.data;
                } catch (error) {
                    return thunkApi.rejectWithValue(
                        error.response?.data?.message || "Failed to fetch group"
                    );
                }
            },
            {
                fulfilled: (state, action) => {
                    if (action.payload.message) {
                        state.errorMessage = action.payload.message;
                    } else {
                        state.selectedGroup = action.payload;
                        state.successMessage = "Group fetched successfully!";
                        state.errorMessage = "";
                    }
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload || "Error fetching group";
                }
            }
        ),

        getAllGroups: create.asyncThunk(
            async (state, thunkApi) => {
                try {
                    const res = await axios.get(`${groupBaseURL}/getAllGroups`);
                    return res.data;
                } catch (error) {
                    return thunkApi.rejectWithValue(
                        error.response?.data?.message || "Failed to fetch groups"
                    );
                }
            },
            {
                fulfilled: (state, action) => {
                    state.groups = Array.isArray(action.payload) ? action.payload : [];
                    state.successMessage = "Groups fetched successfully!";
                    state.errorMessage = "";
                  },                  
                rejected: (state, action) => {
                    state.errorMessage = action.payload || "Error fetching groups";
                }
            }
        ),
        
        addGroupMember: create.asyncThunk(
            async (state, thunkApi) => {
                try {
                    const res = await axios.post(
                        `${groupBaseURL}/addGroupMember/${state.selectedGroupId}`,
                        { newMemberId: state.newMemberId, actionUserId: state.actionUserId }
                    );
                    return res.data;
                } catch (error) {
                    return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to add member");
                }
            },
            {
                fulfilled: (state, action) => {
                    const { message } = action.payload;
                    if (message && message !== "Member added successfully!") {
                        toast.error(message); // Error messages
                        state.errorMessage = message;
                    } else {
                        // Success case
                        state.successMessage = "Member added successfully!";
                        state.errorMessage = "";
                        toast.success("Member added successfully!"); // Success toast
                        // Optionally update groupMembers in state
                    }
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload || "Something went wrong";
                    toast.error(state.errorMessage);
                }
            }
        ),

        removeGroupMember: create.asyncThunk(
            async (state, thunkApi) => {
              try {
                const res = await axios.post(
                  `${groupBaseURL}/removeGroupMember/${state.selectedGroupId}`,
                  { memberId: state.memberId, actionUserId: state.actionUserId }
                );
                return res.data;
              } catch (error) {
                return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to remove member");
              }
            },
            {
              fulfilled: (state, action) => {
                const { message } = action.payload;
                if (message && message !== "Member removed successfully!") {
                  toast.error(message); // Error toast for any non-success message
                  state.errorMessage = message;
                } else {
                  // Success case
                  state.successMessage = "Member removed successfully!";
                  state.errorMessage = "";
                  toast.success("Member removed successfully!");
           
                }
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload || "Something went wrong";
                toast.error(state.errorMessage);
              }
            }
          ),

          makeUserStaff: create.asyncThunk(
            async (state, thunkApi) => {
              try {
                const res = await axios.post(
                  `${groupBaseURL}/makeUserStaff/${state.selectedGroupId}`,
                  { targetUserId: state.targetUserId, actionUserId: state.actionUserId }
                );
                return res.data;
              } catch (error) {
                return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to promote user to staff");
              }
            },
            {
              fulfilled: (state, action) => {
                const { message } = action.payload;
                if (message && message !== "User has been promoted to staff successfully!") {
                  toast.error(message);
                  state.errorMessage = message;
                } else {
                  state.successMessage = "User has been promoted to staff successfully!";
                  state.errorMessage = "";
                  toast.success("User has been promoted to staff successfully!");
            
                }
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload || "Something went wrong";
                toast.error(state.errorMessage);
              }
            }
          ),

          promoteStaffToAdmin: create.asyncThunk(
            async (state, thunkApi) => {
              try {
                const res = await axios.post(
                  `${groupBaseURL}/promoteStaffToAdmin/${state.selectedGroupId}`,
                  { targetUserId: state.targetUserId, actionUserId: state.actionUserId }
                );
                return res.data;
              } catch (error) {
                return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to promote staff to admin");
              }
            },
            {
              fulfilled: (state, action) => {
                const { message } = action.payload;
                if (message && message !== "Staff member promoted to group admin!") {
                  toast.error(message);
                  state.errorMessage = message;
                } else {
                  state.successMessage = "Staff member promoted to group admin!";
                  state.errorMessage = "";
                  toast.success("Staff member promoted to group admin!");
              
                }
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload || "Something went wrong";
                toast.error(state.errorMessage);
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

    addGroup,
    deleteGroup,
    updateGroup,
    getUserGroup,
    getAllGroups,
    addGroupMember,
    removeGroupMember,
    makeUserStaff,
    promoteStaffToAdmin,
    resetErrorMessage, resetSuccessMessage

} = groupSlice.actions

export default groupSlice.reducer
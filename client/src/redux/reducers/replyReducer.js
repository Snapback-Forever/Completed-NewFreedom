
import axios from "axios";
import { createReplyReducer } from "../creator";
import { toast } from "react-hot-toast";


const initialState = {
    
    reply: [],
    allReplys: [],

    replyUserId: "",
    replyAccountName: "",
    replyLocation: "",
    replyMessage: "",

    replyDeleted: false,
    seeReplys: false
}

const replyReducer = createReplyReducer({

    name: "reply",
    initialState,
    reducers: (create) => ({



        makeReply: create.asyncThunk(
            async (payload, thunkApi) => {
              console.log(payload)
              try {
                const res = await axios.post(
                  `http://localhost:8080/reply/addReply/${payload.postId}`,
                  payload
                );
                // Use message from controller, if present
                const message = res.data?.message;
                if (message) {
                  toast.success(message);
                }
                return res.data;
              } catch (error) {
                const message = error.response?.data?.message;
                if (message) {
                  toast.error(message);
                }
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                state.reply = action.payload;
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),

          deleteReply: create.asyncThunk(
            async (replyDelete, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://localhost:8080/reply/deleteReply/${replyDelete}`
                );
                const message = res.data?.message;
                if (message) {
                  toast.success(message);
                }
                return res.data;
              } catch (error) {
                const message = error.response?.data?.message || "Reply delete failed";
                toast.error(message);
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                state.allReplys = action.payload;
                state.successMessage = action.payload?.message;
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = "";
              }
            }
          ),


        getSingleReply: create.asyncThunk(
            async (replyId, thunkApi) => {

                const res = await axios.get(`http://localhost:8080/reply/singleReply/${replyId}`)

                return res.data
            }, {
            fulfilled: (state, action) => {

                state.allReplys = action.payload
                state.replyDeleted = false
                state.seeReplys = false
            }
        }
        ),

        getAllReplys: create.asyncThunk(
            async (_id, thunkApi) => {
                if (!_id) {
                    const message = "ID is required";
                    return thunkApi.rejectWithValue(message);
                }
                    const res = await axios.get(`http://localhost:8080/reply/allReply`);
                    // console.log("THIS IS RES DATA GET ALL", res.data);
                    return res.data;
        
            }, {
              fulfilled: (state, action) => {
                state.allReplys = Array.isArray(action.payload) ? action.payload : [];
                state.replyDeleted = false;
                state.seeReplys = false;
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
    
    makeReply, 
    deleteReply, 
    getAllReplys, 
    resetErrorMessage, resetSuccessMessage

} = replyReducer.actions

export default replyReducer.reducer
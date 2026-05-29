import axios from "axios"
import { createMessageReducer } from "../creator.js"
import { toast } from "react-hot-toast";


const authBaseURL = "http://127.0.0.1:8080/auth"


const initialState = {

    socketConnection: null,
    onlineUser: [],
    allConversations: [],
    singleConvo: []
}

const messageReducer = createMessageReducer({
    name: "msg",
    initialState,

    reducers: (create) => ({


        setSocketConnection: (state, action) => {
            state.socketConnection = action.payload
        },

        setOnlineUser: (state, action) => {
            state.onlineUser = action.payload
        },

        deleteConversation: create.asyncThunk(
            async (convId, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/convo/conversationDelete/${convId}/convo`
                    );
                    return res.data;
                } catch (error) {
                    return thunkApi.rejectWithValue(error.response?.data?.message || "Conversation delete failed");
                }
            },
            {
                fulfilled: (state, action) => {
                    if (action.payload.message) {
                        state.errorMessage = action.payload.message;
                        state.successMessage = "";
                        toast.error(action.payload.message); // Error toast
                    } else {
                        state.successMessage = "Conversation deleted successfully!";
                        state.errorMessage = "";
                        toast.success("Conversation deleted successfully!"); // Success toast
                    }
                    state.conversationRefresh = true;
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload || "Conversation delete failed";
                    state.successMessage = "";
                    toast.error(state.errorMessage); // Error toast
                }
            }
        ),

        getAllConvo: create.asyncThunk(

            async (thunkAPI) => {
                // console.log("THIS IS ALL CONVERSATION CONVO")
                const res = await axios.get(`http://127.0.0.1:8080/convo/getAllConvo`)
                // console.log("THIS IS RES.DATA ALL CONVO", res.data)
                return res.data
            },{
                fulfilled: (state, action) => {
                    if (action.payload.message) {
                        {
                        state.message = action.payload.message;
                        }
                    } else {
                        state.allConversations = action.payload
                    }
                },
            } 
            
        ),

        getSingleConvo: create.asyncThunk( 
            async( convoId, thunkAPI ) => {
                // console.log("HHHEEEERRREEEE I AM")
                // console.log(_id, "HHHEEEERRREEEE")
                const res = await axios.get(`http://127.0.0.1:8080/convo/getSingleConvo/${convoId}/convo`)
                // console.log(res.data)
                return res.data

            }, {
                fulfilled: (state, action) => {
                    if (action.payload.message) {
                        {
                        state.message = action.payload.message;
                        }
                    } else {
                        state.singleConvo = action.payload
                    }

                }
            })

    })

})

export const {

    setSocketConnection,
    setOnlineUser,
    deleteConversation,
    getAllConvo,
    getSingleConvo

} = messageReducer.actions

export default messageReducer.reducer
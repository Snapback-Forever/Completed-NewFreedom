import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import messageReducer from "./reducers/messageReducers";
import chatRoomReducers from "./reducers/chatRoomReducers";
import replyReducer from "./reducers/replyReducer";
import questionReducers from "./reducers/questionReducers";
import locationReducer from "./reducers/locationReducer";
import directMsgStaffReducers from "./reducers/directMsgStaffReducers";
import supporterReducers from "./reducers/supporterReducers";
import eventReducers from "./reducers/eventReducers";
import adminReducers from "./reducers/adminReducers";
import applyNfReducer from "./reducers/applyNfRedcuers";
import successStoriesReducer from "./reducers/successStoriesReducer";
import newsLetterReducer from "./reducers/newsLetterReducer";
import drawingReducers from "./reducers/drawingReducers";
import applicationReducers from "./reducers/applicationReducers";
import menteeReducers from "./reducers/menteeReducers";


const store = configureStore({

    reducer: {

        admin: adminReducers,
        app: applicationReducers,
        applyNF: applyNfReducer,
        auth: authReducer,
        chat: chatRoomReducers,
        staffMsg: directMsgStaffReducers,
        draw: drawingReducers,
        event: eventReducers,
        pro: locationReducer,
        mentee: menteeReducers,
        msg: messageReducer,
        news: newsLetterReducer,
        quest: questionReducers,
        reply: replyReducer,
        success: successStoriesReducer,
        support: supporterReducers,
        


    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }),
        
})

export default store
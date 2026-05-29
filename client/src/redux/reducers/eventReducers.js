import axios from "axios";
import { createEventReducer } from "../creator.js";
import { toast } from "react-hot-toast";

const questBaseURL = "http://127.0.0.1:8080/event/"

const initialState = {

    event: {},
    events: [],
    singleEvent: [],

    successMessage: "",
    errorMessage: ""
};

const eventReducers = createEventReducer({
    name: "event",
    initialState,


    reducers: (create) => ({

        addEvent: create.asyncThunk(
            async (payload, thunkApi) => {
                try {
                    const res = await axios.post(
                        "http://127.0.0.1:8080/event/addEvent/event",
                        payload
                    );
                    const message = res.data?.message;
                    toast.success(message);
                    return res.data;
                } catch (error) {
                    const message = error.response?.data?.message || "Failed to add event.";
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    // adjust this to match your state shape
                    state.event = action.payload;
                    state.successMessage = action.payload?.message || "";
                    state.errorMessage = "";
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload || "Failed to add event.";
                    state.successMessage = "";
                }
            } 
        ),

        // REDUCER

updateEvent: create.asyncThunk(
    async (payload, thunkApi) => {
  
      console.log(payload, "payload");
  
      try {
  
        const res = await axios.post(
          `http://127.0.0.1:8080/event/updateEvent/${payload.id}/event`,
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
  
        state.event = Object.assign(state.event, action.payload);
  
        state.successMessage = action.payload?.message;
  
        state.errorMessage = "";
      },
  
      rejected: (state, action) => {
  
        state.errorMessage = action.payload;
  
        state.successMessage = "";
      }
    }
  ),

        addAdditionalEventImages: create.asyncThunk(
            async (payload, thunkApi) => {
          
              console.log(payload, "payload");
          
              try {
          
                const res = await axios.post(
                  `http://127.0.0.1:8080/event/addAdditionalEventImages/${payload.id}/event`,
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
          
                state.event = Object.assign(state.event, action.payload);
          
                state.successMessage = action.payload?.message;
          
                state.errorMessage = "";
              },
          
              rejected: (state, action) => {
          
                state.errorMessage = action.payload;
          
                state.successMessage = "";
              }
            }
          ),
          
          deleteAdditionalEventImage: create.asyncThunk(
            async (payload, thunkApi) => {
          
              console.log(payload, "payload");
          
              try {
          
                const res = await axios.post(
                  `http://127.0.0.1:8080/event/deleteAdditionalEventImage/${payload.id}/event`,
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
          
                state.event = Object.assign(state.event, action.payload);
          
                state.successMessage = action.payload?.message;
          
                state.errorMessage = "";
              },
          
              rejected: (state, action) => {
          
                state.errorMessage = action.payload;
          
                state.successMessage = "";
              }
            }
          ),

        updateEventStatus: create.asyncThunk(
            async (payload, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/event/updateEventStatus/${payload?.eventId}/event`,
                        payload
                    );
                    const message = res.data?.message;
                    toast.success(message);
                    return res.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || "Failed to update event status.";
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    state.event = Object.assign(state.event || {}, action.payload);
                    state.successMessage = action.payload?.message || "";
                    state.errorMessage = "";
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload || "Failed to update event status.";
                    state.successMessage = "";
                }
            }
        ),

        addEventToLocation: create.asyncThunk(
            async (form, thunkApi) => {
                try {
                    const res = await axios.post(
                        "http://127.0.0.1:8080/event/addEventToLocation/event",
                        form
                    );
                    const message = res.data?.message;
                    toast.success(message);
                    return res.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || "Failed to add event to location.";
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    state.event = Object.assign(state.event || {}, action.payload);
                    state.successMessage = action.payload?.message || "";
                    state.errorMessage = "";
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload || "Failed to add event to location.";
                    state.successMessage = "";
                }
            }
        ),

        removeEventFromLocation: create.asyncThunk(
            async (form, thunkApi) => {
                try {
                    const res = await axios.post(
                        "http://127.0.0.1:8080/event/removeEventFromLocation/event",
                        form
                    );
                    const message = res.data?.message;
                    toast.success(message);
                    return res.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message ||
                        "Failed to remove event from location.";
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {

                    state.event = Object.assign(state.event || {}, action.payload);
                    state.successMessage = action.payload?.message || "";
                    state.errorMessage = "";
                },
                rejected: (state, action) => {
                    state.errorMessage =
                        action.payload || "Failed to remove event from location.";
                    state.successMessage = "";
                }
            }
        ),

        addOrUpdateAttendee: create.asyncThunk(
            async ({ eventId, form }, thunkApi) => {
            try {
            
            const res = await axios.post(
            `http://127.0.0.1:8080/event/addOrUpdateAttendee/${eventId}/event`,
            form
            );
            
            const data = res.data;
            
            if (data.acceptedGuests?.length) {
            data.acceptedGuests.forEach(email=>{
            toast.success(`${email} was added to attendance`)
            })
            }
            
            if (data.rejectedGuests?.length) {
            data.rejectedGuests.forEach(r=>{
            toast.error(`${r.email} ${r.reason}`)
            })
            }
            
            return data;
            
            } catch (error) {
            
            const message =
            error.response?.data?.message || "Failed to add or update attendee.";
            
            toast.error(message);
            
            return thunkApi.rejectWithValue(message);
            
            }
            },
            {
            pending: (state) => {
            state.errorMessage = "";
            state.successMessage = "";
            },
            fulfilled: (state, action) => {
                state.event = action.payload.event;
                state.successMessage = action.payload?.message || "";
                if (action.payload.rejectedGuests?.length) {
                state.errorMessage = action.payload.rejectedGuests
                .map(r => `${r.email} ${r.reason}`)
                .join(", ");
                } else {
                state.errorMessage = "";
                }
                },
            rejected: (state, action) => {
            state.errorMessage =
            action.payload || "Failed to add or update attendee.";
            state.successMessage = "";
            }
            }
            ),            

        updateAttendeeStatus: create.asyncThunk(
            async (payload, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/event/updateAttendeeStatus/${payload?.eventId}/event`,
                        payload
                    );
                    const message = res.data?.message;
                    toast.success(message);
                    return res.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || "Failed to update attendee status.";
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    state.event = action.payload.event;
                    state.successMessage = action.payload?.message || "";
                    state.errorMessage = "";
                },
                rejected: (state, action) => {
                    state.errorMessage =
                        action.payload || "Failed to update attendee status.";
                    state.successMessage = "";
                }
            }
        ),

        removeAttendee: create.asyncThunk(
            async ({ eventId, data }, thunkApi) => {
                try {
                    const res = await axios.post(
                        `http://127.0.0.1:8080/event/removeAttendee/${eventId}/event`,
                        data
                    );
                    const message = res.data?.message;
                    toast.success(message);
                    return res.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || "Failed to remove attendee.";
                    toast.error(message);
                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    state.event = Object.assign(state.event || {}, action.payload);
                    state.successMessage = action.payload?.message || "";
                    state.errorMessage = "";
                },
                rejected: (state, action) => {
                    state.errorMessage = action.payload || "Failed to remove attendee.";
                    state.successMessage = "";
                }
            }
        ),

        getEventById: create.asyncThunk(
          async (id, thunkApi) => {
            console.log(id);
            try {
              const res = await axios.get(
                `http://127.0.0.1:8080/event/getEventById/${id}/event`
              );
              const message = res.data?.message;
              if (message) {
                toast.success(message);
              }
              return res.data;
            } catch (error) {
              const message =
                error.response?.data?.message || "Failed to load event.";
              toast.error(message);
              return thunkApi.rejectWithValue(message);
            }
          },
          {
            fulfilled: (state, action) => {
              state.singleEvent = action.payload;
              state.successMessage = action.payload?.message || "";
              state.errorMessage = "";
            },
            rejected: (state, action) => {
              state.errorMessage = action.payload || "Failed to load event.";
              state.successMessage = "";
            }
          }
        ),

        getAllEvents: create.asyncThunk(
            async (_, thunkApi) => {
                try {
                    const res = await axios.get(
                        "http://127.0.0.1:8080/event/getAllEvents/event"
                    );
                    const message = res.data?.message;

                    return res.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || "Failed to load events.";

                    return thunkApi.rejectWithValue(message);
                }
            },
            {
                fulfilled: (state, action) => {
                    state.events = Array.isArray(action.payload?.events)
                        ? action.payload.events
                        : [];
                    state.successMessage = action.payload?.message || "";
                    state.errorMessage = "";
                },                  
                rejected: (state, action) => {
                    state.errorMessage = action.payload || "Failed to load events.";
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

          deleteEvent: create.asyncThunk(
            async (eventId, thunkApi) => {
              try {
                const res = await axios.post(
                  `http://127.0.0.1:8080/event/deleteEvent/${eventId}/event`
                );
          
                const message = res.data?.message;
                toast.success(message);
          
                return { eventId, ...res.data };
              } catch (error) {
                const message =
                  error.response?.data?.message || "Failed to delete event.";
          
                toast.error(message);
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                state.events = state.events.filter(
                  (event) => event._id !== action.payload.eventId
                );
          
                if (state.event?._id === action.payload.eventId) {
                  state.event = {};
                }
          
                state.successMessage = action.payload?.message || "";
                state.errorMessage = "";
              },
          
              rejected: (state, action) => {
                state.errorMessage = action.payload || "Failed to delete event.";
                state.successMessage = "";
              }
            }
          ),
          
      

    })
})


export const {

    addEvent,
    updateEvent,
    addAdditionalEventImages,
    deleteAdditionalEventImage,
    updateEventStatus,
    addEventToLocation,
    removeEventFromLocation,
    addOrUpdateAttendee,
    updateAttendeeStatus,
    removeAttendee,
    getEventById,
    getAllEvents,
    resetErrorMessage, resetSuccessMessage,
    deleteEvent

} = eventReducers.actions

export default eventReducers.reducer
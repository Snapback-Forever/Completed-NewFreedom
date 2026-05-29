import axios from "axios";
import { createDrawingReducers } from "../creator.js";
import { toast } from "react-hot-toast";

const questBaseURL = "http://127.0.0.1:8080/draw"

const initialState = {
    drawings: [],      
    allDrawings: [],
    successMessage: "",
    errorMessage: "",
  };

const drawingReducer = createDrawingReducers({
    name: "drawing",
    initialState,
    

    reducers: (create) => ({

      makeDrawing: create.asyncThunk(
        async (payload, thunkApi) => {
          try {
      
            const res = await axios.post(
              `http://127.0.0.1:8080/draw/addDrawing/${payload.uploadedBy}/drawing`,
              payload
            );
      
            toast.success(res.data?.message || "Drawing added");
      
            return res.data;
      
          } catch (error) {
      
            const message =
              error.response?.data?.message || "Failed to add drawing";
      
            toast.error(message);
      
            return thunkApi.rejectWithValue(message);
          }
        }
      ),      

          // GET ALL
          getAllDrawings: create.asyncThunk(
            async (_, thunkApi) => {
              try {
                const res = await axios.get(
                  'http://127.0.0.1:8080/draw/getAllDrawings'
                );
                return res.data; // expected to be an array of drawings
              } catch (error) {
                const message =
                  error.response?.data?.message || 'Failed to fetch drawings';
           
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                state.allDrawings = Array.isArray(action.payload) ? action.payload : [];
                state.successMessage = "";
                state.errorMessage = "";
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = '';
                state.allDrawings = [];
              },
            }
          ),

          // UPDATE
          updateDrawing: create.asyncThunk(
            async ({ id, form }, thunkApi) => {
              try {
                const res = await axios.put(
                  `http://127.0.0.1:8080/draw/updateDrawing/${id}`,
                  form
                );
                const message = res.data?.message || 'Drawing updated';
                toast.success(message);
                return res.data;
              } catch (error) {
                const message =
                  error.response?.data?.message || 'Failed to update drawing';
                toast.error(message);
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                const updated = action.payload;
                state.drawings = (state.drawings || []).map((d) =>
                  d._id === updated._id ? updated : d
                );
                state.successMessage =
                  updated?.message || 'Drawing updated';
                state.errorMessage = '';
              },
              rejected: (state, action) => {
                state.errorMessage = action.payload;
                state.successMessage = '';
              },
            }
          ),

          // DELETE
          deleteDrawing: create.asyncThunk(
            async (id, thunkApi) => {
              try {
                const res = await axios.delete(
                  `http://127.0.0.1:8080/draw/deleteDrawing/${id}`
                );
                const message = res.data?.message || 'Drawing deleted';
                toast.success(message);
                return { id, ...res.data };
              } catch (error) {
                const message =
                  error.response?.data?.message || 'Failed to delete drawing';
                toast.error(message);
                return thunkApi.rejectWithValue(message);
              }
            },
            {
              fulfilled: (state, action) => {
                const { id } = action.payload;
                state.drawings = (state.drawings || []).filter(
                  (d) => d._id !== id
                );
                state.successMessage =
                  action.payload?.message || 'Drawing deleted';
                state.errorMessage = '';
              },
              rejected: (state, action) => { 
                state.errorMessage = action.payload;
                state.successMessage = '';
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

makeDrawing,
updateDrawing,
getAllDrawings,
deleteDrawing,
resetErrorMessage, resetSuccessMessage
    

} = drawingReducer.actions

export default drawingReducer.reducer
import { Router } from "express"
import controllers from "../controller/index.js";

const drawingRoutes = Router()


drawingRoutes
  .route("/addDrawing/:uploadedBy/drawing")
  .post(controllers.addDrawing);


drawingRoutes
  .route("/getAllDrawings")
  .get(controllers.getAllDrawings);

drawingRoutes
  .route("/updateDrawing/:id")
  .put(controllers.updateDrawing);

drawingRoutes
  .route("/deleteDrawing/:id")
  .delete(controllers.deleteDrawing);


export default drawingRoutes
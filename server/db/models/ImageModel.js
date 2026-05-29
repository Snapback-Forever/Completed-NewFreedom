import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    filename: String
})

const Image = mongoose.model('image', imageSchema)
export default Image
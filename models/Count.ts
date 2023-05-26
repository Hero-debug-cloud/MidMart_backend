import mongoose from "mongoose";


const CountSchema = new mongoose.Schema({
    name: {
        type: String,
        require:true
    },
    count: {
        type: Number,
        require:true,
        default:0
    }
});

module.exports = mongoose.model("Count", CountSchema);

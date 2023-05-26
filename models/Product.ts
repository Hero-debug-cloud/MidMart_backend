import mongoose from "mongoose";


const ProductSchema = new mongoose.Schema({
    user_id: {
        type: String,
        require:true
    },
    buyer_id: {
        type: String,
        require:true,
        default:""
    },
    product_name: {
        type: String,
        require:true
    },
    product_dis: {
        type: String,
        require:true
    },
    dis_listarray:{
        type:Array,
        require:true
    },
    product_img: {
        type: String,
        require:true
    },
    price: {
        type: Number,
        require:true
    },
    category: {
        type: String,
        require:true
    },
    time:{
        type:String,
        require:true
    },
    stock: {
        type: Number,
        require:true
    },
    university:{
        type:String,
        require:true
    },
    display:{
        type:Boolean,
        default:true
    }
});

module.exports = mongoose.model("Product", ProductSchema);

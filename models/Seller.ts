import mongoose from "mongoose";


const SellerSchema = new mongoose.Schema({
    name: {
        type: String,
        require:true
    },
    username: {
        type: String,
        require:true
    },
    email: {
        type: String,
        require:true
    },
    password: {
        type: String,
        require:true
    }
    ,
    address: {
        type: Array,
        default:[]
    },
    order_list: {
        type: Array,
        default:[]
    },
    product_list: {
        type: Array,
        default:[]
    },
    role: {
        type: "String",
        default:"Seller"
    }
});

module.exports = mongoose.model("Seller", SellerSchema);

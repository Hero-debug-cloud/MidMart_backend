const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        require:true
    },
    lastname: {
        type: String,
        require:true
    },
    email: {
        type: String,
        require:true  
    },
    username: {
        type: String,
        require:true
    },
    password: {
        type: String,
        require:true
    },
    phoneno: {
        type: Number,
        require:true
    },
    address: {
        type:String,
        default:""
    },
    location:{
      type:String,
       default:""
    },
    fav:{
     type:Array,
     default:[]
    },
    cart: {
        type: Array,
        default:[]
    },
    orders: {
        type: Array,
        default:[]
    },
    role: {
        type: Array,
        default:["User"]
    }
});

module.exports = mongoose.model("User", UserSchema);

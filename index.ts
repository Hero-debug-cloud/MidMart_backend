import express, { Request, Response } from "express";
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
dotenv.config();

//importig routing routes;
const auth = require("./routes/auth");
const product_api = require("./routes/product_api");
const user_api = require("./routes/user_api");
const seller_api = require("./routes/seller_api");
const count = require("./routes/count");

//middleware;
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_LINK, { useNewUrlParser: true,useUnifiedTopology:true},
    (err:{err:Error}) => {
        if (err) console.log(err);
        else console.log("Connected to MongoDB");
})

app.get('/',(req:Request,res:Response)=>{
    res.send("hero");
})
app.use("/auth", auth);
app.use("/product", product_api);
app.use("/user", user_api);
app.use("/seller", seller_api);
app.use("/count",count);


app.listen(8000, () => {
    console.log("Server is live!!");
})


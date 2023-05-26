import { Request, Response } from "express";
const router = require("express").Router();

//Importing model for this product routes;
const User = require("../models/User");
const Product = require("../models/Product");
//To hide variable
const dotenv = require("dotenv");
//Importing function to authencateToken;
const { authencateToken } = require("../middleware/auth");
//Importing function to authencateRole;
const { authencateRole } = require("../middleware/roles");
const Count = require("../models/Count");

dotenv.config();


//------------------- All Product related Routes------------------------
//getting a specific product using product id of that product
//this is public route anyone can access it 
router.post("/public_product_info",async (req: Request, res: Response) => {
  try {
    //to count no. of calls;
    const count=await Count.findOne({name:"Product"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
    const product = await Product.findOne({ _id: req.body.product_id });
    if (!product) {
      return res.status(404).send("Product not found in the db");
    }
    return res.status(200).send(product);
  } catch (err: unknown) {
    res.status(400).send(err);
  }
});


//getting all products for the admin
router.post("/getproducts",authencateToken,async(req:Request,res:Response)=>{
  try{
    //to count no. of calls;
    const count=await Count.findOne({name:"Product"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
 
    const {name,price}=req.body;
    let products=1;
    if(name==undefined){
      products=await Product.find({display:true}).sort({price});
    }
    else{
      
      products=await Product.find({display:true}).sort({product_name:name});
    }
  
   res.status(200).send(products);
    }
  catch(err){
    res.status(400).send(err);
  }
})

//deleting a particular product;


//getting a specific product using product id of that product
router.post("/product_info", authencateToken,async (req: Request, res: Response) => {
  try {
    //to count no. of calls;
    const count=await Count.findOne({name:"Product"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
    const product = await Product.findOne({ _id: req.body.product_id });
    if (!product) {
      return res.status(404).send("Product not found in the db");
    }
    return res.status(200).send(product);
  } catch (err: unknown) {
    res.status(400).send(err);
  }
});

//inserting a product in the db but only seller will able to do that: will do that later on morning probablly;
router.post("/inserting_product", authencateToken,async (req: Request, res: Response) => {
  try {
    //to count no. of calls;
    const count=await Count.findOne({name:"Product"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
    //month and date of the product;
    const monthNames = [
      "Jan",
      "Feb",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];

    const d = new Date();
    const month = monthNames[d.getMonth()];
    const date=d.getDate();
    const time=month+" "+date;
    

    const {
      user_id,
      product_name,
      product_dis,
      dis_listarray,
      product_img,
      price,
      category,
      stock,
      university
    } = req.body;

    //default img;
    const default_img="https://source.unsplash.com/random/100*200/?"+product_name;

    const newproduct = new Product({
      user_id,
      product_name,
      product_dis,
      product_img:default_img,
      price,
      category,
      stock,
      dis_listarray,
      time,
      university
    });
    try {
      await newproduct.save();
      return res.status(200).send("Save Successfully");
    } catch (err: unknown) {
      return res.status(400).send(err);
    }
  } catch (err: unknown) {
    res.status(400).send(err);
  }
});

//deleting any product from the database;
//only seller of this product can delete this product or admin;
router.post("/delete_product", async (req: Request, res: Response) => {
  try {
    //to count no. of calls;
    const count=await Count.findOne({name:"Product"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
    await Product.deleteOne({ _id: req.body.product_id });
    return res.status(200).send("Successfully Deleted...");
  } catch (err: unknown) {
    return res.status(400).send(err);
  }
});
//only seller of this product can delete this product or admin;
router.post("/delete_product_all", async (req: Request, res: Response) => {
  try {
    //to count no. of calls;
    const count=await Count.findOne({name:"Product"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
    await Product.deleteMany({ user_id: req.body.user_id });
    return res.status(200).send("Successfully Deleted...");
  } catch (err: unknown) {
    return res.status(400).send(err);
  }
});

//finding elements using cateogry;
router.post("/findby_category", async (req: Request, res: Response) => {
  const min = req.body.min;
  const max = req.body.max;
  try {
    //to count no. of calls;
    const count=await Count.findOne({name:"Product"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
   
    const products = await Product.find({
      category: req.body.category,
      price: { $gte: min, $lte: max },
    })
      .limit(req.body.limit)
      .skip(req.body.skip);
    res.status(200).send(products);
  } catch (err) {
    res.status(400).send(err);
  }
});

//getting similar product and not returning that one product;
router.post("/similar", async (req: Request, res: Response) => {
  try {
    //to count no. of calls;
    const count=await Count.findOne({name:"Product"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
    const id = req.body.product_id;
    
    const similar = await Product.find({
      // trying to exclude the product id of a product, failed;
      $and: [
        { category: req.body.category }
      ],
    }).limit(req.body.limit);

    res.status(200).send(similar);
  } catch (err) {
    return res.status(400).send(err);
  }
});

//searching product from the search box;
router.post("/searchbox", async (req: Request, res: Response) => {
  const min = req.body.min;
  const max = req.body.max;
  try {

    //to count no. of calls;
    const count=await Count.findOne({name:"Product"});
    count.count+=1;
    count.save();
    // end to count no. of calls;

    const products = await Product.find({
      product_name: { "$regex": req.body.product_name, "$options": "i" },
      price: { $gte: min, $lte: max },
    });
    
    return res.status(200).send(products);
  } catch (err) {
    res.status(400).send(err);
  }
});

//updating any value of the product from the db;
// only seller of this product and admin can update the product;
router.put("/update_product/:id", async (req: Request, res: Response) => {
  try {
    //to count no. of calls;
    const count=await Count.findOne({name:"Product"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
    const id = req.params.id;
    const updatadata = req.body;
    const option = { new: true };
    Product.findByIdAndUpdate(id, updatadata, option, (err: unknown) => {
      if (err) return res.status(401).send(err);
      else return res.status(200).send("updatation done");
    });
  } catch (err: unknown) {
    return res.status(400).send("Something is wrong here");
  }
});


//updating profile of the user from the admin;
router.post("/updatingproductfromadmin",async(req:Request,res:Response)=>{
  const {product_id,product_name,product_dis,price}=req.body;
  try{
    //to count no. of calls;
    const count=await Count.findOne({name:"Product"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
    Product.findByIdAndUpdate(product_id, {
     product_name,product_dis,price
    }, (err: unknown) => {
      if (err) return res.status(401).send(err);
      else return res.status(200).send("updatation done");
  });
  }
  catch(err:any){
      res.status(400).send(err);
  }
})
//updating display to false;
router.post("/updatingdisplayfalse",authencateToken,async(req:Request,res:Response)=>{
  const {product_id}=req.body;
  try{
    //to count no. of calls;
    const count=await Count.findOne({name:"Product"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
    Product.findByIdAndUpdate(product_id, {
     display:false,
     buyer_id:req.body.user_id
    }, (err: unknown) => {
      if (err) return res.status(401).send(err);
      else return res.status(200).send("updatation done");
  });
  }
  catch(err:any){
      res.status(400).send(err);
  }
})

//updating display to true;
router.post("/updatingdisplaytrue",async(req:Request,res:Response)=>{
  const {product_id}=req.body;
  try{
    //to count no. of calls;
    const count=await Count.findOne({name:"Product"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
    Product.findByIdAndUpdate(product_id, {
     display:true
    }, (err: unknown) => {
      if (err) return res.status(401).send(err);
      else return res.status(200).send("updatation done");
  });
  }
  catch(err:any){
      res.status(400).send(err);
  }
})
//sending products ids of the group of ids for cart ;
router.post("/cartinfo",authencateToken,async (req: Request, res: Response) => {
  try {
    //to count no. of calls;
    const count=await Count.findOne({name:"Product"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
    const details = await Product.find({ _id: { $in: req.body.ids } });
    res.status(200).send(details);
  } catch (err) {
    res.status(400).send(err);
  }
});


//sending products ids of the group of ids for cart ;
router.post("/admin_cartinfo",async (req: Request, res: Response) => {
  try {
    //to count no. of calls;
    const count=await Count.findOne({name:"Product"});
    count.count+=1;
    count.save();

    const details = await Product.find({ _id: { $in: req.body.ids } });
    // console.log("this is result"+details);
    res.status(200).send(details);
  } catch (err) {
    res.status(400).send(err);
  }
});

//sending products details to display in the admin panel;
router.post("/admin_orderproducts",authencateToken,async (req: Request, res: Response) => {
  try {
    //to count no. of calls;
    const count=await Count.findOne({name:"Product"});
    count.count+=1;
    count.save();

    const {name,price}=req.body;
    let products=1;

    

    if(name==undefined){
      products = await Product.find({display:false}).sort({price});
    }
    else{

      products = await Product.find({display:false}).sort({product_name:name});
    }

  
    res.status(200).send(products);
  } catch (err) {
    res.status(400).send(err);
  }
});



module.exports = router;

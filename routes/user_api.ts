import {Request,Response } from "express";
const router = require("express").Router();

//importing model for this product routes;
// const Seller=require("../models/Seller")
const User=require("../models/User");
const Product = require("../models/Product");
const { authencateToken } = require("../middleware/auth");
const {authencateRole}=require('../middleware/roles')
const Count = require("../models/Count");


//working on this...............................

//------------------- All Seller related Routes------------------------

// admin can access all sellers information.

//getting all users ;
router.post("/getusers",authencateToken,authencateRole(["User","Admin"]),async(req:Request,res:Response)=>{
  try{
   
    //to count no. of calls;
    const count=await Count.findOne({name:"User"});
    count.count+=1;
    count.save();
    // end to count no. of calls;

  
    const {name}=req.body;

    const users=await User.find({}).sort({firstname:name});
    return res.status(200).send(users);
    }
  catch(err:any){
      res.status(400).send(err);
  }
})

//deleting a particular user
router.post("/deleteuser",async(req:Request,res:Response)=>{
  try{
    //to count no. of calls;
    const count=await Count.findOne({name:"User"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
     await User.deleteOne({_id:req.body.user_id});
     res.status(200).send("done");
    }
  catch(err:any){
      res.status(400).send(err);
  }
})


//getting orders for the the user;
router.post("/getorders",async(req:Request,res:Response)=>{
  try{
    //to count no. of calls;
    const count=await Count.findOne({name:"User"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
    const users=await User.find({});
    return res.status(200).send(users);
    
  }catch(err){
    res.status(400).send(err);
  }
})

//get information of a particular user;
router.post("/getuser",authencateToken,async(req:Request,res:Response)=>{
  try{
    //to count no. of calls;
    const count=await Count.findOne({name:"User"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
    const user=await User.findOne({_id:req.body.user_id});
    if(!user){
       return res.status(401).send("User not found in the db...");
    }
    return res.status(200).send(user);
  }
  catch(err:any){
      res.status(400).send(err);
  }
})

//updating profile of the user from the post;
router.post("/updatinguserfrompost",authencateToken,async(req:Request,res:Response)=>{
  const {firstname,email,phoneno,location,address,user_id}=req.body;
  try{
    //to count no. of calls;
    const count=await Count.findOne({name:"User"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
    User.findByIdAndUpdate(user_id, {
     firstname,email,phoneno,location,address
    }, (err: unknown) => {
      if (err) return res.status(401).send(err);
      else return res.status(200).send("updatation done");
  });
  }
  catch(err:any){
      res.status(400).send(err);
  }
})
//updating profile of the user from the admin;
router.post("/updatinguserfromadmin",async(req:Request,res:Response)=>{
  const {username,firstname,lastname,email,address,user_id}=req.body;
  try{
    //to count no. of calls;
    const count=await Count.findOne({name:"User"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
    User.findByIdAndUpdate(user_id, {
     firstname,lastname,email,username,address
    }, (err: unknown) => {
      if (err) return res.status(401).send(err);
      else return res.status(200).send("updatation done");
  });
  }
  catch(err:any){
      res.status(400).send(err);
  }
})


//add product_id to the user cart;
router.post("/addtocart",authencateToken,async(req:Request,res:Response)=>{
    try{
      //to count no. of calls;
    const count=await Count.findOne({name:"User"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
      User.findByIdAndUpdate(req.body.user_id, {
        $push:{cart:req.body.product_id}
      }, (err: unknown) => {
        if (err) return res.status(401).send(err);
        else return res.status(200).send("updatation done");
    });
    }
    catch(err:any){
        res.status(400).send(err);
    }
})

//add product_id to the user fav;
router.post("/addtofav",authencateToken,async(req:Request,res:Response)=>{
    try{
      //to count no. of calls;
    const count=await Count.findOne({name:"User"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
      User.findByIdAndUpdate(req.body.user_id, {
        $push:{fav:req.body.product_id}
      }, (err: unknown) => {
        if (err) return res.status(401).send(err);
        else return res.status(200).send("updatation done");
    });
    }
    catch(err:any){
        res.status(400).send(err);
    }
})

//add product_id to the user order;
router.post("/addtoorder",authencateToken,async(req:Request,res:Response)=>{
    try{
      //to count no. of calls;
    const count=await Count.findOne({name:"User"});
    count.count+=1;
    count.save();
    // end to count no. of calls;


    //check if that particular product is available or not;
    const product=await Product.findOne({_id:req.body.product_id});
    console.log("my display is"+product);
    if(product.display==true){
      User.findByIdAndUpdate(req.body.user_id, {
        $push:{orders:req.body.product_id}
      }, (err: unknown) => {
        if (err) return res.status(401).send(err);
        else return res.status(200).send("updatation done");
    });
    }
    else{
      console.log("i am here!!");
      return res.status(499).send("product is solded!!");
    }
    }
    catch(err:any){
        res.status(400).send(err);
    }
})


//remove product_id from the user cart;
router.post("/removefromcart",authencateToken,async(req:Request,res:Response)=>{
    try{
      //to count no. of calls;
    const count=await Count.findOne({name:"User"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
      User.findByIdAndUpdate(req.body.user_id, {
        $pull:{cart:req.body.product_id}
      }, (err: unknown) => {
        if (err) return res.status(401).send(err);
        else return res.status(200).send("updatation done");
    });
    }
    catch(err:any){
        res.status(400).send(err);
    }
})
//remove product_id from the user fav;
router.post("/removefromfav",authencateToken,async(req:Request,res:Response)=>{
    try{
      //to count no. of calls;
    const count=await Count.findOne({name:"User"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
      User.findByIdAndUpdate(req.body.user_id, {
        $pull:{fav:req.body.product_id}
      }, (err: unknown) => {
        if (err) return res.status(401).send(err);
        else return res.status(200).send("updatation done");
    });
    }
    catch(err:any){
        res.status(400).send(err);
    }
})
//remove product_id from the user order;
router.post("/removefromorder",authencateToken,async(req:Request,res:Response)=>{
    try{
      //to count no. of calls;
    const count=await Count.findOne({name:"User"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
      User.findByIdAndUpdate(req.body.user_id, {
        $pull:{orders:req.body.product_id}
      }, (err: unknown) => {
        if (err) return res.status(401).send(err);
        else return res.status(200).send("updatation done");
    });
    }
    catch(err:any){
        res.status(400).send(err);
    }
})

//remove product_id from the user order admin;
router.post("/removefromorderadmin",async(req:Request,res:Response)=>{
    try{
      //to count no. of calls;
    const count=await Count.findOne({name:"User"});
    count.count+=1;
    count.save();
    
    // end to count no. of calls;
      User.findByIdAndUpdate(req.body.user_id, {
        $pull:{orders:req.body.product_id}
      }, (err: unknown) => {
        if (err) return res.status(401).send(err);
        else return res.status(200).send("updatation done");
    });
    }
    catch(err:any){
        res.status(400).send(err);
    }
})
//remove product_id from the user order;

//find a way to to addd user id to the product;

router.post("/admin_removefromorder",authencateToken,async(req:Request,res:Response)=>{
    try{
      //to count no. of calls;
    const count=await Count.findOne({name:"User"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
      User.findByIdAndUpdate(req.body.user_id, {
        $pull:{orders:req.body.product_id}
      }, (err: unknown) => {
        if (err) return res.status(401).send(err);
        else return res.status(200).send("updatation done");
    });
    }
    catch(err:any){
        res.status(400).send(err);
    }
})

//checking if a product id is present in the cart or not;
router.post("/checkcart",authencateToken,async(req:Request,res:Response)=>{
  try{
    //to count no. of calls;
    const count=await Count.findOne({name:"User"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
       const done=await User.find({cart:{$in:req.body.product_id}},{_id:req.body.product_id});
       if(!done){
        return res.status(200).send("absent");
       }
       return res.status(200).send(done);
  }
  catch(err){
    return res.status(400).send(err);
  };
})

//checking if a product id is present in the fav or not;
router.post("/checkfav",authencateToken,async(req:Request,res:Response)=>{
  try{
    //to count no. of calls;
    const count=await Count.findOne({name:"User"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
       const done=await User.find({fav:{$in:req.body.product_id}},{_id:req.body.product_id});
       if(!done){
        return res.status(200).send("absent");
       }
       return res.status(200).send(done);
  }
  catch(err){
    return res.status(400).send(err);
  };
})

//getting array of the user cart;
router.post("/getcart",authencateToken,async(req:Request,res:Response)=>{
  try{
    //to count no. of calls;
    const count=await Count.findOne({name:"User"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
    const user=await User.findOne({_id:req.body.user_id});

    if(!user){
      return res.status(401).send("User not found in the db!")
    }
    return res.status(200).send(user.cart);
  }catch(err){
    res.status(400).send(err);
  }
})
//getting array of the user fav;
router.post("/getfav",authencateToken,async(req:Request,res:Response)=>{
  try{
    //to count no. of calls;
    const count=await Count.findOne({name:"User"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
    const user=await User.findOne({_id:req.body.user_id});

    if(!user){
      return res.status(401).send("User not found in the db!")
    }
    return res.status(200).send(user.fav);
  }catch(err){
    res.status(400).send(err);
  }
})
//getting array of the user order;
router.post("/getorder",authencateToken,async(req:Request,res:Response)=>{
  try{
    //to count no. of calls;
    const count=await Count.findOne({name:"User"});
    count.count+=1;
    count.save();
    // end to count no. of calls;
    const user=await User.findOne({_id:req.body.user_id});

    if(!user){
      return res.status(401).send("User not found in the db!")
    }
    return res.status(200).send(user.orders);
  }catch(err){
    res.status(400).send(err);
  }
})

module.exports = router;
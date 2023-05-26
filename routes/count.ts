import {Request,Response } from "express";
const router = require("express").Router();



// const Product = require("../models/Product");
const { authencateToken } = require("../middleware/auth");
const Count = require("../models/Count");

router.post("/counting",async(req:Request,res:Response)=>{
  try{
    const count=await Count.find({});

    res.status(200).send(count);
  }
  catch(err){
    console.log(err);
  }
})

module.exports = router;
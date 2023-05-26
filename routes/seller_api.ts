import {NextFunction,Request,Response } from "express";
const router = require("express").Router();

//importing function to authencateRole;
const { authencateRole } = require("../middleware/roles");



//importing model for this product routes;
const Seller=require("../models/Seller")

const { authencateToken } = require("../middleware/auth");


//working on this...............................

//------------------- All Seller related Routes------------------------

// admin can access all sellers information.


//getting information of all sellers;  access admin

//giving access to admin only;

router.get("/all_sellers",authencateRole(["Admin"]), async(req: Request, res: Response) => {
        try {
            const all_seller = await Seller.find({});
            if (!all_seller) return res.status(104).send("No Seller found in the db");
            return res.status(200).send(all_seller);
        } catch (err: unknown) {
            res.status(400).send(err);
        }

    
})


//getting specific seller information : access : admin  : done
router.get("/seller_info",authencateToken,authencateRole(["Admin","Seller"]), async (req: Request, res: Response) => {
    try {
        const seller = await Seller.findOne({ _id: req.body.seller_id });
        if (!seller) {
            return res.status(404).send("Seller not found in the db");
        }
        return res.status(200).send(seller);
    } catch (err: unknown) {
        res.status(400).send(err);
    }
});



//deleting any product from the database;
//only admin can delete a seller, access : admin;
router.delete("/delete_seller",authencateToken,authencateRole(["Admin"]), async (req: Request, res: Response) => {
    try {
        await Seller.deleteOne({ _id: req.body.seller_id });
        return res.status(200).send("Successfully Deleted Seller...");
    } catch (err: unknown) {
        return res.status(400).send(err);
    }
})


//updating any value of the product from the db;
// only seller of this product and admin can update the product;
router.put("/update_seller/:seller_id",authencateToken,authencateRole(["Admin","Seller"]),async (req: Request, res: Response) => {
    try {
        const id = req.params.seller_id;
        const updatadata = req.body;
        const option = { new: true };
        Seller.findByIdAndUpdate(id, updatadata, option, (err: unknown) => {
            if (err) return res.status(401).send(err);
            else return res.status(200).send("updatation done");
        });
    } catch (err: unknown) {
        return  res.status(400).send("Something is wrong here");
    }
})




// adding order to the seller list;
router.put("/adding_order",authencateToken,async (req: Request, res: Response) => {
    try {
        const seller = await Seller.findOne({ id: req.body.seller_id });
        if (!seller) return res.status(401).send("Seller not found!!");
        await seller.updateOne({ $push: { order_list: {"user_id":req.body.user_id,"product_id": req.body.product_id } } });
        res.status(200).send("Order added to the list");

    } catch (err: unknown) {
        res.status(400).send(err);
    }
})






// deleting order from the seller list;
router.put("/delete_order", async (req: Request, res: Response) => {
    try {
        const seller = await Seller.findOne({ id: req.body.seller_id });
        if (!seller) return res.status(401).send("Seller not found");
        await seller.updateOne({ $pull: { order_list: {} } });
        res.status(200).send("Order deleted from the list");
    } catch (err: unknown) {
        res.status(400).send(err);
    }
})




module.exports = router;
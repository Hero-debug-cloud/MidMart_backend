import { Request, Response } from "express";
const router = require("express").Router();
const User = require("../models/User");
const Seller = require("../models/Seller");
const Count = require("../models/Count");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { authencateToken } = require("../middleware/auth");

//checking for the user authencation with jwt token;
router.get(
  "/token_check",
  authencateToken,
  async (req: Request, res: Response) => {
    const user = await User.findOne({ _id: req.body.user_id });
    res.status(200).send(user);
  }
);

//registering User;
router.post("/register_user", async (req: Request, res: Response) => {
  const passcode = "herovinay";
  try {
    const {
      firstname,
      lastname,
      email,
      username,
      password,
      phoneno,
      special_pass,
    } = req.body;
    const user = await User.findOne({ username: username });
    //to count no. of calls;
    const count = await Count.findOne({ name: "Auth" });
    count.count += 1;
    count.save();
    // end to count no. of calls;
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const newpassword = await bcrypt.hash(password, salt);
      const newuser = new User({
        firstname,
        lastname,
        email,
        username,
        password: newpassword,
        phoneno,
      });
      await newuser.save((err: Error) => {
        if (err) return res.status(400).send(err);
        else {
          if (passcode == special_pass) {
            console.log(newuser._id);
            const option = { new: true };
            const updatadata = {
              role: ["User", "Admin"],
            };
            User.findByIdAndUpdate(
              newuser._id,
              updatadata,
              option,
              (err: unknown) => {
                if (err) return res.status(401).send(err);
              }
            );
          }
          return res.status(200).json("Done");
        }
      });
    } else {
      return res.status(403).send("User Already Exists...");
    }
  } catch (err) {
    return res.status(400).send(err);
  }
});

// User Login
router.post("/login_user", async (req: Request, res: Response) => {
  try {
    //to count no. of calls;
    const count = await Count.findOne({ name: "Auth" });
    count.count += 1;
    count.save();
    // end to count no. of calls;
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).send("Username Not found in the database");
    }
    const check_pass = await bcrypt.compare(password, user.password);
    if (!check_pass) {
      return res.status(401).send("Password Does not match...");
    }
    const token_content = {
      id: user._id,
      role: user.role,
    };
    const token = jwt.sign(token_content, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    //just sending jwt token in frontend;
    return res.status(200).send(token);

    //for storing jwt token in cookie;
    // return res.status(200).cookie("jwttoken", token).send("done bro");
  } catch (err) {
    return res.status(400).send(err);
  }
});

//registering Seller in the db;
router.post("/register_seller", async (req: Request, res: Response) => {
  try {
    //to count no. of calls;
    const count = await Count.findOne({ name: "Auth" });
    count.count += 1;
    count.save();
    // end to count no. of calls;
    const { name, email, username, password, address } = req.body;
    const seller = await Seller.findOne({ username: username });
    if (!seller) {
      const salt = await bcrypt.genSalt(10);
      const newpassword = await bcrypt.hash(password, salt);
      const newseller = new Seller({
        name,
        email,
        username,
        password: newpassword,
        address,
      });
      await newseller.save((err: Error) => {
        if (err) return res.status(400).send(err);
        else return res.status(200).json("Done");
      });
    } else {
      return res.status(403).send("Seller Already Exists...");
    }
  } catch (err) {
    return res.status(400).send(err);
  }
});

//Seller Login
router.post("/login_seller", async (req: Request, res: Response) => {
  try {
    //to count no. of calls;
    const count = await Count.findOne({ name: "Auth" });
    count.count += 1;
    count.save();
    // end to count no. of calls;
    const { username, password } = req.body;
    const seller = await Seller.findOne({ username: username });
    if (!seller) {
      return res.status(401).send("Seller Not found in the database");
    }
    const check_pass = await bcrypt.compare(password, seller.password);
    if (!check_pass) {
      return res.status(401).send("Password Does not match...");
    }
    const token_content = {
      id: seller._id,
      role: seller.role,
    };
    const token = jwt.sign(token_content, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    //just sending jwt token in frontend;
    return res.status(200).send(token);

    //for storing jwt token in cookie;
    // return res.status(200).cookie("jwttoken", token).send("done bro");
  } catch (err) {
    return res.status(400).send(err);
  }
});
module.exports = router;

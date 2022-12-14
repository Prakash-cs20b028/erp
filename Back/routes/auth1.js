const jwt = require("jsonwebtoken");
const express = require("express");
const { rawListeners } = require("../models/FacsignupSchema");
const router = express.Router();
const bcrypt = require("bcryptjs");

require("../db/connec1");
const Employ = require("../models/FacsignupSchema");

router.get("/", (req, res) => {
  res.send("Hello from server of router");
});

router.post("/register1", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(422).json({ error: " fill all details properly " });
  }

  try {
    const userExist = await Employ.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email alraedy exist" });
    } else if (password != password) {
      return res.status(422).json({ error: "password is not matching" });
    } else {
      const employ = new Employ({ name, email, phone, password });

      // hashing the password

      await employ.save();

      res.status(201).json({ message: "success" });
    }
  } catch (err) {
    console.log(err);
  }

  // console.log(name);
  //res.json({message : req.body.name})
  //res.send("mera register page")
});

router.post("/signin1", async (req, res) => {
  // console.log(req.body);
  // res.json({message : "ok"})
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ error: "fill data" });
    }

    const userLogin = await Employ.findOne({ email: email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      token = await userLogin.generateAuthToken();
      console.log(token);

      if (!isMatch) {
        res.status(422).json({ error: "Invalid Credentials" });
      } else {
        res.json({ message: "user1 Signin Successful" });
      }
    } else {
      res.status(422).json({ error: "Invalid Credential" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

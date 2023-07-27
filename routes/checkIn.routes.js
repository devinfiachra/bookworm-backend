const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const fileUploader = require("../config/cloudinary.config");

const CheckIn = require("../models/CheckIn.model");
const User = require("../models/User.model");

const secretKey = process.env.TOKEN_SECRET;


function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401).json({ error: "Server"});
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user; // Store the user information in the request object for further use if needed.
    next();
  });
}

router.post("/uploadImg", fileUploader.single("imageUrl"), (req, res, next) => {

  if (req.file) {
    res.status(200).json(req.file.path)  
  } else {
    next(new Error("No file uploaded"))
    return;
  }
});

router.post("/uploadAudio", fileUploader.single("audioUrl"), (req, res, next) => {
  if (req.file) {
    res.status(200).json(req.file.path)  
  } else {
    next(new Error("No file uploaded"))
    return;
  }
});

router.post("/updateCheckIn", authenticateToken, async (req, res, next) => {
  try {
    const { mood, imageUrl, audioUrl, diaryEntry } = req.body;
    
    const newCheckIn = new CheckIn({
      mood,
      imageUrl,
      audioUrl,
      diaryEntry,
      user: req.user._id,
    });
    console.log(newCheckIn)

    // Step 2: Save the new CheckIn document to the database
    const savedCheckIn = await newCheckIn.save();

    // Step 3: Obtain the ObjectId of the newly created CheckIn document
    const checkInId = savedCheckIn._id;

    const user = await User.findById(req.user._id);



    // Step 4: Update the checkInId field in the user model
    user.checkInId.push(checkInId); // Assuming checkInId is an array in the User model
    await user.save();
     console.log("req.user:", req.user);
    console.log("checkInId:", checkInId);

    // Step 5: Return the updated CheckIn document
    res.json(savedCheckIn);
  } catch (error) {
    console.error("Error updating check-in:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
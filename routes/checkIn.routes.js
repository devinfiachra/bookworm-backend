const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const fileUploader = require("../config/cloudinary.config");

const CheckIn = require("../models/CheckIn.model");

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
    const { mood, imageUrl, audioUrl, diaryText } = req.body;
    
    const checkInId = req.user.checkInId;
    console.log(checkInId);
    console.log(req.body);
    
    if (!mongoose.Types.ObjectId.isValid(checkInId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }
    
    
    // Find the therapist by ID and update the information.
    const updatedCheckIn = await CheckIn.findByIdAndUpdate(
      checkInId,
      {
        mood,
        imageUrl,
        audioUrl,
        diaryText,
      },
      { new: true } // Return the updated document.
    );

    res.json(updatedCheckIn);
    console.log(updatedCheckIn);
  } catch (error) {
    console.error("Error updating check in:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
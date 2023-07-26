const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const secretKey = process.env.TOKEN_SECRET;

const User = require("../models/User.model");

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
  router.get("/userInfo", authenticateToken, (req, res, next) => {
  // Assuming the user information is stored in req.user.
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    })
    .catch((err) => res.status(500).json({ error: "Server error" }));
});

router.put("/updateUser", authenticateToken, async (req, res, next) => {
  try {
    const { email, name } = req.body;
    
    const userId = req.user._id;
    console.log(req.body);
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }
    
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        
        email,
        name,
      },
      { new: true } // Return the updated document.
    );

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating therapist:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/deleteUser", authenticateToken, (req, res, next) => {
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User.findByIdAndRemove(userId)
    .then(() =>
      res.json({
        message: `Therapist with ${userId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;
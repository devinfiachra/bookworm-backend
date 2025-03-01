const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const chatAPIKey = process.env.OPENAI_API_KEY;

router.use(express.json());

router.post("/completions", async (req, res, next) => {
  try {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chatAPIKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an empathetic companion on an emotional wellbeing app. You offer mental health tips and advice to users based on their prompts. Do not assume the role of a professional and remind them of that.",
          },
          { role: "user", content: req.body.message },
        ],
        max_tokens: 500,
      }),
    };

    // Use dynamic import() to load node-fetch as an ES module
    const fetch = await import("node-fetch");

    const response = await fetch.default(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
});

module.exports = router;
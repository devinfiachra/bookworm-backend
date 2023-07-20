const express = require("express");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");
dotenv.config();

const configuration = new Configuration({
apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const router = express.Router();

router.post("/completions", async (req, res) => {
    console.log("hello");
  try {
    const chatCompletion = await openai.createChatCompletion(
        {
            model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: req.body.message }]
    }, 
    {
        headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    }}   
    );
    console.log(chatCompletion);
    //const data = await response.json();
   // res.send(data);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const router = express.Router();

const configuration = new Configuration({
apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.post("/completions", async (req, res) => {
  try {

    // const chatCompletion = await openai.createChatCompletion(
    //     {
    //         model: "gpt-3.5-turbo",
    //     messages: [{ role: "user", content: req.body.message }]
    // });
    const completion = await openai.createCompletion({
    model: "text-davinci-003",
    max_tokens: 512,
    temperature: 0,
    prompt: req.body.message,
    });
 
    res.send(completion.data.choices[0].text)
  // // data = await response.json();
  // // res.send(data);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
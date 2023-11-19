require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 3001; // or any other free port

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_DALLE_API_KEY,
});

app.post("/generate-image", async (req, res) => {
  try {
    const prompt = req.body.prompt; // Ensure you're getting the prompt from your request body
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    console.log(response.data);
    const imageUrl = response.data[0].url;
    const revisedPrompt = response.data[0].revised_prompt;
    //res.json({ imageUrl: imageUrl });
    res.json({ imageUrl: imageUrl, revisedPrompt: revisedPrompt });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).send("Error generating image");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.post("/api/generate-briefs", async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const { messages } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: 500,
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (e) {
    res.status(500).json({ error: "Erreur OpenAI" });
  }
});

app.listen(3001, () => console.log("API démarrée sur http://localhost:3001"));
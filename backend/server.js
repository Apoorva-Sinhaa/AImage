import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate-image", async (req, res) => {
  const { prompt, n } = req.body;

  try {
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt,
          n: parseInt(n),
          size: "512x512",
          response_format: "b64_json",
        }),
      }
    );

    const data = await response.json();
    res.json({ data: data.data });
  } catch (err) {
    res.status(500).json({ error: "Image generation failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

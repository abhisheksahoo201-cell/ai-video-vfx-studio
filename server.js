import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "Backend Running",
    apiKeyExists: !!process.env.LUMA_API_KEY
  });
});

app.post("/generate-video", async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log("Prompt:", prompt);
    console.log("API Key Found:", !!process.env.LUMA_API_KEY);

    const response = await fetch(
      "https://api.lumalabs.ai/dream-machine/v1/generations",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.LUMA_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: prompt
        })
      }
    );

    const data = await response.json();

    console.log("Status:", response.status);
    console.log("Response:", data);

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

import express from "express";
import "dotenv/config";

const app = express();
const API_KEY = process.env.POKEWALLET_API_KEY;

if (!API_KEY) {
  console.error("Missing POKEWALLET_API_KEY in .env");
  process.exit(1);
}

app.get("/api/search", async (req, res) => {
  const { q } = req.query;

  if (!q || typeof q !== "string") {
    return res.status(400).json({ error: "Missing search query" });
  }

  try {
    const response = await fetch(
      `https://api.pokewallet.io/search?q=${encodeURIComponent(q)}`,
      { headers: { "X-API-Key": API_KEY } }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Upstream error" });
    }

    res.json(await response.json());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Pokémon data" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
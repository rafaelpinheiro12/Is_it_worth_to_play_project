const express = require('express');
const router = express.Router();
const axios = require('axios');

const igdb_key = process.env.IGDB_API_KEY;
const twitch_client_id = process.env.TWITCH_CLIENT_ID;

// Get IGDB access token
async function getIGDB_AccessToken() {
  const url = "https://id.twitch.tv/oauth2/token";

  const res = await axios.post(url, null, {
    params: {
      client_id: twitch_client_id,
      client_secret: igdb_key,
      grant_type: "client_credentials",
    },
  });
  return res.data.access_token;
}

// Get game suggestions for autocomplete using IGDB
const searchInputHandler = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: "Query must be at least 2 characters" });
    }

    // Get access token
    const token = await getIGDB_AccessToken();

    // Search IGDB for games
    const response = await axios.post(
      "https://api.igdb.com/v4/games",
      `search "${query.trim()}"; fields id, name, cover.image_id, first_release_date; limit 10;`,
      {
        headers: {
          "Client-ID": twitch_client_id,
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    // Transform IGDB response to match frontend expected format
    const results = response.data.map((game) => ({
      id: game.id,
      name: game.name,
      background_image: game.cover?.image_id 
        ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
        : null,
      release_date: game.first_release_date
        ? new Date(game.first_release_date * 1000).toISOString().split("T")[0]
        : null,
    }));

    console.log(`Found ${results.length} suggestions for: ${query}`);
    
    return res.status(200).json({
      results: results,
      count: results.length
    });

  } catch (error) {
    console.error("Error fetching game suggestions:", error.message);
    return res.status(500).json({ 
      error: "Failed to fetch suggestions",
      message: error.message 
    });
  }
};

module.exports = { searchInputHandler };
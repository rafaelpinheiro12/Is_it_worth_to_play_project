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
      `search "${query.trim()}"; fields id, name, cover.image_id; limit 10;`,
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
    }));

    console.log(`Found ${results.length} suggestions for: ${query}`);
    // Mark source and disable caching
    res.set('X-Search-Source', 'igdb');
    res.set('Cache-Control', 'no-store');

    return res.status(200).json({
      results: results,
      count: results.length,
      source: 'igdb'
    });

  } catch (error) {
    console.error("Error fetching game suggestions:", error.message);
    // Mark source and disable caching even on error for debugging
    res.set('X-Search-Source', 'igdb');
    res.set('Cache-Control', 'no-store');
    return res.status(500).json({ 
      error: "Failed to fetch suggestions",
      message: error.message,
      source: 'igdb'
    });
  }
};

module.exports = { searchInputHandler };
const express = require('express');
const router = express.Router();
const axios = require('axios');

const RAWG_BASE_URL = "https://api.rawg.io/api";
const rawg_key = process.env.RAWG_API_KEY;

// Get game suggestions for autocomplete
const searchInputHandler = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: "Query must be at least 2 characters" });
    }

    const response = await axios.get(`${RAWG_BASE_URL}/games`, {
      params: {
        key: rawg_key,
        search: query.trim(),
        page_size: 10,
      }
    });

    console.log(`Found ${response.data.results.length} suggestions for: ${query}`);
    
    return res.status(200).json({
      results: response.data.results,
      count: response.data.count
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
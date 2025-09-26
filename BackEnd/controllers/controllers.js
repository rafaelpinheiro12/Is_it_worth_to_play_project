const axios = require('axios');
const { json } = require('express');
const { get } = require('mongoose');
let rawg_key =process.env.RAWG_API_KEY;
let igdb_key = process.env.IGDB_API_KEY;
let twitch_client_id = process.env.TWITCH_CLIENT_ID;

const RAWG_BASE_URL = "https://api.rawg.io/api";

const fetchGame = async (req, res) => {
  const { gameName } = req.body;
  if (!gameName) {
	return res.status(400).json({ error: "Game name is required" });
  }
  const rawg_game = await getGame_RAWG(gameName);
  if (rawg_game) {
	return res.status(200).json(rawg_game);
  } else {
	return res.status(404).json({ error: "Game not found" });
  }
}

async function getGame_RAWG(gameName) {
  try {
    const response = await axios.get(`${RAWG_BASE_URL}/games?search=${gameName}`, {
      params: {
        key: rawg_key,
        page: 1,       // optional: page number
        page_size: 1, // optional: how many results per page
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching games:", error.response?.data || error.message);
  }
}

/* async function getIGDB_AcessToken(){
	const url = "https://id.twitch.tv/oauth2/token";

  const res = await axios.post(url, null, {
    params: {
      client_id: twitch_client_id,
      client_secret: igdb_key,
      grant_type: "client_credentials"
    }
  });
  console.log(res.data.access_token);
  return res.data.access_token;
  
}

async function getGame_IGDB(gameName) {
	const token = await getIGDB_AcessToken();

  const res = await axios.post(
    "https://api.igdb.com/v4/games",
    `search "${gameName}"; fields id, name; limit 5;`,
    {
      headers: {
        "Client-ID": "YOUR_CLIENT_ID",
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });
	  console.log(res.data);
} */

	module.exports = { 
		fetchGame
	}
const axios = require("axios");
const { json } = require("express");
const { get } = require("mongoose");
let rawg_key = process.env.RAWG_API_KEY;
let igdb_key = process.env.IGDB_API_KEY;
let twitch_client_id = process.env.TWITCH_CLIENT_ID;
const GameData = require("../models/models.js");

const RAWG_BASE_URL = "https://api.rawg.io/api";

const fetchRAWGGame = async (req, res, gameTitle) => {
  const gameName = req?.body?.gameName || gameTitle;
  if (!gameName) {
    return res.status(400).json({ error: "Game name is required" });
  }
  const rawg_game = await getGame_RAWG(gameName);
  if (rawg_game) {
    console.log("Game found:", rawg_game);
    return res.status(200).json({ rawg_game });
  } else {
    return res.status(404).json({ error: "Game not found" });
  }
};

const fetchIGDBGame = async (req, res, gameTitle) => {
  const gameName = req?.body?.gameName || gameTitle;
  if (!gameName) {
    return res.status(400).json({ error: "Game name is required" });
  }
  // Check if game data already exists in the database before making API call and sets igdbdata response to that
  const response = await GameData.find({ gameName: gameName });
  if (response[0] && response[0].timeStamp > Date.now() - 604800000) {
    return res.status(200).json(response[0]);
  }
  const igdb_game = await getGameIGDB(gameName);
  if (igdb_game) {
    console.log("Game found:", igdb_game);
    return res.status(200).json({ igdb_game });
  } else {
    return res.status(404).json({ error: "Game not found" });
  }
};

async function getGame_RAWG(gameName) {
  try {
    const response = await axios.get(
      `${RAWG_BASE_URL}/games?search=${gameName}`,
      {
        params: {
          key: rawg_key,
          page: 1, // optional: page number
          page_size: 1, // optional: how many results per page
        },
      }
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching games:",
      error.response?.data || error.message
    );
  }
}

async function getIGDB_AcessToken() {
  const url = "https://id.twitch.tv/oauth2/token";

  const res = await axios.post(url, null, {
    params: {
      client_id: twitch_client_id,
      client_secret: igdb_key,
      grant_type: "client_credentials",
    },
  });
  console.log(res.data.access_token);
  return res.data.access_token;
}

async function getGameIGDB(gameName) {
  const token = await getIGDB_AcessToken();

  const res = await axios.post(
    "https://api.igdb.com/v4/games",
    `search "${gameName}"; fields id, name, summary, genres.name, platforms.name, first_release_date, cover, artworks; limit 5;`,
    {
      headers: {
        "Client-ID": twitch_client_id,
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  const coverURL = await axios.post(
    "https://api.igdb.com/v4/covers",
    `fields url; where id = (${res?.data[0]?.cover});`,
    {
      headers: {
        "Client-ID": twitch_client_id,
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  const artworks = await axios.post(
    "https://api.igdb.com/v4/artworks",
    `fields url; where id = (${res?.data[0]?.artworks});`,
    {
      headers: {
        "Client-ID": twitch_client_id,
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  console.log(artworks.data);
  console.log(coverURL);
  if (coverURL.data.length === 0) return null;
  return { game: res.data[0].name, cover: coverURL.data[0].url };
}

async function getGameSharkDeals(req, res) {
  var config = {
    method: "get",
    maxBodyLength: Infinity,
    url:
      "https://www.cheapshark.com/api/1.0/games?title=" +
      req.query.gameName +
      "&limit=5&exact=0",
    headers: {},
  };

  axios(config)
    .then(function (response) {
      console.log(response.data);
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

module.exports = {
  fetchRAWGGame,
  fetchIGDBGame,
  getGameSharkDeals,
};

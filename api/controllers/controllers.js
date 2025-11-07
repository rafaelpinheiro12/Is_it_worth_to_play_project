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
  const gameId = req?.body?.gameId;

  if (!gameId && !gameName) {
    return res.status(400).json({ error: "Game identifier is required" });
  }

  let cachedGame = null;

  if (gameId) {
    cachedGame = await GameData.findOne({ igdbId: gameId });
  }

  if (!cachedGame && !gameId && gameName) {
    cachedGame = await GameData.findOne({ gameName: gameName });
  }

  if (cachedGame) {
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
    const lastUpdated = cachedGame.timeStamp instanceof Date ? cachedGame.timeStamp.getTime() : new Date(cachedGame.timeStamp).getTime();

    if (!Number.isNaN(lastUpdated) && lastUpdated > Date.now() - oneWeekInMs) {
      return res.status(200).json(cachedGame);
    }

    await GameData.deleteOne({ _id: cachedGame._id });
  }

  const igdb_game = await getGameIGDB({ gameId, gameName });
  if (igdb_game) {
    console.log("Game found:", igdb_game);
    return res.status(200).json({ igdb_game });
  } else {
    return res.status(200).json({ igdb_game: null }); // IGDB does not have data for all games, so we return null if not found
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

async function getGameIGDB({ gameId, gameName }) {
  const token = await getIGDB_AcessToken();

  const fields = `fields id, name, cover.image_id,
    age_ratings,aggregated_rating,aggregated_rating_count,alternative_names,
    artworks,bundles,category,checksum,collection,collections,cover,created_at,dlcs,
    expanded_games,expansions,external_games,first_release_date,follows,forks,
    franchise,franchises,game_engines,game_localizations,game_modes,game_status,
    game_type,genres,hypes,involved_companies,keywords,language_supports,
    multiplayer_modes,parent_game,platforms,player_perspectives,ports,rating,
    rating_count,release_dates,remakes,remasters,screenshots,similar_games,slug,
    standalone_expansions,status,storyline,summary,tags,themes,
    total_rating,total_rating_count,updated_at,url,version_parent,version_title,videos,websites;`;

  const query = gameId
    ? `${fields} where id = ${gameId}; limit 1;`
    : `search "${gameName}"; ${fields} limit 5;`;

  const res = await axios.post(
    "https://api.igdb.com/v4/games",
    query,
    {
      headers: {
        "Client-ID": twitch_client_id,
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  if (!res?.data?.length) {
    return null;
  }

  const primary = res.data[0];
  if (!primary?.cover?.image_id) {
    return null;
  }

  const coverURL = `https://images.igdb.com/igdb/image/upload/t_cover_big/${primary.cover.image_id}.jpg`;
  console.log(coverURL);
  return { id: primary.id, game: primary.name, cover: coverURL, data: res.data };
}

module.exports = {
  fetchRAWGGame,
  fetchIGDBGame,
};

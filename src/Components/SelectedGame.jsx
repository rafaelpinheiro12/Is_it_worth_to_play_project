import { useState, useEffect, use } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import {
  selectedGameAtom,
  igdbDataAtom,
  aiDataAtom,
  rawgDataAtom,
} from "../State/state";
import { useParams } from "react-router";
import { URL } from "../config";

function SelectedGame({ selectedGame }) {
  const [game, setGame] = useAtom(selectedGameAtom); // obj with all game name from rawg
  const [igdbData, setIgdbData] = useAtom(igdbDataAtom); // obj with all game info from igdb
  const [rawgData, setRawgData] = useAtom(rawgDataAtom);
  const [aiData, setAiData] = useAtom(aiDataAtom); // obj with all ai response info
  const [isLoading, setIsLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  if (!selectedGame && !game) {
    const { gameName } = useParams();
    setGame({ name: gameName });
  }

  // Main effect that handles the entire data fetching flow
  useEffect(() => {
    const fetchGameData = async () => {
      const currentGameName = selectedGame?.name || game?.name;
      const currentGameId = selectedGame?.id || game?.id;

      if (!currentGameName || isLoading) return;

      // Only update if the game has actually changed
      //if (game?.name === selectedGame.name) return;

      setIsLoading(true);
      console.log("Starting fetch for:", currentGameName);

      try {
        // Reset previous data
        setIgdbData(null);
        setAiData(null);
        setAiError(null);

        // Fetch IGDB data
        const igdbResponse = await axios.post(
          `${URL}/fetchGame/fetchIGDBGame`,
          {
            gameId: currentGameId,
            gameName: currentGameName,
          }
        );
        if (igdbResponse?.data.error) {
          setIgdbData(null);
        } else {
          if (igdbResponse?.data?.aiData) {
            // igdbResponse contains aiData already if its on the database
            console.log(igdbResponse.data);
            setIgdbData(igdbResponse?.data?.igdbData);
            setRawgData(igdbResponse.data.rawgData);
            setAiData(igdbResponse.data.aiData);
            setIsLoading(false);
            return; // If AI data is already present, skip fetching again
          }
          setIgdbData(igdbResponse.data);
        }

        const resolvedGameId =
          currentGameId ||
          igdbResponse?.data?.igdbId ||
          igdbResponse?.data?.igdb_game?.id ||
          igdbResponse?.data?.igdb_game?.data?.[0]?.id ||
          igdbResponse?.data?.data?.[0]?.id;

        if (!currentGameId && resolvedGameId) {
          setGame((prev) => ({ ...(prev || {}), name: currentGameName, id: resolvedGameId }));
        }

        // Fetch RAWG data
        const rawgResponse = await axios.post(
          `${URL}/fetchGame/fetchRAWGGame`,
          {
            gameName: currentGameName,
          }
        );
        if (!rawgData) {
          setRawgData(rawgResponse.data.rawg_game);
        }

        // Fetch AI response using the fresh IGDB data
        const aiResponse = await axios.post(
          `${URL}/fetchGame/getAIResponse`,
          {
            gameId: resolvedGameId,
            gameName: currentGameName,
            igdbData: igdbResponse?.data || null,
            rawgData: rawgResponse?.data?.rawg_game || null,
          }
        );
        setAiData(aiResponse.data);

        const verdict = aiResponse?.data?.worth_playing;
        if (!verdict || verdict === "AI analysis not available") {
          setAiError("It seems that something went wrong. This could be a problem with our APIs connections. Please try again shortly.");
        }
      } catch (error) {
        console.error("Error fetching game data:", error);
        setAiError("It seems that something went wrong. This could be a problem with our APIs connections. Please try again shortly.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameData();
  }, [selectedGame, game]); // Depend on selected game reference changes

  return (
    <div>
      {aiError && (
        <div className="ai-error-overlay">
          <div className="ai-error-modal">
            <h3 className="ai-error-title">Something went wrong</h3>
            <p className="ai-error-message">{aiError}</p>
            <button className="ai-error-dismiss" onClick={() => setAiError(null)}>
              Dismiss
            </button>
          </div>
        </div>
      )}
      {selectedGame && (
        <div>
          {isLoading ? (<text>Loading game data...</text>) : (
            <>
              <div className="game_info_container">
                <aside className="game_cover">
                  <img
                    className="game_cover_img"
                    src={
                      !igdbData?.igdb_game 
                        ? rawgData?.results[0]?.background_image
                        : igdbData?.igdb_game?.cover
                        ? igdbData.igdb_game.cover
                        : null
                    }
                    alt={`${selectedGame.name} cover image`}
                  />
                </aside>
                <main className="game_info">
                  <header className="game_header">
                    <div className="game_title">
                      <text>
                        {aiData?.title ? aiData.title : selectedGame.name}
                      </text>
                    </div>
                    <div className="game_devs_pub">
                      <text>
                        Developer:{" "}
                        {aiData?.developer
                          ? aiData.developer
                          : "AI analysis not available"}
                      </text>
                      <text>
                        Publisher:{" "}
                        {aiData?.publisher
                          ? aiData.publisher
                          : "AI analysis not available"}
                      </text>
                    </div>
                  </header>

                  {aiData?.worth_playing && (
                    <div className="pros_cons" style={{ width: "100%" }}>
                      <text>Verdict:</text>
                      <p style={{ margin: 0 }}>{aiData.worth_playing}</p>
                    </div>
                  )}

                  <section className="game_time_to_beat">
                    <text>
                      Time to beat Story:{" "}
                      {aiData?.time_to_beat?.main_story?.min &&
                      aiData?.time_to_beat?.main_story?.max
                        ? aiData.time_to_beat.main_story.min +
                          " - " +
                          aiData.time_to_beat.main_story.max +
                          " hours"
                        : "AI analysis not available"}
                    </text>
                    <text>
                      Time to beat Extras:{" "}
                      {aiData?.time_to_beat?.extras?.min &&
                      aiData?.time_to_beat?.extras?.max
                        ? aiData.time_to_beat.extras.min +
                          " - " +
                          aiData.time_to_beat.extras.max +
                          " hours"
                        : "AI analysis not available"}
                    </text>
                    <text>
                      Time to beat Completionist:{" "}
                      {aiData?.time_to_beat?.completionist?.min &&
                      aiData?.time_to_beat?.completionist?.max
                        ? aiData.time_to_beat.completionist.min +
                          " - " +
                          aiData.time_to_beat.completionist.max +
                          " hours"
                        : "AI analysis not available"}
                    </text>
                  </section>

                  <section className="game_critic_stuff">
                    <text>
                      Critic Score :{" "}
                      {aiData?.critic_score?.score
                        ? aiData.critic_score.score
                        : "AI analysis not available"}
                    </text>
                    <text>
                      Critic Summary :{" "}
                      {aiData?.critic_score?.summary
                        ? aiData.critic_score.summary
                        : "AI analysis not available"}
                    </text>
                  </section>

                  <section className="game_player_sentiment">
                    <div className="pros_cons">
                      <text>Player Sentiment - Pros :</text>
                      <ul>
                        {aiData?.player_sentiment?.pros
                          ? aiData.player_sentiment.pros.map((pro, index) => (
                              <li key={index}>{pro}</li>
                            ))
                          : "AI analysis not available"}
                      </ul>
                    </div>
                    <div className="pros_cons">
                      <text>Player Sentiment - Cons :</text>
                      <ul>
                        {aiData?.player_sentiment?.cons
                          ? aiData.player_sentiment.cons.map((con, index) => (
                              <li key={index}>{con}</li>
                            ))
                          : "AI analysis not available"}
                      </ul>
                    </div>
                  </section>

                  <section className="game_price_stuff">
                    <text>
                      Price Range:{" "}
                      {aiData?.price?.range
                        ? aiData.price.range
                        : "AI analysis not available"}
                    </text>
                    <text>
                      Price Deals:{" "}
                      {aiData?.price?.deals
                        ? aiData.price.deals
                        : "AI analysis not available"}
                    </text>
                  </section>

                  <section className="game_platform_stuff">
                    <text>
                      Preferred Platform:{" "}
                      {aiData?.most_preferred_platform?.platform
                        ? aiData.most_preferred_platform.platform
                        : "AI analysis not available"}
                    </text>
                    <text>
                      Reason:{" "}
                      {aiData?.most_preferred_platform?.reason
                        ? aiData.most_preferred_platform.reason
                        : "AI analysis not available"}
                    </text>
                  </section>

                  {aiData?.not_recommended_platforms?.lenght && (
                    <text>
                      Not Recommended Platforms: {aiData.not_recommended_platforms}
                    </text>
                  )}
                </main>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SelectedGame;

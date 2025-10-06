import { useState, useEffect, use } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { selectedGameAtom, igdbDataAtom, aiDataAtom, rawgDataAtom } from "../State/state";
import { useParams } from "react-router";

function SelectedGame({ selectedGame }) {
  const [game, setGame] = useAtom(selectedGameAtom); // obj with all game name from rawg
  const [igdbData, setIgdbData] = useAtom(igdbDataAtom); // obj with all game info from igdb
  const [rawgData, setRawgData] = useAtom(rawgDataAtom);
  const [aiData, setAiData] = useAtom(aiDataAtom); // obj with all ai response info
  const [isLoading, setIsLoading] = useState(false);

  console.log(rawgData, "rawgData");
  if (!selectedGame && !game) {
    const { gameName } = useParams();
    setGame({ name: gameName });
  }

  // Main effect that handles the entire data fetching flow
  useEffect(() => {
    const fetchGameData = async () => {
      if (!selectedGame?.name || isLoading) return;

      // Only update if the game has actually changed
      //if (game?.name === selectedGame.name) return;

      setIsLoading(true);
      console.log("Starting fetch for:", selectedGame.name);

      try {
        // Reset previous data
        setIgdbData(null);
        setAiData(null);

        // Fetch IGDB data
        const igdbResponse = await axios.post(
          "http://localhost:4444/fetchGame/fetchIGDBGame",
          {
            gameName: game.name,
          }
        );
        if(igdbResponse?.data.error){
          setIgdbData(null);
        }else{
          if (igdbResponse?.data?.aiData) { // igdbResponse contains aiData already if its on the database
          setIgdbData(igdbResponse?.data?.igdbData?.igdb_game);
          setRawgData(igdbResponse.data.rawgData);
          setAiData(igdbResponse.data.aiData);
          setIsLoading(false);
          return; // If AI data is already present, skip fetching again
        }
        setIgdbData(igdbResponse.data);
        }

        // Fetch RAWG data
        const rawgResponse = await axios.post(
          "http://localhost:4444/fetchGame/fetchRAWGGame",
          {
            gameName: game.name,
          })          
          if(!rawgData){
            setRawgData(rawgResponse.data.rawg_game);
          }
             
        // Fetch AI response using the fresh IGDB data
        const aiResponse = await axios.post(
          "http://localhost:4444/fetchGame/getAIResponse",
          {
            gameName: game.name,
            igdbData: igdbResponse?.data || null,
            rawgData: rawgResponse?.data?.rawg_game || null,
          }
        );
        setAiData(aiResponse.data);
      } catch (error) {
        console.error("Error fetching game data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameData();
  }, [game.name]); // Only depend on the game name changing

  return (
    <div>
      {selectedGame && (
        <div>
          <h2>{selectedGame.name}</h2>
          {isLoading ? (
            <p>Loading game data...</p>
          ) : (
            <>
              <p>
                IGDB Data:{" "}
                {igdbData ? JSON.stringify(igdbData) : "No IGDB data available"}
              </p>
              <p>AI Data: {aiData ? "AI Data here" : "No AI data available"}</p>
              <div className="game_info_container">
                <div className="game_cover">
                  <img className="game_cover_img"
                    src={!igdbData ? rawgData?.results[0]?.background_image : igdbData?.igdb_game?.cover ? igdbData?.igdb_game.cover : null}  
                    alt={`${selectedGame.name} cover image`}
                  />
                </div>
                <div className="game_info">
                  <div className="game_title">
                  <p>
                    Game Name:{" "}
                    {aiData?.title ? aiData.title : "AI analysis not available"}
                  </p>
                  </div>
                  <div className="game_devs_pub">
                    <p>
                      Developer:{" "}
                      {aiData?.developer ? aiData.developer : "AI analysis not available"}
                    </p>
                    <p>
                      Publisher:{" "}
                      {aiData?.publisher ? aiData.publisher : "AI analysis not available"}
                    </p>
                  </div>
                  <div className="game_time_to_beat">
                  <p>
                    Time to beat Story:{" "}
                    {aiData?.time_to_beat.main_story?.min && aiData?.time_to_beat.main_story?.max
                      ? aiData.time_to_beat.main_story.min + " - " + aiData.time_to_beat.main_story.max + " hours"
                      : "AI analysis not available"}
                  </p>
                  <p>
                  Time to beat Extras:{" "}
                  {aiData?.time_to_beat.extras?.min && aiData?.time_to_beat.extras?.max
                      ? aiData.time_to_beat.extras.min + " - " + aiData.time_to_beat.extras.max + " hours"
                      : "AI analysis not available"}
                  </p>
                  <p>
                  Time to beat Completionist:{" "}
                  {aiData?.time_to_beat.completionist?.min && aiData?.time_to_beat.completionist?.max
                      ? aiData.time_to_beat.completionist.min + " - " + aiData.time_to_beat.completionist.max + " hours"
                      : "AI analysis not available"}
                  </p>   
                  </div>
                  <div className="game_critic_stuff">
                  <p>
                    Critic Score :{" "}
                    {aiData?.critic_score?.score
                      ? aiData.critic_score.score
                      : "AI analysis not available"}
                  </p>
                  <p>
                    Critic Summary :{" "}
                    {aiData?.critic_score?.summary
                      ? aiData.critic_score.summary
                      : "AI analysis not available"}
                  </p>
                  </div>
                  <div>
                  <p>Player Sentiment - Pros :</p>
                  <ul>
                    {aiData?.player_sentiment?.pros
                      ? aiData.player_sentiment.pros.map((pro, index) => (
                          <li key={index}>{pro}</li>
                        ))
                      : "AI analysis not available"}  
                  </ul>
                  </div>
                  <div>
                  <p>Player Sentiment - Cons :</p>
                  <ul>
                    {aiData?.player_sentiment?.cons
                      ? aiData.player_sentiment.cons.map((con, index) => (
                          <li key={index}>{con}</li>
                        ))
                      : "AI analysis not available"}  
                  </ul>
                  </div>
                  <p>
                    Price Range :{" "}
                    {aiData?.price?.range ? aiData.price.range : "AI analysis not available"}
                  </p>
                  <p>
                    Price Deals :{" "}
                    {aiData?.price?.deals ? aiData.price.deals : "AI analysis not available"}
                  </p>
                  <p>
                    Preferred Platform :{" "}
                    {aiData?.most_preferred_platform?.platform
                      ? aiData.most_preferred_platform.platform
                      : "AI analysis not available"}
                  </p>
                  <p>
                    Reason :{" "}
                    {aiData?.most_preferred_platform?.reason
                      ? aiData.most_preferred_platform.reason
                      : "AI analysis not available"}
                  </p>
                  <p>
                    Not Recommended Platforms :{" "}
                    {aiData?.not_recommended_platforms
                      ? JSON.stringify(aiData.not_recommended_platforms)
                      : "AI analysis not available"}
                  </p>
                  <p>
                    {aiData?.worth_playing 
                      ? aiData.worth_playing
                      : "AI analysis not available"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SelectedGame;

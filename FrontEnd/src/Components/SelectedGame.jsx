import { useState, useEffect, use } from 'react'
import axios from 'axios'
import {useAtom} from 'jotai'
import {selectedGameAtom, igdbDataAtom, aiDataAtom} from '../State/state'
import {useParams} from 'react-router'

function SelectedGame({selectedGame}) {

    const [game, setGame] = useAtom(selectedGameAtom); // obj with all game name from rawg
    const [igdbData, setIgdbData] = useAtom(igdbDataAtom); // obj with all game info from igdb
    const [aiData, setAiData] = useAtom(aiDataAtom); // obj with all ai response info
    const [isLoading, setIsLoading] = useState(false);

       if (!selectedGame) {
        const {gameName} = useParams();
        setGame ({name: gameName});
    }

    // Main effect that handles the entire data fetching flow
    useEffect(() => {
        const fetchGameData = async () => {
            if (!selectedGame?.name || isLoading) return;

            // Only update if the game has actually changed
            //if (game?.name === selectedGame.name) return;

            setIsLoading(true);
            console.log('Starting fetch for:', selectedGame.name);

            try {


                // Reset previous data
                setIgdbData(null);
                setAiData(null);

                // Fetch IGDB data
                const igdbResponse = await axios.post('http://localhost:4444/fetchGame/fetchIGDBGame', {
                    gameName: game.name
                });
                setIgdbData(igdbResponse.data);

                // Fetch AI response using the fresh IGDB data
                const aiResponse = await axios.post('http://localhost:4444/fetchgame/getAIResponse', {
                    gameName: game.name,
                    igdbData: !igdbData || !igdbResponse.data ? {} : igdbData,
                    rawgData: game
                });
                setAiData(aiResponse.data);

            } catch (error) {
                console.error('Error fetching game data:', error);
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
                        <p>IGDB Data: {igdbData ? JSON.stringify(igdbData) : 'No IGDB data available'}</p>
                        <p>AI Data: {aiData ? 'AI Data here' : 'No AI data available'}</p>
                        <div className='game_info_container'>
                            <div className='game_cover'>
                            <img src={igdbData?.igdb_game?.cover || 'photo not found'} alt="game cover" />
                            </div>
                            <div>
                            <p>Game Name: {aiData ? aiData.name : 'AI analysis not available'}</p>
                            <div className='game_devs_pub'>
                            <p>Developer: {aiData ? aiData.developer : 'AI analysis not available'}</p>
                            <p>Publisher: {aiData ? aiData.publisher : 'AI analysis not available'}</p>
                            </div>
                            <p>Time to beat : {aiData ? aiData.time_to_beat.main_story.min : 'AI analysis not available'}</p>
                            <p>Critic Score : {aiData ? aiData.critic_score.score : 'AI analysis not available'}</p>
                            <p>Critic Summary : {aiData ? aiData.critic_score.summary : 'AI analysis not available'}</p>
                            <p>Player Sentiment - Pros : {aiData ? aiData.player_sentiment.pros : 'AI analysis not available'}</p>
                            <p>Player Sentiment - Cons : {aiData ? aiData.player_sentiment.cons : 'AI analysis not available'}</p>
                            <p>Price Range : {aiData ? aiData.price.range : 'AI analysis not available'}</p>
                            <p>Price Deals : {aiData ? aiData.price.deals : 'AI analysis not available'}</p>
                            <p>Preferred Platform : {aiData ? aiData.most_preferred_platform.platform : 'AI analysis not available'}</p>
                            <p>Reason : {aiData ? aiData.most_preferred_platform.reason : 'AI analysis not available'}</p>
                            <p>Not Recommended Platforms : {aiData ? JSON.stringify(aiData.not_recommended_platforms) : 'AI analysis not available'}</p>
                            <p>{aiData ? aiData.worth_playing : 'AI analysis not available'}</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        )}
    </div>
  )
}

export default SelectedGame

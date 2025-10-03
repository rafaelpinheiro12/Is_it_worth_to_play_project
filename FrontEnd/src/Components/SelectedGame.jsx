import { useState, useEffect, use } from 'react'
import axios from 'axios'
import {useAtom} from 'jotai'
import {selectedGameAtom, igdbDataAtom, aiDataAtom} from '../State/state'
import {useParams} from 'react-router'

function SelectedGame({selectedGame}) {

    if (!selectedGame) {
        const {gameName} = useParams();
        selectedGame = {name: gameName};
    }

    const [game, setGame] = useState(''); // obj with all game name from rawg
    const [igdbData, setIgdbData] = useAtom(igdbDataAtom); // obj with all game info from igdb
    const [aiData, setAiData] = useAtom(aiDataAtom); // obj with all ai response info
    const [isLoading, setIsLoading] = useState(false);

    // Main effect that handles the entire data fetching flow
    useEffect(() => {
        const fetchGameData = async () => {
            if (!selectedGame?.name || isLoading) return;

            // Only update if the game has actually changed
            if (game?.name === selectedGame.name) return;

            setIsLoading(true);
            console.log('Starting fetch for:', selectedGame.name);

            try {

                // Update the game object
                setGame(selectedGame);

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
                    igdbData: igdbResponse.data,
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
    }, [selectedGame?.name]); // Only depend on the game name changing

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
                        <div>
                            <p>AI Data: {aiData ? 'AI Data here' : 'No AI data available'}</p>
                            <img src={igdbData?.igdb_game?.cover || 'photo not found'} alt="game cover" />
                            <p>{aiData ? aiData.worth_playing : 'AI analysis not available'}</p>
                        </div>
                    </>
                )}
            </div>
        )}
    </div>
  )
}

export default SelectedGame

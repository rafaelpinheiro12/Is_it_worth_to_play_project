import { useState, useEffect, use } from 'react'
import axios from 'axios'
import {useAtom} from 'jotai'
import {selectedGameAtom, igdbDataAtom, aiDataAtom} from '../State/state'

function SelectedGame({selectedGame}) {

    const [game, setGame] = useAtom(selectedGameAtom);
    const [igdbData, setIgdbData] = useAtom(igdbDataAtom);
    const [aiData, setAiData] = useAtom(aiDataAtom);

    useEffect(() => {
        setGame(selectedGame);
    }, [selectedGame]);

    const fetchIGDBGame = async () => {
        try {
          const response = await axios.post('http://localhost:4444/fetchGame/fetchIGDBGame', {gameName: game.name});
          setIgdbData(response.data);
          console.log(response.data);
        } catch (error) {
          console.log(error);
        }
      };

    useEffect(() => {
        if (game) {
            fetchIGDBGame();
        }
    }, [game]);

    const AIresponse = async () => {
        try {
          const response = await axios.post('http://localhost:4444/fetchgame/getAIResponse', {gameName: game.name, igdbData: igdbData, rawgData: game});
          console.log(response.data);
            setAiData(response.data);
        } catch (error) {
          console.log(error);
        }
      };

    useEffect(() => {
        if (igdbData) {
            AIresponse();
        }
    }, [igdbData]);

  return (
    <div>
        {game && (
            <div>
                <h2>{game.name}</h2>
                <p>IGDB Data: {igdbData ? JSON.stringify(igdbData) : 'Loading...'}</p>
                <p>AI Data: {aiData ? JSON.stringify(aiData) : 'Loading...'}</p>
            </div>
        )}
    </div>
  )
}

export default SelectedGame

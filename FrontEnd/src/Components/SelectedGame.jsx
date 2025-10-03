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
                {console.log("IGDB Data in render:", igdbData)}
                {console.log("AI Data in render:", aiData)}
                <div>
                <p>AI Data: {aiData ? 'AI Data here' : 'Loading...'}</p>
                <img src={igdbData ? igdbData.igdb_game.cover : 'photo not found'} alt="igdb cover trust me" />
                <p>{aiData ? aiData.worth_playing : 'Loading...'}</p>
                </div>
            </div>
        )}
    </div>
  )
}

export default SelectedGame

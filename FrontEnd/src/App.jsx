import './App.css'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'

function App() {
  
  const [gameData, setGameData] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [rawgData, setRawgData] = useState(null);
  const [igdbData, setIgdbData] = useState(null);

  const fetchRAWGGame = async () => {
    try {
      const response = await axios.post('http://localhost:4444/fetchGame/fetchRAWGGame', {gameName: inputValue});
      setRawgData(response.data);
      console.log(response.data.rawg_game.results[0].background_image);
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  }

  const fetchIGDBGame = async () => {
    try {
      const response = await axios.post('http://localhost:4444/fetchGame/fetchIGDBGame', {gameName: inputValue});
      //setIgdbData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  }
 
  return (
    <div>
      <form onSubmit={(e) => {e.preventDefault(); fetchIGDBGame();}}>
      <input type="text" onChange={(e) => setInputValue(e.target.value)} />
      <button type="submit">Fetch Game Data</button>
      </form>
      {rawgData && <img src={rawgData?.rawg_game?.results[0]?.background_image}/>}
    </div>
  )
}

export default App

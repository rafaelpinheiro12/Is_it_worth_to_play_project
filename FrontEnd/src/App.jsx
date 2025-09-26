import './App.css'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'

function App() {
  
  const [gameData, setGameData] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [rawgData, setRawgData] = useState(null);
  const [igdbData, setIgdbData] = useState(null);
  console.log(rawgData);
  console.log(igdbData);

  const fetchGame = async () => {
    try {
      const response = await axios.post('http://localhost:4444/fetchGame', {gameName: inputValue});
      setRawgData(response.data.rawg);
      setIgdbData(response.data.igdb);
      console.log(response.data.results[0].background_image);
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  }
 
  return (
    <div>
      <form onSubmit={(e) => {e.preventDefault(); fetchGame();}}>
      <input type="text" onChange={(e) => setInputValue(e.target.value)} />
      <button type="button">Fetch Game Data</button>
      </form>
      {gameData && <img src={gameData?.results[0]?.background_image}/>}
    </div>
  )
}

export default App

import './App.css'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import { URL } from './config'
import * as jose from 'jose'

function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));
  console.log(token);

useEffect(() => {
    const verify_token = async () => {
      try {
        if (!token) {
          setIsLoggedIn(false);
        } else {
          axios.defaults.headers.common["Authorization"] = token;
          const response = await axios.post(`${URL}/users/verify_token`);
          return response.data.ok ? login(token) : logout();
        }
      } catch (error) {
        console.log(error);
      }
    };
    verify_token();
  }, [token]);

  const login = (token) => {
    debugger
    let decodedToken = jose.decodeJwt(token);
    // composing a user object based on what data we included in our token (login controller - jwt.sign() first argument)
    let user = {
      email: decodedToken.userEmail,
    };
    localStorage.setItem("token", JSON.stringify(token));
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user)
    setIsLoggedIn(true);
  };
  
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

   
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
      setIgdbData(response.data);
      console.log(response.data.igdb_game.cover);
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
      {igdbData && <img src={`https:${igdbData?.igdb_game?.cover}`}/>}
      {rawgData && <img src={rawgData?.rawg_game?.results[0]?.background_image}/>}
    </div>
  )
}

export default App

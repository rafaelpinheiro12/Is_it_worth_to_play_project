import './App.css'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import { URL } from './config'
import login from './helpers/login'
import logout from './helpers/logout'
import MainPage from './Views/MainPage'

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
          return response.data.ok ? login(token, setUser, setIsLoggedIn) : logout(setIsLoggedIn);
        }
      } catch (error) {
        console.log(error);
      }
    };
    verify_token();
  }, [token]);

 /*  const fetchRAWGGame = async () => {
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
  } */
 
  return (
    <div>
      <MainPage/>
    </div>
  )
}

export default App

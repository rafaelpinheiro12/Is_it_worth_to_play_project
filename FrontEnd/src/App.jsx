import './App.css'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import { URL } from './config'
import { useAtom } from 'jotai'
import { isLoggedInAtom, userAtom, tokenAtom, selectedGameAtom } from './State/state'
import login from './helpers/login'
import logout from './helpers/logout'
import MainPage from './Views/MainPage'
import NavBar from './Components/NavBar'
import AboutUs_Home from './Views/AboutUs_Home'
import {BrowserRouter as Router, Route, Routes} from 'react-router'
import SelectedGame from './Components/SelectedGame'

function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [user, setUser] = useAtom(userAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [selectedGame, setSelectedGame] = useAtom(selectedGameAtom);


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

  

  return (
    <div>
      <Router>
        <NavBar isLoggedIn={isLoggedIn}/>
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/aboutus" element={<AboutUs_Home/>}/>
          <Route path="/:gameName" element={<SelectedGame selectedGame = {selectedGame}/>}/>
        </Routes> 
      </Router>
    </div>
  )
}

export default App

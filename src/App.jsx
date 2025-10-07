import './App.css'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import { URL } from './config'
import { useAtom } from 'jotai'
import { isLoggedInAtom, userAtom, tokenAtom, selectedGameAtom } from './State/state'
import MainPage from './Views/MainPage'
import NavBar from './Components/NavBar'
import AboutUs_Home from './Views/AboutUs_Home'
import {BrowserRouter as Router, Route, Routes} from 'react-router'
import SelectedGame from './Components/SelectedGame'
import * as jose from 'jose'
import Login from './Views/Login'

function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [user, setUser] = useAtom(userAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [selectedGame, setSelectedGame] = useAtom(selectedGameAtom);

  console.log("App token:", token);
  console.log("App isLoggedIn:", isLoggedIn);
  console.log("App user:", user);

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

    const login = (token) => {
      let decodedToken = jose.decodeJwt(token);
      let user = {
        email: decodedToken.userEmail,
      };
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user)
      setIsLoggedIn(true);
      setToken(token);
    };

    const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };
  

  return (
    <div>
      <Router>
        <NavBar isLoggedIn={isLoggedIn}/>
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/aboutus" element={<AboutUs_Home/>}/>
          <Route path="/user" element={<Login login = {login}/>}/>
          <Route path="/:gameName" element={<SelectedGame selectedGame = {selectedGame}/>}/>
        </Routes> 
      </Router>
    </div>
  )
}

export default App

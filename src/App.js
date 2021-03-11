import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import "./App.css";
import Login from "./Login";
import Home from "./Home";
import Navbar from "./Navbar"
import { getTokenFromUrl } from "./spotify";
import SpotifyWebApi from "spotify-web-api-js";
import { useDataLayerValue } from "./DataLayer";

const spotify = new SpotifyWebApi();

function App() {
  const [state, dispatch] = useDataLayerValue();

  const { user, token } = state;
  useEffect(() => {
      console.log("state: ",state);
    const loggedInUser = localStorage.getItem("user");
    var _token = undefined;
    if (loggedInUser) {
      _token = loggedInUser;
      
      console.log("ALREADY LOGGED IN!");
    }else{
      const hash = getTokenFromUrl();
      console.log("HASH: ",hash);
      window.location.hash = "";
       _token = hash.access_token;
    }
    if (_token) {
      localStorage.setItem('user', _token);
      dispatch({
        type: "SET_TOKEN",
        token: _token,
      });
      
      spotify.setAccessToken(_token);
      spotify.getMe().then((user) => {
        dispatch({
          type: "SET_USER",
          user,
        });
      });
      spotify.getUserPlaylists().then((playlists) => {
        dispatch({
          type: "SET_PLAYLISTS",
          playlists,
        });
      });
      spotify.getPlaylist("37i9dQZF1E34Ucml4HHx1w").then((playlist) => {
        dispatch({
          type: "SET_DISCOVER_WEEKLY",
          discover_weekly: playlist,
        });
      });
      console.log(user)
    }
  }, []);

  return(
    <Router>
      <Navbar />
      <Switch>
      <Route exact path="/">
        <div className="app">{token ? <><Home spotify={spotify} /> </>: <Login />}</div>;
      </Route>
      <Route exact path="/about">
        <About />
      </Route>

    </Switch>
    </Router>
 ) 
}
function About() {
  return <h2>About</h2>;
}
export default App;

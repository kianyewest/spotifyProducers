import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import "./App.css";
import Albums from "./Albums"
import Login from "./Login";
import Home from "./Home";
import Navigation from "./Navigation"
import { getTokenFromUrl } from "./spotify";
import SpotifyWebApi from "spotify-web-api-js";
import { useDataLayerValue } from "./DataLayer";

const spotify = new SpotifyWebApi();

const isLoggedIn = () =>{
  console.log("FUCK YES");
  const storage = localStorage.getItem("user");
  var {_token,_expiry} =  storage ? JSON.parse(storage):{undefined,undefined};    
    return _token && _expiry<(Date.now()/1000);
    
}

function App() {
  const [state, dispatch] = useDataLayerValue();

  const Logout = () => {
    localStorage.clear();
    const [state, dispatch] = useDataLayerValue();
    dispatch({type:"SET_EMPTY"});
  }

  useEffect(() => {
    const storage = localStorage.getItem("user");
    var {_token,_expiry} =  storage ? JSON.parse(storage):{undefined,undefined};

    
    if (_token && _expiry<(Date.now()/1000)) {
      console.log("ALREADY LOGGED IN!");
    }else{
      // console.log("attempt to login",      window.location.hash);

      const hash = getTokenFromUrl();
      window.location.hash = "";
      if(hash.access_token){
        _token = hash.access_token;
        _expiry = (Date.now()/1000)+hash.expires_in;
        // console.log("_expiry",_expiry);
      }
    }
    if (_token) {
      const saveVal = JSON.stringify({_token,_expiry});
      // console.log("saving: ",saveVal);
      localStorage.setItem('user',saveVal );
      dispatch({
        type: "SET_TOKEN",
        token: _token,
        expiry:_expiry,
      });
      
      spotify.setAccessToken(_token);

      // spotify.getMe().then((user) => {
      //   dispatch({
      //     type: "SET_USER",
      //     user,
      //   });
      // });
      // spotify.getUserPlaylists().then((playlists) => {
      //   dispatch({
      //     type: "SET_PLAYLISTS",
      //     playlists,
      //   });
      // });
      // spotify.getPlaylist("37i9dQZF1E34Ucml4HHx1w").then((playlist) => {
      //   dispatch({
      //     type: "SET_DISCOVER_WEEKLY",
      //     discover_weekly: playlist,
      //   });
      // });
      // console.log("at botto")
      //  localStorage.clear();
      //  dispatch({type:"SET_EMPTY"});
    }
    
  }, []);
  

  return(
    <Router>
      <Navigation/>
      <Switch>
      <Route exact path="/">
        <div className="app">{state.token ? <><Home spotify={spotify} /> </>: <Login />}</div>;
      </Route>
      <Route exact path="/about" >
        <About />
      </Route>
      <Route exact path="/albums" onEnter={isLoggedIn}>
        <Albums spotify={spotify} />
      </Route>

    </Switch>
    </Router>
 ) 
}



function About() {
  const [state, dispatch] = useDataLayerValue();
  console.log("ab",);
return <>About: {JSON.stringify(state.user,null,4)}
</>;
}
export default App;

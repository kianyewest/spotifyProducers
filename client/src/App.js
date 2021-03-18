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
import Search from './Search';
import View from './View';
import ViewTrack from "./ViewComponents/ViewTrack";
import ViewArtist from "./ViewComponents/ViewArtist";
import ViewAlbum from './ViewComponents/ViewAlbum';

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
  }
  

  const storage = localStorage.getItem("user");
  var {_token,_expiry} =  storage ? JSON.parse(storage):{undefined,undefined};
  
  if(_expiry<(Date.now()/1000)){
    localStorage.clear();
    dispatch({type:"SET_EMPTY"});
    _token = undefined;
    _expiry = undefined
  }
  useEffect(()=>{
  if (_token) {
    dispatch({
      type: "SET_TOKEN",
      token: _token,
      expiry:_expiry,
    });
    spotify.setAccessToken(_token);
  }else{
    console.log("was not logged in")
    const hash = getTokenFromUrl();
    window.location.hash = "";
    if(hash.access_token){
      _token = hash.access_token;
      _expiry = (Date.now()/1000)+parseInt(hash.expires_in);
      
      const saveVal = JSON.stringify({_token,_expiry});
      localStorage.setItem('user',saveVal );
      dispatch({
        type: "SET_TOKEN",
        token: _token,
        expiry:_expiry,
      });
      
      spotify.setAccessToken(_token);
    }
  }
  

  },[]);
  

  return(
    
    <Router>
     {state.token && <Navigation Logout={Logout}/> }
     {state.token ?
      <Switch>
      
      <Route exact path="/"> <About />
      <div className="app">{state.token ? <Home spotify={spotify} /> : <Login />}</div>;
      </Route>
      <Route exact path="/about" >
        {state.token ? <About /> : <Login />}
      </Route>
      <Route exact path="/albums" onEnter={isLoggedIn}>
        {state.token ? <Albums loginToken={state.token} spotify={spotify} /> : <Login />}
      </Route>
      <Route exact path="/search" onEnter={isLoggedIn}>
        {state.token ? <Search loginToken={state.token} spotify={spotify} /> : <Login />}
      </Route>
      <Route path="/album/:id">
        {state.token ?  <ViewAlbum spotify={spotify}/>: <Login />}
      </Route>
      <Route path="/artist/:id">
        {state.token ? <ViewArtist spotify={spotify}/>: <Login />}
      </Route>
      <Route path="/track/:id" >
        {state.token ? <ViewTrack spotify={spotify}/>: <Login />}
      </Route>
      <Route path="/" >
        <h1>This is not a url :(</h1>
      </Route>

    </Switch>:<Login />}
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

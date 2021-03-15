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

const spotify = new SpotifyWebApi();

const isLoggedIn = () =>{
  console.log("FUCK YES");
  const storage = localStorage.getItem("user");
  var {_token,_expiry} =  storage ? JSON.parse(storage):{undefined,undefined};    
    return _token && _expiry<(Date.now()/1000);
    
}

function App() {
  console.log("APP CALLED")
  const [state, dispatch] = useDataLayerValue();

  const Logout = () => {
    localStorage.clear();
    const [state, dispatch] = useDataLayerValue();
    dispatch({type:"SET_EMPTY"});
  }

  useEffect(() => {

    const storage = localStorage.getItem("user");
    var {_token,_expiry} =  storage ? JSON.parse(storage):{undefined,undefined};
   

    //check token expired
    if(_expiry<(Date.now()/1000)){
      localStorage.clear();
      dispatch({type:"SET_EMPTY"});
      _token = undefined;
      _expiry = undefined
    }

    if (_token) {
      console.log("ALREADY LOGGED IN!");
    }else{
      const hash = getTokenFromUrl();
      window.location.hash = "";
      if(hash.access_token){
        _token = hash.access_token;
        _expiry = (Date.now()/1000)+hash.expires_in;
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
    
  }, []);

  return(
    
    <Router>
      {console.log("in it: ",state)}
     {state.token && <Navigation/> }
      <Switch>
      
      <Route exact path="/">
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
      <Route path="/view/:id" onEnter={isLoggedIn}>
        {state.token ? <View loginToken={state.token} spotify={spotify} /> : <Login />}
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

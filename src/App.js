import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";
import Albums from "./Albums";
import "./App.css";
import { useDataLayerValue } from "./DataLayer";
import Login from "./Login";
import Navigation from "./Navigation";
import NewSearch from './NewSearch';
import ViewAlbum from "./ViewComponents/ViewAlbum";
import ViewArtist from "./ViewComponents/ViewArtist";
import ViewProducer from "./ViewComponents/ViewProducer";
import ViewTrack from "./ViewComponents/ViewTrack";


const spotify = new SpotifyWebApi();


function App() {
  const [state, dispatch] = useDataLayerValue();
  

  const Logout = () => {
    localStorage.clear();
  };

  const storage = localStorage.getItem("user");

  var { access_token, access_expiry } = storage
    ? JSON.parse(storage)
    : { undefined, undefined };

  if (access_expiry < Date.now() / 1000) {
    localStorage.clear();
    dispatch({ type: "SET_EMPTY" });
    access_token = undefined;
    access_expiry = undefined;
  }
 
  useEffect(() => {
    if (access_token) {
      dispatch({
        type: "SET_TOKEN",
        token: access_token,
        expiry: access_expiry,
      });
      spotify.setAccessToken(access_token);
    } else {
      const queryString = window.location.search;
      console.log(window.location)
      const urlParams = new URLSearchParams(queryString);
      const access_token = urlParams.get("access_token");
      const expires_in = urlParams.get("expires_in");

      if (access_token) {
        access_expiry = Date.now() / 1000 + parseInt(expires_in);

        const saveVal = JSON.stringify({ access_token, access_expiry });

        localStorage.setItem("user", saveVal);
        dispatch({
          type: "SET_TOKEN",
          token: access_token,
          expiry: access_expiry,
        });

        spotify.setAccessToken(access_token);
      }
    }
  }, []);

  return (
    <Router>
      {state.token && <Navigation Logout={Logout} spotify={spotify} />}

      {state.token ? (
        <Switch>
          <Route exact path="/">
            <NewSearch  spotify={spotify} />
          </Route>
          <Route exact path="/about">
            <About />
          </Route>
          <Route exact path="/albums" >
            <Albums spotify={spotify} />
          </Route>
          <Route path="/album/:id">
             <ViewAlbum spotify={spotify} /> 
          </Route>
          <Route path="/producer/:geniusArtistId">
             <ViewProducer spotify={spotify} />
          </Route>
          <Route path="/artist/:spotifyArtistId">
             <ViewArtist spotify={spotify} /> 
          </Route>
          <Route path="/track/:id">
             <ViewTrack spotify={spotify} />
          </Route>
          <Route path="/callback">
            <h1>Callback</h1>
          </Route>
          <Route path="/">
            <h1>This is not a url :(</h1>
          </Route>
        </Switch>
      ) : (
        <Login />
      )}
    </Router>
  );
}

function About() {
  const [state, dispatch] = useDataLayerValue();
  return <>About: {JSON.stringify(state.user, null, 4)}</>;
}
export default App;

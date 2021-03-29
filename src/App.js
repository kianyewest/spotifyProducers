import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import Albums from "./Albums";
import Login from "./Login";
import Home from "./Home";
import Navigation from "./Navigation";

import SpotifyWebApi from "spotify-web-api-js";
import { useDataLayerValue } from "./DataLayer";
import Search from "./Search";
import View from "./View";
import ViewTrack from "./ViewComponents/ViewTrack";
import ViewProducer from "./ViewComponents/ViewProducer";
import ViewArtist from "./ViewComponents/ViewArtist";
import ViewAlbum from "./ViewComponents/ViewAlbum";
import { useRouteMatch } from "react-router-dom";
import NewSearch from './NewSearch';

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
          <Route exact path="/search" >
            <Search  spotify={spotify} />
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

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

const spotify = new SpotifyWebApi();

const isLoggedIn = () => {

  const storage = localStorage.getItem("user");
  var { access_token,  access_expiry } = storage
    ? JSON.parse(storage)
    : { undefined, undefined };
  return access_token && access_expiry < Date.now() / 1000;
};

function App() {
  const [state, dispatch] = useDataLayerValue();

  const Logout = () => {
    localStorage.clear();
  };

  const storage = localStorage.getItem("user");

  var { access_token, access_expiry } = storage ? JSON.parse(storage) : { undefined, undefined };

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

      const urlParams = new URLSearchParams(queryString);
      const access_token = urlParams.get("access_token");
      const expires_in = urlParams.get("expires_in")

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
      {state.token && <Navigation Logout={Logout} />}

      {state.token ? (
        <Switch>
          <Route exact path="/">
            {" "}
            <About />
            <div className="app">
              {state.token ? <Home spotify={spotify} /> : <Login />}
            </div>
            ;
          </Route>
          <Route exact path="/about">
            {state.token ? <About /> : <Login />}
          </Route>
          <Route exact path="/albums" onEnter={isLoggedIn}>
            {state.token ? (
              <Albums loginToken={state.token} spotify={spotify} />
            ) : (
              <Login />
            )}
          </Route>
          <Route exact path="/search" onEnter={isLoggedIn}>
            {state.token ? (
              <Search loginToken={state.token} spotify={spotify} />
            ) : (
              <Login />
            )}
          </Route>
          <Route path="/album/:id">
            {state.token ? <ViewAlbum spotify={spotify} /> : <Login />}
          </Route>
          <Route path="/producer/:geniusArtistId">
            {state.token ? <ViewProducer spotify={spotify} /> : <Login />}
          </Route>
          <Route path="/artist/:spotifyArtistId">
            {state.token ? <ViewArtist spotify={spotify} /> : <Login />}
          </Route>
          <Route path="/track/:id">
            {state.token ? <ViewTrack spotify={spotify} /> : <Login />}
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
  console.log("ab");
  return <>About: {JSON.stringify(state.user, null, 4)}</>;
}
export default App;

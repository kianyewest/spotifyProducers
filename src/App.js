import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";
import Albums from "./Albums";
import "./App.css";
import { useDataLayerValue } from "./DataLayer";
import Login from "./Login";
import Navigation from "./Navigation";
import NewSearch from "./NewSearch";
import ViewAlbum from "./ViewComponents/ViewAlbum";
import ViewArtist from "./ViewComponents/ViewArtist";
import ViewProducer from "./ViewComponents/ViewProducer";
import ViewTrack from "./ViewComponents/ViewTrack";

const spotify = new SpotifyWebApi();
const emptyLoginState = {
  access_token: undefined,
  access_expiry: undefined,
  refresh_token: undefined,
  length_token_valid: undefined,
};
function App() {
  const [state, dispatch] = useDataLayerValue();
  const [loginState, setLoginState] = useState(emptyLoginState);
  // const { access_token, access_expiry, refresh_token } = loginState;
  const [loginTimerId, setLoginTimerId] = useState();
  const Logout = () => {
    localStorage.clear();
  };

  useEffect(() => {
    if (loginTimerId) {
      clearTimeout(loginTimerId);
    }
    const timeDiffInMilli = loginState.access_expiry * 1000 - Date.now();

    if (timeDiffInMilli) {
      const timerId = setTimeout(() => {
        fetch(
          "/login/refresh_token?" +
            new URLSearchParams({
              refresh_token: loginState.refresh_token,
            })
        )
          .then((res) => res.json())
          .then((data) => {
            setLoginState((prevState) => {
              const new_access_expiry =
                Date.now() / 1000 + parseInt(prevState.length_token_valid); // time in seconds since epoch
              const val = {
                ...prevState,
                access_token: data.access_token,
                access_expiry: new_access_expiry,
              };
              return val;
            });
          });
      }, Math.max(timeDiffInMilli, 1));

      setLoginTimerId(timerId);
    }
  }, [loginState.access_token]);

  useEffect(() => {
    const storage = localStorage.getItem("user");
    if (loginState.access_token) {
      spotify.setAccessToken(loginState.access_token);
    } else if (storage) {
      const loginData = JSON.parse(storage);
      setLoginState(loginData);
      spotify.setAccessToken(loginData.access_token);
    } else {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const access_token = urlParams.get("access_token");
      const expires_in = urlParams.get("expires_in");
      const refresh_token = urlParams.get("refresh_token");
      if (access_token) {
        const new_access_expiry = Date.now() / 1000 + parseInt(10); // time in seconds since epoch
        const loginData = {
          access_token: access_token,
          access_expiry: new_access_expiry,
          refresh_token: refresh_token,
          length_token_valid: expires_in,
        };
        setLoginState((prevState) => {
          return { ...prevState, ...loginData };
        });
        const saveVal = JSON.stringify(loginData);

        localStorage.setItem("user", saveVal);
        spotify.setAccessToken(access_token);
      }
    }
  }, []);

  return (
    <Router>
      {loginState.access_token && (
        <Navigation Logout={Logout} spotify={spotify} />
      )}

      {loginState.access_token ? (
        <Switch>
          <Route exact path="/">
            <NewSearch spotify={spotify} />
          </Route>
          <Route exact path="/about">
            <h1>About page</h1>
          </Route>
          <Route exact path="/albums">
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

export default App;

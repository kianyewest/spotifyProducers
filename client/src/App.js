import React, { useEffect, useState } from "react";
import {Route, Switch,useHistory } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";
import Albums from "./Albums";
import "./App.css";
import Generate from "./Generate";
import Login, { loginWithoutUser, doRefresh, loadLogin,doLoginWithUrl,prevPageInfoText,doLogOut } from "./Login";
import Navigation from "./Navigation";
import NewSearch from "./NewSearch";
import ViewAlbum from "./ViewComponents/ViewAlbum";
import ViewArtist from "./ViewComponents/ViewArtist";
import ViewProducer from "./ViewComponents/ViewProducer";
import ViewTrack from "./ViewComponents/ViewTrack";
import { AuthContext } from "./Context/context";

const spotify = new SpotifyWebApi();

function App() {
  const { state, dispatch } = React.useContext(AuthContext);
  const [timerId, setTimerId] = useState();
  const history = useHistory();

  const refreshToken = () => {
    //need to refresh token
    if (state.refreshToken) {
      //refresh current user
      doRefresh(dispatch, state.refreshToken);
    } else {
      //get new default token
      loginWithoutUser(dispatch);
    }
  };

  const setTimer = () => {
    if (timerId) {
      clearTimeout(timerId);
    }
    //set Timer to go off, so we can refresh
    const tempTimerId = setTimeout(() => {
      console.log("timeout complete");
      refreshToken();
      spotify.setAccessToken(state.accessToken);
    }, Math.max(state.expiryTime - 60 * 1000 - Date.now(), 1));

    setTimerId(tempTimerId);
  };

  useEffect(() => {
    spotify.setAccessToken(state.accessToken);
  }, [state.accessToken]);

  useEffect(() => {
    if (state.expiryTime) {
      setTimer();
    }
  }, [state.expiryTime]);

  useEffect(() => {
    if(doLoginWithUrl(dispatch)){
      console.log("logged in with url: ")
      //remove the stored saved page
      const prevPageInfo = localStorage.getItem(prevPageInfoText);
      console.log("window.loc: ",window.location)
      if(prevPageInfo){
        console.log("prev :",prevPageInfo);
        // localStorage.clear(prevPageInfoText)
        console.log("prevPageInfo.history: ",prevPageInfo.history)
        const info = JSON.parse(prevPageInfo);
        history.replace(
          info.history
        )
      }else{
        //clear header
        history.replace(history.pathname);
      }
      //check for saved page

    }else if (!loadLogin(dispatch)) {
      //unable to load user, login without user
      loginWithoutUser(dispatch);
    }
  }, []);

  return (
    <>
      {state.accessToken && <Navigation Logout={()=>{doLogOut(dispatch); loginWithoutUser(dispatch);}} spotify={spotify} />}

      {state.accessToken ? (
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
          <Route path="/generate/:type/:id">
            <Generate spotify={spotify} />
          </Route>
          <Route path="/">
            <h1>This is not a url :(</h1>
          </Route>
        </Switch>
      ) : (
        <Login loading={true} />
      )}
   </>
  );
}

export default App;

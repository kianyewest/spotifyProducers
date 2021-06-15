import React, { useEffect, useState } from "react";
import DisplayProducers from "./DisplayProducers";
import { useRouteMatch,useHistory } from "react-router-dom";
import { AuthContext } from "../Context/context";
import useGeniusToSpotify, {
  searchText,
  foundText,
} from "./useGeniusToSpotify";
import DisplayPlaylist from "./DisplayPlaylist";

import SpotifyWebApi from "spotify-web-api-js";
import DisplayOptions from "./DisplayOptions";

import { Button, Dialog, DialogTitle } from "@material-ui/core";

function DisplayResults() {
  const totalRequests = 20;
  const { state, dispatch } = React.useContext(AuthContext);
  const [producersGotten, setProducersGotten] = useState(0);
  const [producers, setProducers] = useState([]);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [noResult,setNoResult] = useState(false);
  const [playlistInfo, setPlaylistInfo] = useState({
    creating: false,
    name: "",
    id: null,
    displayDialog: false,
  });
  const match = useRouteMatch();
  const [geniusToSpotify, setSongsToFind] = useGeniusToSpotify(
    state.accessToken
  );

  const history = useHistory();
  const spotify = new SpotifyWebApi();
  spotify.setAccessToken(state.accessToken);

  const type = (val) => {
    switch (val) {
      case "artist":
        return "spotifyArtistId";
      case "album":
        return "spotifyAlbumId";
      case "track":
        return "spotifyTrackId";
      default:
        return "ERROR";
    }
  };

  useEffect(() => {
    fetch(
      process.env.REACT_APP_BACKEND_LINK +
        "api/getProducers?" +
        new URLSearchParams({
          spotifyAccessToken: state.accessToken,
          [type(match.params.type)]: match.params.id,
        })
    )
      .then((res) => res.json())
      .then((data) => {
        if(data.noResult){
          setProducers([]);
          setProducersGotten(0);
          setNoResult(true);
          return;
        }
        console.log("setting producers to .producers fo this:",data)
        setProducers(data.producers);
        const numberProducers = data.producers.length;

        const songPerProducer = Math.round(totalRequests / numberProducers);
        data.producers.forEach((localProducer) => {
          fetch(
            process.env.REACT_APP_BACKEND_LINK +
              "api/getProducerSongs?" +
              new URLSearchParams({
                geniusProducerId: localProducer.id,
              })
          )
            .then((res) => res.json())
            .then((result) => {
              setProducersGotten((prev) => prev + 1);
              if (result === null) {
                console.log("result was null", result);
                return;
              }
              if (result.songs === null) {
                console.log("result.songs was null", result);
                return;
              }
              //remove null or any empty songs
              const songs = result.songs.filter(Boolean);
              songs.sort((songA, songB) => {
                return songA.stats.pageviews > songB.stats.pageviews ? -1 : 1;
              });

              setSongsToFind(songs.slice(0, songPerProducer));

              //update local variable and set
              localProducer.songs = songs;
              setProducers([...data.producers]);

              setPlaylistSongs((prev) => {
                const names = new Set();
                prev.forEach((song) => names.add(song.id));
                const uniqueSongs = songs
                  .slice(0, songPerProducer)
                  .filter((song) =>
                    !names.has(song.id) ? names.add(song.id) : false
                  );
                return [...prev, ...uniqueSongs];
              });
            });
        });
      })
      .catch((error) => {
        console.log(error);
        window.alert(
          "unable to load data, may need to be logged in?: " +
            JSON.stringify(error)
        );
      });
  }, []);

  useEffect(() => {
    if (producersGotten === producers.length) {
    }
  }, [producersGotten]);

  const spotifyLinksNotLoaded = playlistSongs.filter(
    (song) =>
      geniusToSpotify.hasOwnProperty(song.id) &&
      geniusToSpotify[song.id].status === searchText
  );

  const createPlaylist = async () => {
    setPlaylistInfo((prev) => {
      return { ...prev, creating: true };
    });
    const uris = playlistSongs.flatMap((song) => {
      if (
        geniusToSpotify.hasOwnProperty(song.id) &&
        geniusToSpotify[song.id].status === foundText
      ) {
        return [geniusToSpotify[song.id].song.uri];
      } else {
        return [];
      }
    });
    try {
      const me = await spotify.getMe();
      const result = spotify.createPlaylist(me.id, {
        name: playlistInfo.name ? playlistInfo.name : "Generated Playlist",
      });
      result.then(
        (playlistData) => {
          const playlistId = playlistData.id;
          spotify.addTracksToPlaylist(playlistId, uris).then(
            (data) => {
              setPlaylistInfo((prev) => {
                return {
                  ...prev,
                  id: playlistData,
                  displayDialog: true,
                  creating: false,
                };
              });
            },
            (error) => console.log(error)
          );
        },
        (error) => console.log(error)
      );
    } catch (error) {
      console.log("e", error);
    }
  };

  const loadedProducersSongs = producersGotten === producers.length;
  const estimatedNumSongs =
    Math.round(totalRequests / producers.length) * producers.length;
  const percentage =
    playlistSongs.length === 0
      ? 0
      : ((playlistSongs.length - spotifyLinksNotLoaded.length) /
          (loadedProducersSongs ? playlistSongs.length : estimatedNumSongs)) *
        100;
  return (
    
      <>
      <Modal noResult={noResult} history={history}/>
      <DisplayOptions
        playlistInfo={playlistInfo}
        setPlaylistInfo={setPlaylistInfo}
        createPlaylist={createPlaylist}
        percentageLoaded={percentage}
        state={state}
        dispatch={dispatch}
      />
      <DisplayPlaylist
        songs={playlistSongs}
        geniusToSpotify={geniusToSpotify}
      />
      <DisplayProducers
        producers={producers}
        geniusToSpotify={geniusToSpotify}
      /> </>

   
  );
}

const Modal = ({noResult,history}) => {
  return (
    <Dialog
      aria-labelledby="simple-dialog-title"
      open={noResult}
    >
      <DialogTitle id="simple-dialog-title">No Results found :(</DialogTitle>
      <Button
      onClick={(e) => {
                      e.preventDefault();
                      history.goBack();
                    }}>
           Return           
      </Button>
    </Dialog>
  );
};

export default DisplayResults;

import React, { useEffect, useState } from "react";
import DisplayProducers from "./DisplayProducers";
import { useRouteMatch } from "react-router-dom";
import { AuthContext } from "../Context/context";
import useGeniusToSpotify from "./useGeniusToSpotify";
import DisplayPlaylist from "./DisplayPlaylist";

function DisplayResults() {
  const { state, dispatch } = React.useContext(AuthContext);
  const [producers, setProducers] = useState([]);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const match = useRouteMatch();
  const [geniusToSpotify, setSongsToFind] = useGeniusToSpotify(
    state.accessToken
  );

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
    //loading from local storage is just for development
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
        setProducers(data.producers);
        const numberProducers = data.producers.length;
        const totalRequests = 20;
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

              if (songs.length !== result.songs.length) {
                console.log("removed: ", result.songs, songs);
              }
              setSongsToFind(songs.slice(0, songPerProducer));

              localProducer.songs = songs;
              setProducers([...data.producers]);
              setPlaylistSongs((prev) => {
                const names = new Set();
                prev.forEach(song=>names.add(song.id));
                const uniqueSongs = songs.slice(0, songPerProducer).filter(song => !names.has(song.id) ? names.add(song.id) : false);
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

  return producers ? (
    <>
      <DisplayPlaylist
        songs={playlistSongs}
        geniusToSpotify={geniusToSpotify}
      />
      <DisplayProducers
        producers={producers}
        geniusToSpotify={geniusToSpotify}
      />
    </>
  ) : (
    <h1>Loading</h1>
  );
}

export default DisplayResults;

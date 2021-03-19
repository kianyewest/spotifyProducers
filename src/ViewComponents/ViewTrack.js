import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { Spinner } from "react-bootstrap";

function ViewTrack({ spotify }) {
  const [spotifyResults, setSpotifyResults] = useState();
  const [geniusResults, setGeniusResults] = useState();
  const [noGeniusResult, setNoGeniusResult] = useState(false);

  const match = useRouteMatch();

  useEffect(() => {
    spotify.getTrack(match.params.id).then(
      function (data) {
        console.log("track information", data);
        setSpotifyResults(data);
        const spotifyArtistName = data.artists[0].name;
        const spotifyAlbumName = data.album.name;
        const spotifyTrackName = data.name;
        fetch(
          "/api/search?" +
            new URLSearchParams({
              artistName: spotifyArtistName,
              albumName: spotifyAlbumName,
              firstTrack: spotifyTrackName,
            })
        )
          .then((res) => res.json())
          .then((data) => {
            console.log("d: ", data);
            if (data.length === 0) {
                setNoGeniusResult(true);
            } else {
                setNoGeniusResult(false);
              // console.log("data", data[0].result.id);
              fetch(
                "/api/song?" +
                  new URLSearchParams({
                    id: data[0].result.id,
                  })
              )
                .then((res) => res.json())
                .then((data) => {
                  console.log("here", data);
                  setGeniusResults(data);
                });
            }
          });
      },
      function (err) {
        console.error(err);
      }
    );
  }, []);

  const displaySpotifyResults = () => {
    return <h1>{spotifyResults.name}</h1>;
  };

  const displayGeniusResults = () => {
    return (
      <>
        <h2>Producers</h2>
        {geniusResults.producer_artists.map((prod) => {
          return <h3>{prod.name}</h3>;
        })}
      </>
    );
  };
  return (
    <>
      {spotifyResults ? (
        displaySpotifyResults()
      ) : (
        <Spinner animation="border" />
      )}
      {noGeniusResult ? <h3>No Result Found</h3> : (geniusResults ? displayGeniusResults() : <Spinner animation="border" />)}
    </>
  );
}

export default ViewTrack;

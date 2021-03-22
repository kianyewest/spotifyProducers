import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { Container, Spinner, ListGroup, Row, Col } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

function ViewArtist({ spotify }) {
  const [spotifyResults, setSpotifyResults] = useState();
  const [geniusResults, setGeniusResults] = useState();
  const [noGeniusResult, setNoGeniusResult] = useState(false);

  const location = useLocation();
  console.log("lcoation: ", location);
  const match = useRouteMatch();
  const spotifyArtistId = match.params.id;
  const geniusArtistId = location.state.geniusArtistId;
  useEffect(() => {
    // spotify.getArtist(spotifyArtistId).then(
    //   function (data) {
    //     console.log('Artists information', data);
    //   },
    //   function (err) {
    //     console.error(err);
    //   }
    // )

    fetch(
      "/api/artist?" +
        new URLSearchParams({
          artistId: geniusArtistId,
        })
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("okokokokok: ", data);
      });

    fetch(
      "/api/artist/songs?" +
        new URLSearchParams({
          artistId: geniusArtistId,
        })
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("songs::: ", data);
        setGeniusResults({ tracks: data });
        // const diffArtist =  data.filter((track) => track.primary_artist.id !== geniusArtistId)
        // console.log("diff: ",diffArtist)
      });

    console.log("im here?");
  }, []);

  const displaySpotifyResults = () => {
    return <h1>{spotifyResults.name}</h1>;
  };

  const displayGeniusResults = () => {
    const diffArtist = geniusResults.tracks.filter(
      (track) => track.primary_artist.id !== geniusArtistId
    );
    return (
      <Container>
        <Row>
          <Col sm={4}>
            <ListGroup>
              {geniusResults.tracks.map((track) => showGeniusTrack(track))}
            </ListGroup>
          </Col>
          <Col sm={4}>
            <ListGroup>
              {diffArtist.map((track) => showGeniusTrack(track))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  };

  return (
    <>
      {/* {spotifyResults ? (
        displaySpotifyResults()
      ) : (
        <Spinner animation="border" />
      )} */}
      {geniusResults ? displayGeniusResults() : <Spinner animation="border" />}
    </>
  );
}

export default ViewArtist;

const showGeniusTrack = (track) => {
  return (
    <Link to={{ pathname: `/track/${track.id}` }}>
      {/* /Get smallest image possible, to reduce loading time */}
      <ListGroup.Item key={track.id}>
        {track.title} ---
        {track.primary_artist.name}
      </ListGroup.Item>
    </Link>
  );
};

const displayArtistsNames = (artists) => {
  return artists.map((artist, index) => {
    return (
      <Link to={{ pathname: `/artist/${artist.id}` }}>
        {index === artists.length - 1 ? artist.name : artist.name + ", "}
      </Link>
    );
  });
};

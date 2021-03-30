import React, { useEffect, useState } from "react";
import {
  Col, Container, Image, ListGroup, Row, Spinner
} from "react-bootstrap";
import { Link, useRouteMatch } from "react-router-dom";

function ViewAlbum({ spotify }) {
  const [spotifyResults, setSpotifyResults] = useState();
  const [geniusResults, setGeniusResults] = useState();

  const match = useRouteMatch();

  useEffect(() => {
    spotify.getAlbum(match.params.id).then(
      function (data) {
        console.log("Albums information", data);
        setSpotifyResults(data);

        fetch(
          "/api/search?" +
            new URLSearchParams({
              artistName: data.artists[0].name,
              albumName: data.name,
              firstTrack: data.tracks.items[0].name,
            })
        )
          .then((res) => res.json())
          .then((data) => {
            console.log("album data: ", data);
            setGeniusResults(data.response);
          });
      },
      function (err) {
        console.error(err);
      }
    );
  }, []);

  const displaySpotifyResults = () => {
    return (
      <Container>
        <Row>
          <Col className="text-center" sm={4} >
            <Image src={spotifyResults.images[1].url} rounded />
          </Col>
          <Col>
            <h1>{spotifyResults.name}</h1>
            <h3>By {displayArtistsNames(spotifyResults.artists)}</h3>
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <ListGroup>
              {spotifyResults.tracks.items.map((track) => <ShowTrack track={track} key={track.id}/>)}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  };

  // const displayGeniusResults = () =>{

  // }
  return (
    <>
      {spotifyResults ? (
        displaySpotifyResults()
      ) : (
        <Spinner animation="border" />
      )}

      {/* {geniusResults ? (
        displaySpotifyResults()
      ) : (
        <Spinner animation="border" />
      )} */}
    </>
  );
}

export default ViewAlbum;

const ShowTrack = ({track}) => {
  return (
    <Link to={{ pathname: `/track/${track.id}` }}>
      {/* /Get smallest image possible, to reduce loading time */}
      <ListGroup.Item key={track.id}>
        {" "}
        {track.track_number}. {track.name}{" "}
        <p color={"grey"}>
          {track.artists.length > 1 && "-"}{" "}
          {track.artists.length > 1 &&
            displayArtistsNames(track.artists.slice(1))}
        </p>
      </ListGroup.Item>
    </Link>
  );
};

const displayArtistsNames = (artists) => {
  return artists.map((artist, index) => {
    return (
      <Link to={{ pathname: `/artist/${artist.id}` }} key={artist.id}>
        {index === artists.length - 1 ? artist.name : artist.name + ", "}
      </Link>
    );
  });
};

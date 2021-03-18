import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import {
  ListGroup,
  Image,
  Spinner,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";

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
          "/api?" + new URLSearchParams({ searchTerm: data.artists[0].name })
        )
          .then((res) => res.json())
          .then((data) => {
            console.log("data: ", data);
            setGeniusResults(data.response.hits);
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
          <Col className="text-center"sm={4} mx-auto>
            
            <Image src={spotifyResults.images[1].url} rounded /> 
          </Col>
          <Col>
            <h1>{spotifyResults.name}</h1>
            <h3>
              By{" "}
              {displayArtistsNames(spotifyResults.artists)}
              
              
            </h3>
          </Col>
        </Row>
        <Row >
          <Col sm={4}>
            <ListGroup>
              {spotifyResults.tracks.items.map((track) => showTrack(track))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  };
  return (
    <>
      {spotifyResults ? (
        displaySpotifyResults()
      ) : (
        <Spinner animation="border" />
      )}
    </>
  );
}

export default ViewAlbum;

const showTrack = (track) => {
  return (
    <Link to={{ pathname: `/track/${track.id}` }}>
      {/* /Get smallest image possible, to reduce loading time */}
  <ListGroup.Item key={track.id}> {track.track_number}.   {track.name}  <p color={"grey"}>{track.artists.length>1 && "-"} {track.artists.length>1 && displayArtistsNames(track.artists.slice(1))}</p></ListGroup.Item>
    </Link>
  );
};

const displayArtistsNames = (artists) =>{
  return (
     artists.map((artist, index) => {
      return (
        <Link to={{ pathname: `/artist/${artist.id}` }}>
          {index === artists.length - 1
            ? artist.name
            : artist.name + ", "}
        </Link>
      );
    })
  )
}
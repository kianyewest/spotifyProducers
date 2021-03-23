import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import {
  Container,
  Spinner,
  ListGroup,
  Row,
  Col,
  Accordion,
  Card,
  Image,
  Button,
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import _ from "lodash";

function ViewArtist({ spotify }) {
  const [spotifyResults, setSpotifyResults] = useState();
  const [artistInfo, setArtistInfo] = useState();
  const [geniusResults, setGeniusResults] = useState({
    tracks: [],
    nextPage: 1,
    loading: false,
  });
  const [noGeniusResult, setNoGeniusResult] = useState(false);

  const location = useLocation();
  console.log("lcoation: ", location);
  const match = useRouteMatch();
  const spotifyArtistId = match.params.id;
  const geniusArtistId = location.state.geniusArtistId;

  const getGeniusArtistTracks = () => {
    if (geniusResults.nextPage) {
      setGeniusResults((old) => {
        return { ...old, loading: true };
      });
      fetch(
        "/api/artist/songs?" +
          new URLSearchParams({
            artistId: geniusArtistId,
            pageNum: geniusResults.nextPage,
          })
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("songs::: ", data);
          setGeniusResults((oldResults) => {
            return {
              ...oldResults,
              tracks: [...oldResults.tracks, ...data.songs],
              nextPage: data.next_page,
              loading: false,
            };
          });
        });
    } else {
      console.log("no more pages");
    }
  };

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
        console.log("genius Artist info: ", data);
        setArtistInfo(data);
      });

    getGeniusArtistTracks(1);
  }, []);

  const displaySpotifyResults = () => {
    return <h1>{spotifyResults.name}</h1>;
  };

  const displayGeniusResults = () => {
    const groupArtist = _.groupBy(
      geniusResults.tracks,
      (track) => track.primary_artist.id
    );
    console.log("grouped: ", groupArtist);
    const diffArtist = geniusResults.tracks.filter(
      (track) => track.primary_artist.id !== geniusArtistId
    );
    return (
      <Container>
        <Row>
          {artistInfo && <img src={artistInfo.header_image_url} height="128" />}
          <h1>{artistInfo && artistInfo.name}</h1>
          {/* <Button onClick={() => getGeniusArtistTracks()}/> */}
          <Button
            variant="primary"
            onClick={() => {
              !geniusResults.loading && getGeniusArtistTracks();
            }}
            disabled={geniusResults.loading}
          >
            {geniusResults.loading ? "Loading…" : "Click to load more"}
          </Button>
        </Row>
        <Accordion>
          {Object.keys(groupArtist).map((geniusArtistId, index) => {
            return (
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey={`${index}`}>
                  {groupArtist[geniusArtistId][0].primary_artist.name} ▼
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={`${index}`}>
                  <Card.Body>
                    {groupArtist[geniusArtistId].map((song) => {
                      return song.title + ", ";
                    })}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            );
          })}
        </Accordion>
        <Row>
          <Col sm={4}>
            {geniusResults.tracks.length}
            <ListGroup>
              {geniusResults.tracks.map((track) => showGeniusTrack(track))}
            </ListGroup>
          </Col>

          <Col sm={4}>
            {diffArtist.length}
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

const geniusToSpotify = (tracks) => {
  return tracks.map(() => {});
};

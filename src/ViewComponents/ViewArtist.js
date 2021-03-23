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
import Search from "../Search";

function ViewArtist({ spotify }) {
  const showGeniusTrack = (track) => {
    const searched = geniusToSpotify.hasOwnProperty(track.id);
    const found =
      searched && !geniusToSpotify[track.id].hasOwnProperty("noResult");
    const nameAndArtist =
      found &&
      geniusToSpotify[track.id].name +
        "  " +
        geniusToSpotify[track.id].artists[0].name;

    // {geniusToSpotify.hasOwnProperty(track.id) ? (!geniusToSpotify[track.id].hasOwnProperty('noResult') ? geniusToSpotify[track.id].name :"Unable to find") : "Need to Search"}
   
    return (
      // <Link to={{ pathname: `/track/${track.id}` }}>
      <ListGroup.Item key={track.id}>
        <Button
          variant="primary"
          onClick={() => getSpotifyTrackFromGeniusTrack(track)}
        >
          {track.title_with_featured} ---
          {track.primary_artist.name}
        </Button>

        {found ? (
          <a target="_blank" href={geniusToSpotify[track.id].external_urls.spotify}>{nameAndArtist}</a>
        ) : searched ? (
          <h1>No result</h1>
        ) : (
          "Need to search"
        )}
      </ListGroup.Item>
      // </Link>
    );
  };

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
          // console.log("songs::: ", data);
          setGeniusResults((oldResults) => {
            return {
              ...oldResults,
              tracks: [...oldResults.tracks, ...data.songs],
              nextPage: data.next_page,
              loading: false,
            };
          });

          //for each track, see if we can find spotify equivilent
            data.songs.map((track)=>getSpotifyTrackFromGeniusTrack(track))
        });
    } else {
      console.log("no more pages");
    }
  };

  const matchExactArtist = (spotifyResult, geniusArtistName) => {
    return spotifyResult.filter((track) => {
      const spotifyArtist = track.artists[0].name.normalize("NFKD");
      //normalise to so that characters such as space and no-break space will match each other
      // console.log(track.name,spotifyArtist,geniusArtistName,spotifyArtist.localeCompare(geniusArtistName, 'en', { sensitivity: 'base' })===0);
      return (
        spotifyArtist.localeCompare(geniusArtistName, "en", {
          sensitivity: "base",
        }) === 0
      );
      // geniusArtistName
    });
  };

  const matchSimilarArtist = (spotifyResult, geniusArtistName) => {
    //try seeing if artist is within genius artist name i.e "Drake" within the artist name of "Drake,Kanye west, Lil Wayne"
    //unsure of why genius would store an artist as a list of artists they already have in there database with no reference to them :(
    return spotifyResult.filter((track) => {
      const spotifyArtist = track.artists[0].name
        .normalize("NFKD")
        .toUpperCase();
      return geniusArtistName.includes(spotifyArtist);
    });
  };

  const processResults = (data, geniusTrack) => {
    // console.log(data)
    // console.log("geniusTrack.primary_artist",geniusTrack.primary_artist)
    //exact match
    const geniusArtistName = geniusTrack.primary_artist.name
      .normalize("NFKD")
      .toUpperCase();
    var sameArtist = matchExactArtist(data.tracks.items, geniusArtistName);

    //if no matches
    if (sameArtist.length === 0) {
      sameArtist = matchSimilarArtist(data.tracks.items, geniusArtistName);
    }

    if (sameArtist.length > 0) {
      const topSong = sameArtist[0];
      setGeniusToSpotify((prev) => {
        return { ...prev, [geniusTrack.id]: topSong };
      });
      setSpotifyToGenius((prev) => {
        return { ...prev, [topSong.id]: geniusTrack };
      });
      return true;
    } else {
      const noResultObj = { noResult: true };
      setGeniusToSpotify((prev) => {
        return { ...prev, [geniusTrack.id]: noResultObj };
      });
      // setSpotifyToGenius((prev)=>{return {...prev, [topSong.id]:noResultObj}})
      return false;
    }
  };

  const getSpotifyTrackFromGeniusTrack = (geniusTrack) => {
    const query = geniusTrack.title + " " + geniusTrack.primary_artist.name;
    //check entry does not already exist
    // if (geniusToSpotify.hasOwnProperty(geniusTrack.id)) {
    //   console.log("already searched for: ", query);
    //   return;
    // } else {
    //   //  console.log("searching for: ", query);

    // }

    // console.log("geniusTrack", geniusTrack);
    // const q = String.raw();
    const cleanQuery = query.normalize("NFKD").replace("’", "'");
    
    //this is ugly, it searches for the track with artist name, if that fails then
    //searches with a higher limit i.e return more tracks
    // if that fails it searches only using the title
    //if that fails it reduces the title to a bare form and searches again
    spotify.search(cleanQuery, ["track"],{limit:10}).then(
      function (data) {
        if (!processResults(data, geniusTrack)) {
          //try again with higher limit
          spotify.search(query, ["track"], { limit: 50 }).then(
            function (data) {
              // console.log("result from higher limit: ", data);
              if (!processResults(data, geniusTrack)) {
                //try again with only track name
                spotify
                  .search(geniusTrack.title, ["track"], { limit: 50 })
                  .then(
                    function (data) {
                      // console.log("result from reduced search: ", data);
                      //if that failed modify the search term
                      if (!processResults(data, geniusTrack)) {
                        // console.log("oringal q: ", query);
                        //removes text between brackets i.e "Speedom (Worldwide Choppers 2)" becomes "Speedom"
                        //this was done as spotify represented Worldwide Choppers 2 as Wc2, and the song title for it was Speedom (Wc2) which was not found when searching
                        const regex = /\(([^HS]{1,})\)/gm;
                        const newQuery = geniusTrack.title.replace(regex, "");
                        // console.log("newQuery", newQuery);
                        spotify.search(newQuery, ["track"], { limit: 50 }).then(
                          function (data) {
                            // console.log("result from reduced search: ", data);
                            processResults(data, geniusTrack);
                          },
                          function (err) {
                            console.error(err);
                          }
                        );
                      }
                    },
                    function (err) {
                      console.error(err);
                    }
                  );
              }
            },
            function (err) {
              console.error(err);
            }
          );
        }
      },
      function (err) {
        console.error(err);
      }
    );
  };

  const [spotifyResults, setSpotifyResults] = useState();
  const [artistInfo, setArtistInfo] = useState();
  const [geniusResults, setGeniusResults] = useState({
    tracks: [],
    nextPage: 1,
    loading: false,
  });
  const [spotifyToGenius, setSpotifyToGenius] = useState({});
  const [geniusToSpotify, setGeniusToSpotify] = useState({});

  const location = useLocation();
  // console.log("location: ", location);
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
        // console.log("genius Artist info: ", data);
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
    // console.log("grouped: ", groupArtist);
    const diffArtist = geniusResults.tracks.filter(
      (track) => track.primary_artist.id !== geniusArtistId
    );
    return (
      <Container>
        <Row>
          {artistInfo && <img src={artistInfo.header_image_url} height="128" />}
          <h1>{artistInfo && artistInfo.name}</h1>

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
              <Card key={geniusArtistId}>
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

import React, { useState, useEffect } from "react";
import { Spin, Row, Col } from "antd";
import { useRouteMatch } from "react-router-dom";
function Generate({spotify}) {
  const [loading, setLoading] = useState(true);
  const [displayData, setDisplayData] = useState("");

  const match = useRouteMatch();

  console.log("match",Date.now()/1000,match);

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
      "/api/getProducers?" +
        new URLSearchParams({
            spotifyAccessToken:spotify.getAccessToken(),
          [type(match.params.type)]: match.params.id,
        })
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("got data", data);
        console.log("afterrrrr data", data.filter((song)=>{
          // console.log("song.media",song)
          
          return song.media && song.media.length>0 && song.media.filter((p)=>{console.log("p",p);return p.provider==="spotify"}).length>0
        }))
        console.log("after data", data);
        setDisplayData(JSON.stringify(data, undefined, 2));
        setLoading(false);
      });
  }, []);

  const LoadingMessage = () => {
    return (
      <Row
        type="flex"
        justify="center"
        align="middle"
        style={{ minHeight: "100vh" }}
      >
        <Col>
          <Row type="flex" justify="center">
            <Spin size="large" />
          </Row>
          <Row>
            <h1>Generating Playlist</h1>
          </Row>
        </Col>
      </Row>
    );
  };

  return loading ? <LoadingMessage /> : <pre>{displayData}</pre>;
}

export default Generate;

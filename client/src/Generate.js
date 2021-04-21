import React, { useState, useEffect } from "react";
import {
  Spin,
  Row,
  Col,
  Table,
  Tag,
  Space,
  Card,
  Layout,
  Collapse,
  Panel,
  Button,
  Input,
  Form,
  Progress,
  Result,
} from "antd";

import { useRouteMatch } from "react-router-dom";
const { Content } = Layout;

//https://stackoverflow.com/questions/47061160/merge-two-arrays-with-alternating-values
const interleave = ([x, ...xs], ...rest) =>
  x === undefined
    ? rest.length === 0
      ? [] // base: no x, no rest
      : interleave(...rest) // inductive: no x, some rest
    : [x, ...interleave(...rest, xs)]; // inductive: some x, some rest

function Generate({ spotify }) {
  const [loading, setLoading] = useState(true);
  const [displayData, setDisplayData] = useState("");
  const [allSongs, setAllSongs] = useState([]);
  const [geniusToSpotify, setGeniusToSpotify] = useState({});
  const [playlistId, setPlaylistId] = useState("");
  const [loadingPlaylist,setLoadingPlaylist] = useState(false)
  const defaultNumberPlaylistItems = 40;

  const match = useRouteMatch();

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
      process.env.REACT_APP_BACKEND_LINK+"/api/getProducers?" +
        new URLSearchParams({
          spotifyAccessToken: spotify.getAccessToken(),
          [type(match.params.type)]: match.params.id,
        })
    )
      .then((res) => res.json())
      .then((data) => {
        setDisplayData(data);      
        const allSongs = interleave(...data.map((d) => d.songs));
        const uniqueSongs = [...new Map(allSongs.map(item => [item.id, item])).values()]

        uniqueSongs.slice(0, defaultNumberPlaylistItems).forEach((song) => {getSpotifyTrackFromGeniusTrack(song)});
        console.log("data: ",data)
        
        setAllSongs(uniqueSongs);
          
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

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Artist",
      dataIndex: "artist",
      key: "artist",
      render: (text) => <a>{text}</a>,
    },
  ];

  const DisplayProducers = ({ data }) => {
    return (
      <>
      <h1>Producers</h1>
      <Collapse>
        {data.map((item, index) => {
          //unable to put this in seperate component due to bug in antd code, Collapse.Panel cannot be within another component
          const { producer, songs } = item;
          const data = songs.map((song) => {
            const title = song.title;
            const artist = song.primary_artist.name;
            return {
              key: song.id+JSON.stringify(song),
              title: title,
              artist: artist,
            };
          });
          return (
            <Collapse.Panel
              extra={
                <img
                  alt="example"
                  src={producer.header_image_url}
                  className="image-container"
                />
              }
              headStyle={{ backgroundColor: "#fafafa" }}
              header={producer.name}
              key={`${index}`}
            >
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                scroll={{ y: 320 }}
              />
            </Collapse.Panel>
          );
        })}
      </Collapse>
      </>
    );
  };

  const DisplayPlaylist = ({ data }) => {
    // const allSongs = data.flatMap((d) => d.songs);
    const columns = [
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Artist",
        dataIndex: "artist",
        key: "artist",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Value",
        dataIndex: "value",
        key: "value",
        render: (spotifyLink) => {
          return spotifyLink.startsWith("http") ? (
            <a href={spotifyLink}>open in spotify</a>
          ) : (
            <p>{spotifyLink}</p>
          );
        },
      },
    ];


    const dataSource = allSongs
      .slice(0, defaultNumberPlaylistItems)
      .map((song) => {
        const title = song.title;
        const artist = song.primary_artist.name;
        const searched = geniusToSpotify.hasOwnProperty(song.id);
        const found =
          searched && !geniusToSpotify[song.id].hasOwnProperty("noResult");
        return {
          key: song.id,
          title: title,
          artist: artist,
          value: found
            ? geniusToSpotify[song.id].external_urls.spotify
            : searched
            ? "No result"
            : "Loading",
        };
      });

    const createPlaylist = async ({ playlistName }) => {
      setLoadingPlaylist(true);
      const uris = allSongs
        .slice(0, defaultNumberPlaylistItems)
        .flatMap((song) =>
          geniusToSpotify.hasOwnProperty(song.id)
            ? geniusToSpotify[song.id].hasOwnProperty("noResult")
              ? []
              : [geniusToSpotify[song.id].uri]
            : []
        );
      try {
        const me = await spotify.getMe();
        console.log(me);
        console.log(me.id);
        const result = spotify.createPlaylist(me.id, {
          name: playlistName ? playlistName : "Generated Playlist",
        });
        result.then(
          (playlistData) => {
            console.log("playlist data: ", playlistData);
            const playlistId = playlistData.id;
            spotify.addTracksToPlaylist(playlistId, uris).then(
              (data) => setPlaylistId(playlistData),
              (error) => console.log(error)
            );
          },
          (error) => console.log(error)
        );
      } catch (error) {
        console.log("e", error);
      }
    };

    const spotifyLinksNotLoaded = allSongs
      .slice(0, defaultNumberPlaylistItems)
      .filter((song) => !geniusToSpotify.hasOwnProperty(song.id));
    return (
      <>
        <Form name="basic" onFinish={createPlaylist}>
          <Form.Item label="Playlist Name" name="playlistName">
            <Input placeholder="Generated Playlist" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={spotifyLinksNotLoaded.length === 0 ? false : true}
            >
              Create Playlist
            </Button>
            <Progress
              type="circle"
              percent={
                ((defaultNumberPlaylistItems - spotifyLinksNotLoaded.length) /
                  defaultNumberPlaylistItems) *
                100
              }
              width={40}
            />
            <p>
              {spotifyLinksNotLoaded.length === 0
                ? ""
                : "Loading spotify Links"}
            </p>
          </Form.Item>
        </Form>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ y: 600 }}
        />
      </>
    );
  };

  const matchExactArtist = (spotifyResult, geniusArtistName) => {
    return spotifyResult.filter((track) => {
      if(track === null){
        return false;
      }
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
      if(track === null){
        return false;
      }
      const spotifyArtist = track.artists[0].name
        .normalize("NFKD")
        .toUpperCase();
      return geniusArtistName.includes(spotifyArtist);
    });
  };

  const processResults = (data, geniusTrack) => {
    console.log("data is: ",data)
    console.log("geniusTrack.primary_artist",geniusTrack.primary_artist)
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
      // setSpotifyToGenius((prev) => {
      //   return { ...prev, [topSong.id]: geniusTrack };
      // });
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
    // return;
    const query = geniusTrack.title + " " + geniusTrack.primary_artist.name;
    //check entry does not already exist
    if (geniusToSpotify.hasOwnProperty(geniusTrack.id)) {
      // console.log("already searched for: ", query);
      return;
    } else {
      // console.log("searching for: ", query);
    }

    // console.log("geniusTrack", geniusTrack);
    // const q = String.raw();
    const cleanQuery = query.normalize("NFKD").replace("’", "'");

    //this is ugly, it searches for the track with artist name, if that fails then
    //searches with a higher limit i.e return more tracks
    // if that fails it searches only using the title
    //if that fails it reduces the title to a bare form and searches again
    spotify.search(cleanQuery, ["track"], { limit: 10 }).then(
      function (data) {
        console.log("first data: ",data);
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
                            console.log("result from reduced search: ", data);
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

  return loading ? (
    <LoadingMessage />
  ) : playlistId ? (
    <Result
    key="Alg"
      status="success"
      title="Successfully Created Playlist!"
      extra={[
        <Button type="primary">
          {playlistId.external_urls && (
            <a href={playlistId.external_urls.spotify}>View Playlist</a>
          )}
        </Button>,
        <Button onClick={()=>{ setLoadingPlaylist(false); setPlaylistId("")}}>
          Go Back
        </Button>
      ]}
    />
  ) : (
    <Spin spinning={loadingPlaylist} delay={500}>
    <Layout className="layout">
      <Content>
        <Row justify="space-around">
          <Col span={16} style={{ paddingTop: "30px" }}>
            {displayData && <DisplayPlaylist data={displayData} />}
          </Col>
          <Col span={7} style={{ paddingTop: "30px" }}>
            {displayData && <DisplayProducers data={displayData} />}
          </Col>
        </Row>
      </Content>
    </Layout>
    </Spin>
  );
}

export default Generate;

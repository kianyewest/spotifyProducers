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
} from "antd";

import { useRouteMatch } from "react-router-dom";
const { Content } = Layout;
function Generate({ spotify }) {
  const [loading, setLoading] = useState(true);
  const [displayData, setDisplayData] = useState("");

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
    fetch(
      "/api/getProducers?" +
        new URLSearchParams({
          spotifyAccessToken: spotify.getAccessToken(),
          [type(match.params.type)]: match.params.id,
        })
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("got data", data);
        // Can filter to get spotify links

        // console.log("afterrrrr data", data.filter((song)=>{
        //   // console.log("song.media",song)
        //   return song.media && song.media.length>0 && song.media.filter((p)=>{console.log("p",p);return p.provider==="spotify"}).length>0
        // }))
        // console.log("after data", data);

        // data.forEach(element => {
        //   for
        //   element.songs.
        // });

        setDisplayData(data);
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
      <Collapse>
        {data.map((item, index) => {
          //unable to put this in seperate component due to bug in antd code, Collapse.Panel cannot be within another component
          const { producer, songs } = item;
          const data = songs.map((song) => {
            const title = song.title;
            const artist = song.primary_artist.name;
            return {
              key: song.id,
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
                  class="image-container"
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
    );
  };

 

  const DisplayPlaylist = ({data}) => {
    const allSongs = data.flatMap(d=>d.songs);
    // console.log(allSongs);

    const dataSource = allSongs.map((song) => {
      const title = song.title;
      const artist = song.primary_artist.name;
      return {
        key: song.id,
        title: title,
        artist: artist,
      };
    });

    
    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ y: 600 }}
      />
    );
  };
  return loading ? (
    <LoadingMessage />
  ) : (
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
  );
}

export default Generate;

import React from "react";
import { useState } from "react";
import {
  Layout,
  Row,
  Col,
  List,
  Avatar,
  Divider,
  Button,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link, useLocation,useHistory } from "react-router-dom";
import SearchFunction from "./SearchFunction";
const { Content } = Layout;

const emptyState = {
  tracks: [],
  albums: [],
  artists: [],
};

function NewSearch({ spotify }) {
  const [{ tracks, albums, artists }, setData] = useState(emptyState);
  const [numItems, setNumItems] = useState(5);
  const history = useHistory();
  // Specific data link for each type
  const trackData = (track) => {
    return {
      link: `/track/${track.id}`,
      imgArr: track.album.images,
      name: track.name,
      description: track.artists[0].name,
      id: track.id,
    };
  };

  const albumData = (album) => {
    return {
      link: `/album/${album.id}`,
      imgArr: album.images,
      name: album.name,
      description: album.artists[0].name,
      id: album.id,
    };
  };

  const artistData = (artist) => {
    return {
      link: `/artist/${artist.id}`,
      imgArr: artist.images,
      name: artist.name,
      description: "",
      id: artist.id,
    };
  };

  //how to lay items out
  function ItemLayout({ data, headerName, itemData }) {
    const renderItem = (item) => {
      const { link, imgArr, name, description, id } = itemData(item);
      return (
        <Link to={{ pathname: link }}>
          <List.Item
            extra={
                <Button size="large" type="primary" onClick={(e)=>{e.preventDefault();history.push(`/generate/${id}`)}}>
                  Generate Playlist
                </Button>       
            }
          >
            <List.Item.Meta
              avatar={
                imgArr.length > 0 ? (
                  <Avatar
                    shape="square"
                    size={64}
                    src={imgArr[imgArr.length - 1].url}
                  />
                ) : (
                  <Avatar
                    shape="square"
                    size={64}
                    icon={<UserOutlined />}
                  />
                )
              }
              title={name}
              description={description}
            />
          </List.Item>
        </Link>
      );
            }

    return (
      <Col span={rowLength}>
        <List
          loading={false}
          size="large"
          header={
            <Divider orientation="left" style={{ padding: 0 }}>
              {headerName}
            </Divider>
          }
          // itemLayout="horizontal"
          dataSource={data}
          renderItem={renderItem}
        />
 
      </Col>
    );
  }

  const location = useLocation();
  const rowLength = 7;
  return (
    <>
      <Layout className="layout">
        <Content>
          <Row>
            <Col span={24}>
              <div className="jumbotron" align="center">
                <SearchFunction
                  defaultSearchTerm={
                    location.state ? location.state.searchTerm : undefined
                  }
                  spotify={spotify}
                  setData={setData}
                  emptyDataState={emptyState}
                  size={700}
                />
              </div>
            </Col>
          </Row>
          <Row justify="space-around">
             <ItemLayout
              data={tracks.slice(0, numItems)}
              headerName="Songs"
              itemData={trackData}
            />
            <ItemLayout
              data={albums.slice(0, numItems)}
              headerName="Albums"
              itemData={albumData}
            />
            <ItemLayout
              data={artists.slice(0, numItems)}
              headerName="Artists"
              itemData={artistData}
            />
          </Row>
          <Row justify="center">
            {(numItems < tracks.length ||
              numItems < albums.length ||
              numItems < artists.length) && (
              <Col>
                <Button
                  style={{ margin: 30 }}
                  onClick={() =>
                    setNumItems((prev) => {
                      return prev + 10;
                    })
                  }
                >
                  Load more
                </Button>
              </Col>
            )}
          </Row>
        </Content>
      </Layout>
    </>
  );
}

export default NewSearch;

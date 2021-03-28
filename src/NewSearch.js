import React from "react";
import { useState } from "react";
import {
  Layout,
  Menu,
  Breadcrumb,
  Row,
  Col,
  Space,
  Select,
  Input,
  AutoComplete,
  List,
  Avatar,
  Divider,
  Button,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Header, Content, Footer } = Layout;
const { Option } = Select;
const { Search } = Input;

//render title for search box
const renderTitle = (title) => (
  <span>
    {title}
    <div
      style={{
        float: "right",
      }}
    >
      View All
    </div>
  </span>
);

//render item for search box
const renderItem = (id, title, count,category) => ({
  value: id,
  label: (
    <Link to={{ pathname: `/${category}/${id}` }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {title}
      <span>{count}</span>
    </div>
    </Link>
  ),
});

const doSearch = (spotify, searchTypes, query, callback) => {
  console.log("query called: ", query);
  query &&
    spotify.search(query, searchTypes).then(
      function (newData) {
        console.log("new Data: ", query, newData);
        callback(newData);
      },
      function (err) {
        console.error("err", err);
      }
    );
};

const Complete = ({ handleSearch, options }) => {
  const onSelect = (value) => {
    console.log("onSelect", value);
  };

  const onSearch = (term) => {
    console.log("term", term);
  };

  console.log("big options: ", options);

  return (
    <AutoComplete
      dropdownMatchSelectWidth={true}
      style={{
        width: 700,
      }}
      options={options}
      onSelect={onSelect}
      onSearch={handleSearch}
    >
      <Input.Search
        size="large"
        placeholder="Search here"
        enterButton
        onSearch={onSearch}
      />
    </AutoComplete>
  );
};
const emptyState = {
  tracks: [],
  albums: [],
  artists: [],
}
// const { Header, Footer, Sider, Content } = Layout;
function NewSearch({ spotify }) {
  const [{ tracks, albums, artists }, setData] = useState(emptyState);
  const [options, setOptions] = useState();

  const handleSearch = (value) => {
    if (value) {
      doSearch(spotify, ["track", "album", "artist"], value, (data) => {
        if (!data) {
          setOptions([]);
          setData(emptyState);
        }
        const options = Object.keys(data).map((category) => {
          const options = data[category].items.slice(0, 2).map((item) => {
            return renderItem(
              item.id,
              item.name,
              item.artists ? item.artists[0].name : "",
              category.slice(0, -1),
            );
          });
   
          return { label: renderTitle(category), options: options };
        });
        setOptions(options);

        for (const category of Object.keys(data)) {
          setData((prev) => {
            return { ...prev, [category]: data[category].items };
          });
        }
      });
    } else {
      setOptions([]);
      setData(emptyState);
    }
  };

  
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
    return (
      <Col span={rowLength}>
        <List
        loading={false}
        loadMore={()=> {return <div>hi</div>}}
        size="large"
          header={
            <Divider orientation="left" style={{ padding: 0 }}>
              {headerName}
            </Divider>
          }
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => {
            const { link, imgArr, name, description, id } = itemData(item);
            return (
              <Link to={{ pathname: link }}>
                <List.Item
                  extra={
                    <Link to={{ pathname: `/generate/${id}` }}>
                      <Button size="large" type="primary">
                        Generate Playlist
                      </Button>
                    </Link>
                  }
                >
                  <List.Item.Meta
                    avatar={
                      imgArr.length > 0 ? (
                        <Avatar shape="square" size={64} src={imgArr[imgArr.length-1].url} />
                      ) : (
                        <Avatar shape="square" size={64} icon={<UserOutlined />}
                        />
                      )
                    }
                    title={name}
                    description={description}
                  />
                </List.Item>
              </Link>
            );
          }}
        />
      </Col>
    );
  }

  
  const numItems = 5;
  const rowLength = 7;
  return (
    <>
      <Layout className="layout">
        <Content>
          <Row>
            <Col span={24}>
              <div className="jumbotron" align="center">
                <Complete
                  spotify={spotify}
                  options={options}
                  handleSearch={handleSearch}
                />
              </div>
            </Col>
          </Row>
          <Row justify="space-around">
             
            <ItemLayout data={tracks.slice(0,numItems)} headerName="Songs" itemData={trackData} />
            <ItemLayout data={albums.slice(0,numItems)} headerName="Albums" itemData={albumData} />
            <ItemLayout data={artists.slice(0,numItems)} headerName="Artists" itemData={artistData} />
           
          </Row>
          {/* <Row>
            <Col>
            <Button onClick={()=>showMore()}>loading more</Button>
            </Col>
         
          </Row> */}
        </Content>
      </Layout>
    </>
  );
}

export default NewSearch;

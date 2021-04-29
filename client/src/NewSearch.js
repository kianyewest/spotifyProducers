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
  Input,
  Spin
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
const { Content } = Layout;

const emptyState = {
  tracks: [],
  albums: [],
  artists: [],
};

function NewSearch({ spotify }) {
  const [data, setData] = useState(emptyState);
  const { tracks, albums, artists } =data;
  const [numItems, setNumItems] = useState(5);
  const [searchTerm,setSearchTerm] = useState("");
  const [prevSearch,setPrevSearch] = useState(null);
  const [loading,setLoading] = useState(false);

  const history = useHistory();
  const rowLength = 7;

  const onSearch = (searchTerm)=>{
    if(prevSearch){
      console.log("aborting prev one");
      prevSearch.abort();
      setPrevSearch(null);
    }
    if(searchTerm===""){
      setData(emptyState);
      setLoading(false);
      return;
    }
    const search = (spotify.search(searchTerm, ["track", "album", "artist"],{limit:10,market:"NZ"}));
    search.then(
      function (result) {
        console.log("res:",result)
        
        const data = {}
        //remove any null results
        for (const category of Object.keys(result)) {
          data[category] = result[category].items.filter((val)=>val!=null)
        }
       
        
        for (const category of Object.keys(data)) {
          setData((prev) => {
            return { ...prev, [category]: data[category] };
          });
        }
        setLoading(false);
      },
      function (err) {
        
      }
    );
    setPrevSearch(search);

  }
  return (
    <>
      <Layout className="layout">
        <Content>
          <Row>
            <Col span={24}>
              <div className="jumbotron" align="center">
                <Input placeholder="Search" allowClear value={searchTerm} size={700} onChange={(e)=>{setLoading(true);setSearchTerm(e.target.value);onSearch(e.target.value)}}/>
                
              </div>
            </Col>
          </Row>
          {loading ? <Row type="flex" justify="center" align="middle" style={{minHeight: '10vh'}}>
      <Col><Spin size="large" /></Col>
    
  </Row>:
          <>
          <Row justify="space-around" flex={2}>
            <DisplayTracks data={data.tracks} numItems={numItems} rowLength={rowLength} history={history}/>
            <DisplayAlbums data={data.albums} numItems={numItems} rowLength={rowLength} history={history}/>
            <DisplayArtists data={data.artists} numItems={numItems} rowLength={rowLength} history={history}/>
          </Row>
          </>
        }
        </Content>
      </Layout>
    </>
  );
}
  //how to lay items out
function ItemLayout({ data, headerName, getItemData,rowLength,history}) {
  const renderItem = (item) => {
    const { link, imgArr, name, description, id } = getItemData(item);
    return (
      <Link to={{ pathname: link }}>
        <List.Item
          extra={
              <Button size="large" type="primary" onClick={(e)=>{e.preventDefault();history.push(`/generate${link}`)}}> 
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
    <Col  lg={rowLength}>
      <List
        loading={false}
        size="large"
        header={
          <h4>{headerName}</h4>
        }
        bordered={false}
        // itemLayout="horizontal"
        dataSource={data}
        renderItem={renderItem}
      />
    </Col>
  );
}

function DisplayTracks({data,numItems,rowLength,history}){
  const trackData = (track) => {
    return {
      link: `/track/${track.id}`,
      imgArr: track.album.images,
      name: track.name,
      description: track.artists[0].name,
      id: track.id,
    };
  };

  return <ItemLayout
  data={data.slice(0, numItems)}
  headerName="Songs"
  getItemData={trackData}
  rowLength={rowLength}
  history={history}
/>
}


function DisplayAlbums({data,numItems,rowLength,history}){
  const albumData = (album) => {
    return {
      link: `/album/${album.id}`,
      imgArr: album.images,
      name: album.name,
      description: album.artists[0].name,
      id: album.id,
    };
  };

  return <ItemLayout
  data={data.slice(0, numItems)}
  headerName="Albums"
  getItemData={albumData}
  rowLength={rowLength}
  history={history}
/>
}


function DisplayArtists({data,numItems,rowLength,history}){
  
  const artistData = (artist) => {
    return {
      link: `/artist/${artist.id}`,
      imgArr: artist.images,
      name: artist.name,
      description: "",
      id: artist.id,
    };
  };

  return <ItemLayout
  data={data.slice(0, numItems)}
  headerName="Artists"
  getItemData={artistData}
  rowLength={rowLength}
  history={history}
/>
}

export default NewSearch;

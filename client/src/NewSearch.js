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
  Spin,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import { TextField } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
const { Content } = Layout;

const emptyState = {
  tracks: [],
  albums: [],
  artists: [],
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  search: {
    marginTop: "3em",
  },
}));

function NewSearch({ spotify }) {
  const [data, setData] = useState(emptyState);
  const { tracks, albums, artists } = data;
  const [numItems, setNumItems] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [prevSearch, setPrevSearch] = useState(null);
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const rowLength = 24;

  const onSearch = (searchTerm) => {
    if (prevSearch) {
      console.log("aborting prev one");
      prevSearch.abort();
      setPrevSearch(null);
    }
    if (searchTerm === "") {
      setData(emptyState);
      setLoading(false);
      return;
    }
    const search = spotify.search(searchTerm, ["track", "album", "artist"], {
      limit: 10,
      market: "NZ",
    });
    search.then(
      function (result) {
        console.log("res:", result);

        const data = {};
        //remove any null results
        for (const category of Object.keys(result)) {
          data[category] = result[category].items.filter((val) => val != null);
        }

        for (const category of Object.keys(data)) {
          setData((prev) => {
            return { ...prev, [category]: data[category] };
          });
        }
        setLoading(false);
      },
      function (err) {}
    );
    setPrevSearch(search);
  };
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Container maxWidth="sm" className={classes.search}>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => {
                setLoading(true);
                setSearchTerm(e.target.value);
                onSearch(e.target.value);
              }}
            />
          </Container>
        </Grid>
        <Grid item xl={4} lg={4} sm={6} xs={12}>
          <Container>
            <DisplayTracks
              data={data.tracks}
              numItems={numItems}
              rowLength={rowLength}
              history={history}
            />
          </Container>
        </Grid>
        <Grid item xl={4} lg={4} sm={6} xs={12}>
          <Container>
            <DisplayAlbums
              data={data.albums}
              numItems={numItems}
              rowLength={rowLength}
              history={history}
            />
          </Container>
        </Grid>
        <Grid item xl={4} lg={4} sm={6} xs={12}>
          <Container>
            <DisplayArtists
              data={data.artists}
              numItems={numItems}
              rowLength={rowLength}
              history={history}
            />
          </Container>
        </Grid>
      </Grid>
    </div>
  );
}
//how to lay items out
function ItemLayout({ data, headerName, getItemData, rowLength, history }) {
  const renderItem = (item) => {
    const { link, imgArr, name, description, id } = getItemData(item);
    return (
      <Link to={{ pathname: link }}>
        <List.Item
          extra={
            <Button
              size="large"
              type="primary"
              onClick={(e) => {
                e.preventDefault();
                history.push(`/generate${link}`);
              }}
            >
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
                <Avatar shape="square" size={64} icon={<UserOutlined />} />
              )
            }
            title={name}
            description={description}
          />
        </List.Item>
      </Link>
    );
  };

  return (
    <Col lg={rowLength}>
      <List
        loading={false}
        size="large"
        header={<h4>{headerName}</h4>}
        bordered={false}
        // itemLayout="horizontal"
        dataSource={data}
        renderItem={renderItem}
      />
    </Col>
  );
}

function DisplayTracks({ data, numItems, rowLength, history }) {
  const trackData = (track) => {
    return {
      link: `/track/${track.id}`,
      imgArr: track.album.images,
      name: track.name,
      description: track.artists[0].name,
      id: track.id,
    };
  };

  return (
    <ItemLayout
      data={data.slice(0, numItems)}
      headerName="Songs"
      getItemData={trackData}
      rowLength={rowLength}
      history={history}
    />
  );
}

function DisplayAlbums({ data, numItems, rowLength, history }) {
  const albumData = (album) => {
    return {
      link: `/album/${album.id}`,
      imgArr: album.images,
      name: album.name,
      description: album.artists[0].name,
      id: album.id,
    };
  };

  return (
    <ItemLayout
      data={data.slice(0, numItems)}
      headerName="Albums"
      getItemData={albumData}
      rowLength={rowLength}
      history={history}
    />
  );
}

function DisplayArtists({ data, numItems, rowLength, history }) {
  const artistData = (artist) => {
    return {
      link: `/artist/${artist.id}`,
      imgArr: artist.images,
      name: artist.name,
      description: "",
      id: artist.id,
    };
  };

  return (
    <ItemLayout
      data={data.slice(0, numItems)}
      headerName="Artists"
      getItemData={artistData}
      rowLength={rowLength}
      history={history}
    />
  );
}

export default NewSearch;

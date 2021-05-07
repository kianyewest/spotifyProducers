import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { ButtonGroup, TextField } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    // padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  search: {
    margin: "3em",
  },
  listRoot: {
    width: "100%",
    maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
  shorten: {
    maxWidth: "30ch",
  },
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function DisplaySearchResults({ data, loading }) {
  const [numItems, setNumItems] = useState(5);
  const rowLength = 24;
  const history = useHistory();
  const classes = useStyles();
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChange = (event, newValue) => {
    console.log("new value: ", newValue);
    setTabIndex(newValue);
  };
  return (
    <>
      <Grid container spacing={0}>
        <Grid item xl={12} lg={12} sm={12} xs={12}>
          <Container maxWidth="lg">
            <AppBar position="static">
              <Tabs
                value={tabIndex}
                onChange={handleChange}
                aria-label="simple tabs example"
                centered
              >
                <Tab label="Songs" />
                <Tab label="Albums" />
                <Tab label="Artists" />
              </Tabs>
            </AppBar>
          </Container>
        </Grid>
        {loading ? (
          <Grid container alignContent="center" justify="space-around">
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <Grid item xl={12} lg={12} sm={12} xs={12}>
              <Container maxWidth="lg" hidden={tabIndex !== 0}>
                <DisplayTracks
                  data={data.tracks}
                  numItems={numItems}
                  rowLength={rowLength}
                  history={history}
                />
              </Container>
            </Grid>
            <Grid item xl={12} lg={12} sm={12} xs={12}>
              <Container maxWidth="lg" hidden={tabIndex !== 1}>
                <DisplayAlbums
                  data={data.albums}
                  numItems={numItems}
                  rowLength={rowLength}
                  history={history}
                />
              </Container>
            </Grid>
            <Grid item xl={12} lg={12} sm={12} xs={12}>
              <Container maxWidth="lg" hidden={tabIndex !== 2}>
                <DisplayArtists
                  data={data.artists}
                  numItems={numItems}
                  rowLength={rowLength}
                  history={history}
                />
              </Container>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
}

//how to lay items out
function ItemLayout({ data, headerName, getItemData, rowLength, history }) {
  const classes = useStyles();
  const val = data.map((item) => getItemData(item));

  return (
    <List className={classes.root}>
      {val.map((item) => {
        const hasImage = item.imgArr.length > 0;

        const imageSrc = hasImage
          ? item.imgArr[item.imgArr.length - 1].url
          : "";
        return (
          <>
            <ListItem
              alignItems="flex-start"
              divider
              button
              key={item.id}
            
            >
              <ListItemAvatar>
                <Avatar alt={item.name} src={imageSrc} />
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={item.description}
              />
              <ListItemSecondaryAction>
                <ButtonGroup
                  variant="text"
                  color="primary"
                  aria-label="text primary button group"
                  orientation="vertical"
                  size="small"
                >
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      history.push(`${item.link}`);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      history.push(`/generate${item.link}`);
                    }}
                  >
                    Generate
                  </Button>
                </ButtonGroup>
              </ListItemSecondaryAction>
            </ListItem>
          </>
        );
      })}
    </List>
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

export default DisplaySearchResults;

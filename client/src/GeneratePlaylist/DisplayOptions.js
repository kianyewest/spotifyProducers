import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import { Button, Dialog, DialogTitle, TextField } from "@material-ui/core";

import CircularProgress from "@material-ui/core/CircularProgress";
import { useHistory } from 'react-router-dom';
import { doLogin } from "../Login";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

function DisplayOptions({
  playlistInfo,
  setPlaylistInfo,
  createPlaylist,
  percentageLoaded,
  state,
  dispatch
}) {
  const classes = useStyles();

  const Modal = () => {
    return (
      <Dialog
        onClose={() => {
          setPlaylistInfo((prev) => {
            return { ...prev, displayDialog: false };
          });
        }}
        aria-labelledby="simple-dialog-title"
        open={playlistInfo.displayDialog}
      >
        <DialogTitle id="simple-dialog-title">Created Playlist!</DialogTitle>
        <Button>
          <a href={playlistInfo.id && playlistInfo.id.external_urls.spotify}>
            View Playlist
          </a>
        </Button>
      </Dialog>
    );
  };

  const historyOnPageLoad = useHistory().location;
  return (
    <div className={classes.root}>
      <Modal />
      <form noValidate autoComplete="off">
        <TextField
          id="outlined-basic"
          label="Playlist Name"
          variant="filled"
          value={playlistInfo.name}
          onChange={(e) =>
            setPlaylistInfo((prev) => {
              return { ...prev, name: e.target.value };
            })
          }
        />
      </form>
      {state.isUserAuthenticated ? (
        <>
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              disabled={percentageLoaded < 100 || playlistInfo.creating}
              onClick={() => createPlaylist()}
            >
              Create Playlist
            </Button>
            {playlistInfo.creating && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
          {percentageLoaded < 100 && (
            <CircularProgress variant="determinate" value={percentageLoaded} />
          )}
        </>
      ) : (
        <Button
        variant="contained"
              color="primary"
            onClick={() => {
              doLogin(
                historyOnPageLoad,
                {},
                dispatch
              );
            }}
          >
            Please Login to Save
          </Button>
      )}
    </div>
  );
}

export default DisplayOptions;

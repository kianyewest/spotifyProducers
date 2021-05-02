// import { Layout } from 'antd';
import React from "react";
import { MemoryRouter as Router } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from "./Context/context";
import { doLogin } from "./Login";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Hidden from '@material-ui/core/Hidden';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  spacer: {
    flexGrow: 1,
  },
}));




const Navigation = ({ Logout, spotify }) => {
  const classes = useStyles();
  const { state, dispatch } = React.useContext(AuthContext);
  const historyOnPageLoad = useHistory().location;
  return (
    <>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
          <Hidden xsDown>
            <Typography variant="h5" color="inherit" component={RouterLink} to="/">
              spotifyGenius
            </Typography>
            <div className={classes.spacer}></div>
            </Hidden>
            <Button color="inherit" component={RouterLink} to="/">
              Home
            </Button>
            <Hidden smUp><div className={classes.spacer}></div></Hidden>
            {state.isUserAuthenticated ? (
              <Button onClick={Logout} color="inherit">
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => {
                  doLogin(historyOnPageLoad, {}, dispatch);
                }}
                color="inherit"
              >
                Login To Spotify
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </div>
    </>
  );
};

export default Navigation;

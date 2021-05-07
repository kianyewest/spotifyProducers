import React from "react";
import { useState } from "react";

import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import DisplaySearchResults from "./DisplaySearchResults";
import TextField from "@material-ui/core/TextField";

const emptyState = {
  tracks: [],
  albums: [],
  artists: [],
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  search: {
    marginTop: "5em",
    marginBottom:"5em",
  },
}));

function NewSearch({ spotify }) {
  const [data, setData] = useState(emptyState);
  const [searchTerm, setSearchTerm] = useState("");
  const [prevSearch, setPrevSearch] = useState(null);
  const [loading, setLoading] = useState(false);

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
        
        
          <DisplaySearchResults data={data} loading={loading}/>
    
    </div>
  );
}

export default NewSearch;

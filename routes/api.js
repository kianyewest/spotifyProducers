const routes = require("express").Router();
const axios = require("axios");
const config = (query) => {
  return {
    method: "get",
    url: `https://api.genius.com/${query}`,
    headers: {
      Authorization: `Bearer ${process.env.GENIUS_BEARER_TOKEN}`,
    },
  };
};

var searchConfig = (query) => {
  return config(`search?q=${query}`);
};

const searchGeniusWithQuery = (query, artistName) => {
  return new Promise(function (resolve, reject) {
    axios(searchConfig(query))
      .then(function (response) {
        const filteredForArtist = response.data.response.hits.filter(
          (result) => {
            return result.result.primary_artist.name === artistName;
          }
        );

        if (filteredForArtist.length > 0) {
          resolve({ noResult: false, result: filteredForArtist });
        } else {
          resolve({ noResult: true });
        }
      })
      .catch(function (error) {
        reject({ noResult: true, error: error });
      });
  });
};

const searchGenius = (trackName, artistName) => {
  return new Promise(function (resolve, reject) {
    const query = trackName ? trackName + " by " + artistName : artistName;

    searchGeniusWithQuery(query, artistName)
      .then(function (response) {
        console.log("resp: ", response);
        if (response.noResult) {
          resolve(searchGeniusWithQuery(artistName, artistName).then(
            (response) => response,
            (error) => error
          ))
        } else {
          resolve( response);
        }
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

//Search Genius
routes.get("/search", (req, res) => {
  const result = searchGenius(req.query.firstTrack, req.query.artistName).then(
    (response) =>{res.send(JSON.stringify(response.result))},
            (error) => res.send(JSON.stringify(error))
  );
  
  
});

var songConfig = (id) => {
  return config(`songs/${id}`);
};

// create a GET route
routes.get("/song", (req, res) => {
  // res.send({working:"its working"});

  const query = req.query.id;
  console.log("hit API with id: ", query);
  axios(songConfig(query))
    .then(function (response) {
      res.send(JSON.stringify(response.data.response.song));
    })
    .catch(function (error) {
      console.log(error);
    });
});

var artistConfig = (id) => {
  return config(`artists/${id}`);
};

routes.get("/artist", (req, res) => {
  const id = req.query.artistId;
  console.log("hit API with artist id: ", id);
  axios(artistConfig(id))
    .then(function (response) {
      // console.log("res: ",response.data)
      // console.log("hm: ",response.data.response.artist)
      // res.send(JSON.stringify({x:4,y:3}))
      res.send(JSON.stringify(response.data.response.artist));
    })
    .catch(function (error) {
      console.log(error);
    });
});

var artistSongConfig = (id, pageNum) => {
  return config(
    `artists/${id}/songs?per_page=50&page=${pageNum}&sort=popularity`
  );
};

routes.get("/artist/songs", (req, res) => {
  const id = req.query.artistId;
  var pageNum = 1;
  if (typeof req.query.pageNum !== "undefined") {
    pageNum = req.query.pageNum;
  }
  console.log("hit API with artist id: ", id);
  axios(artistSongConfig(id, pageNum))
    .then(function (response) {
      res.send(JSON.stringify(response.data.response));
    })
    .catch(function (error) {
      console.log(error);
    });
});

routes.get("/getProducers", (req, res) => {
  console.log("req.query", req.query);
  const spotifyArtistId = req.query.spotifyArtistId;
  const spotifyAlbumId = req.query.spotifyAlbumId;
  const spotifySongId = req.query.spotifySongId;
});

module.exports = routes;

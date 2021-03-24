const routes = require('express').Router();
const axios = require("axios");
const config = (query) => {
  return {
    method: "get",
    url: `https://api.genius.com/${query}`,
    headers: {
      Authorization:
        `Bearer ${process.env.GENIUS_BEARER_TOKEN}`,
    },
  };
};

var searchConfig = (query) => {
  return config(`search?q=${query}`);
};

// create a GET route
routes.get("/search", (req, res) => {
  // res.send({working:"its working"});

  const query = req.query.firstTrack ? req.query.firstTrack + " by " + req.query.artistName : req.query.artistName;
  console.log("hit API with: ", query);
  axios(searchConfig(query))
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      const filteredForArtist = response.data.response.hits.filter((result) => {
        return result.result.primary_artist.name === req.query.artistName;
      });

      if (filteredForArtist.length > 0) {
        // const filteredForArtist = response.data.response.hits.filter((result)=>{return result.result.primary_artist.name === req.query.artistName})
        res.send(JSON.stringify(filteredForArtist));
      } else {
        //try to get a response one more time. Just search for artist
        console.log("trying again");
        const nextQuery = req.query.firstTrack;
        axios(searchConfig(nextQuery)).then(function (response) {
          const filteredForArtist = response.data.response.hits.filter(
            (result) => {
              return result.result.primary_artist.name === req.query.artistName;
            }
          );
          console.log("f", filteredForArtist);
          res.send(JSON.stringify(filteredForArtist));
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
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

var artistSongConfig = (id,pageNum) => {
  return config(`artists/${id}/songs?per_page=50&page=${pageNum}&sort=popularity`);
};

routes.get("/artist/songs", (req, res) => {
  const id = req.query.artistId;
  var pageNum = 1;
  if(typeof(req.query.pageNum)!=='undefined'){
    pageNum = req.query.pageNum
  }
  console.log("hit API with artist id: ", id);
  axios(artistSongConfig(id,pageNum))
      .then(function (response) {
        res.send(JSON.stringify(response.data.response));
      })
      .catch(function (error) {
        console.log(error);
      });
  
});


module.exports = routes;
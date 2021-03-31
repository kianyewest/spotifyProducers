const routes = require("express").Router();
const axios = require("axios");
const SpotifyWebApi = require("spotify-web-api-node");
const spotifyApi = new SpotifyWebApi();

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
  console.log("trying to search for: ", trackName, artistName);
  return new Promise(function (resolve, reject) {
    const query = trackName ? trackName + " by " + artistName : artistName;

    searchGeniusWithQuery(query, artistName)
      .then(function (response) {
        console.log("resp: ", response);
        if (response.noResult) {
          resolve(
            searchGeniusWithQuery(artistName, artistName).then(
              (response) => response,
              (error) => error
            )
          );
        } else {
          resolve(response);
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
    (response) => {
      console.log("sending back:", response);
      res.send(JSON.stringify(response));
    },
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

function ConvertProducers(arrGeniusProducer) {
  // Create an array of promises
  var promises = [];
  arrGeniusProducer.map((producer) => {
    promises.push(
      new Promise(function (resolve, reject) {
        console.log("prod: ", producer);
        const id = producer.id;
        axios(artistConfig(id))
          .then(function (response) {
            resolve(response.data.response.artist);
          })
          .catch(function (error) {
            reject(error);
          });
      })
    );
  });

  // Return a Promise.all promise of the array
  return Promise.all(promises);
}

routes.get("/getProducers", async (req, res) => {
  const spotifyArtistId = req.query.spotifyArtistId;
  const spotifyAlbumId = req.query.spotifyAlbumId;
  const spotifyTrackId = req.query.spotifyTrackId;
  const spotifyAccessToken = req.query.spotifyAccessToken;
  spotifyApi.setAccessToken(spotifyAccessToken);
  try {
    if (spotifyTrackId) {
      //get Track from spotify
      const spotifyData = await spotifyApi.getTrack(spotifyTrackId);
      //search genius for found track
      geniusData = await searchGenius(spotifyData.body.name, spotifyData.body.artists[0].name);
      if (geniusData.result.length > 0) {
        const geniusId = geniusData.result[0].result.id;
        //get genius producer id from found result
        const producers = await axios(songConfig(geniusId))
        const song = producers.data.response.song;
        //get producers info from id's
        const data = await ConvertProducers(song.producer_artists)
        console.log("data was: ", data);
        res.send(JSON.stringify(data));
      }else{
        res.send(JSON.stringify(geniusData));
      }
    }
  } catch (error) {
    console.log("some error: ", error);
    res.send(JSON.stringify(error));
  }
});

module.exports = routes;

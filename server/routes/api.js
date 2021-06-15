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
  return new Promise(function (resolve, reject) {
    const query = trackName ? trackName + " " + artistName : artistName;

    searchGeniusWithQuery(query, artistName)
      .then(function (response) {
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

var artistSongConfig = (id, pageNum, numPerPage = 50) => {
  //numPerPage <=50

  return config(
    `artists/${id}/songs?per_page=${Math.min(
      numPerPage,
      50
    )}&page=${pageNum}&sort=popularity`
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

/**
 * Returns promise of songs from genius artist
 * @param {number} artistId  genius artist ID
 */
function getSongs(artistId) {
  return new Promise(async function (resolve, reject) {
    try {
      var nextPage = 1;
      const results = [];
      while (nextPage) {
        const firstResult = await axios(artistSongConfig(artistId, nextPage));
        const data = firstResult.data.response;
        results.push(...data.songs);
        nextPage = null;
        //  nextPage = data.next_page;
      }
      // const diffArtist = results.filter(
      //   (track) => track.primary_artist.id !== artistId
      // );
      resolve(results);
    } catch (error) {
      console.log("some error: ", error);
      reject(error);
    }
  });
}

/**
 * Returns an array of producers and their respective songs
 * @param {array} producers
 */
const getSongsByProducers = async (producers) => {
  //get all songs by producers
  var producersSongs = [];
  producers.map((producer) => {
    producersSongs.push(
      new Promise(async function (resolve, reject) {
        try {
          const songs = await getSongs(producer.id);
          resolve({
            producer: producer,
            songs: songs,
          });
        } catch (error) {
          reject(error);
        }
      })
    );
  });

  return Promise.all(producersSongs);
};

/** */
/**
 * Returns a promise containing songs by the producers of the given track
 * @param {string} spotifyAccessToken
 * @param {string} spotifyTrackId
 */
const doTrack = async (spotifyAccessToken, spotifyTrackId) => {
  spotifyApi.setAccessToken(spotifyAccessToken);

  //get Track from spotify
  const spotifyData = await spotifyApi.getTrack(spotifyTrackId,{market:"NZ"});
  //search genius for found track
  geniusData = await searchGenius(
    spotifyData.body.name,
    spotifyData.body.artists[0].name
  );
  if(geniusData.noResult){
    return geniusData;
  }
  
  const trackId = geniusData.result[0].result.id;

  //get producers
  const fullSongData = await axios(songConfig(trackId));
  const originalSong = fullSongData.data.response.song;
  const originalArtistGeniusId = originalSong.primary_artist.id;
  const producers = originalSong.producer_artists;

  // const songs = await getSongsByProducers(producers);
  return {
    primaryArtists: [originalArtistGeniusId],
    producers: producers,
  };
  
};

const getProducersOfAlbumFromTrack = async (firstTrackName,artistName) => {
  
  //search genius for found track
  const geniusData = await searchGenius(
    firstTrackName,
    artistName,
  );
  const trackId = geniusData.result[0].result.id;

  const fullSongData = await axios(songConfig(trackId));
  const originalSong = fullSongData.data.response.song;
  const originalArtistGeniusId = originalSong.primary_artist.id;

  const albumData = await axios(config(`albums/${originalSong.album.id}`));
  const producers = albumData.data.response.album.song_performances.find(
    (preformer) => {
      return preformer.label === "Producers";
    }
  ).artists;

  return {
    originalArtistGeniusId: originalArtistGeniusId,
    producers: producers,
  };
};
/**
 * Returns a promise containing songs by the producers of the given album
 * @param {string} spotifyAccessToken
 * @param {string} spotifyAlbumId
 */
const doAlbum = async (spotifyAccessToken, spotifyAlbumId) => {
  spotifyApi.setAccessToken(spotifyAccessToken);

  //get Track from spotify
  const spotifyData = await spotifyApi.getAlbum(spotifyAlbumId,{market:"NZ"});
  const firstTrackName = spotifyData.body.tracks.items[0].name;
  const artistName = spotifyData.body.artists[0].name;
  const data = await getProducersOfAlbumFromTrack(
    firstTrackName,
    artistName
  );
  if(data.noResult){
    return data;
  }
  
  // const songs = await getSongsByProducers(producers);
  return {
    primaryArtists: [data.originalArtistGeniusId],
    producers: data.producers,
  };
};

const doArtist = async (spotifyAccessToken, spotifyArtistId) => {
  spotifyApi.setAccessToken(spotifyAccessToken);
  //get Albums from spotify
  const spotifyData = await spotifyApi.getArtistAlbums(spotifyArtistId,{limit:50,market:"NZ",include_groups:"album"});
  
  
  const albumsPromise = spotifyData.body.items.map(async (album) => {
    return spotifyApi.getAlbum(album.id,{market:"NZ"});
  });

  const uniqueFirstTrack = new Map();
  const albums = await Promise.all(albumsPromise);
  //get first track of each
  //stops duplicate albums from being searched
  albums.forEach(element => {
    const firstTrackName = element.body.tracks.items[0].name;
    const artistName = element.body.artists[0].name;
    uniqueFirstTrack.set(firstTrackName,artistName);
  });

  const producerPromises = [];
  uniqueFirstTrack.forEach((artistName,trackName)=>{
    producerPromises.push(getProducersOfAlbumFromTrack(trackName,artistName));
  });
    
    

  const producers = await Promise.all(producerPromises);

  const primaryArtists = [];
  const myMap = new Map();
  producers.forEach((data) => {
    primaryArtists.push(data.originalArtistGeniusId);
    data.producers.forEach((element) => {
      myMap.set(element.id, element);
    });
  });

  return {primaryArtists:primaryArtists,producers:Array.from(myMap.values())};
};

routes.get("/getProducers", async (req, res) => {
  const spotifyArtistId = req.query.spotifyArtistId;
  const spotifyAlbumId = req.query.spotifyAlbumId;
  const spotifyTrackId = req.query.spotifyTrackId;
  const spotifyAccessToken = req.query.spotifyAccessToken;
  try {
    var data = {};
    if (spotifyTrackId) {
      data = await doTrack(spotifyAccessToken, spotifyTrackId);
    } else if (spotifyAlbumId) {
      data = await doAlbum(spotifyAccessToken, spotifyAlbumId);
    } else if (spotifyArtistId) {
      data = await doArtist(spotifyAccessToken, spotifyArtistId);
    }

    res.send(JSON.stringify(data));
  } catch (error) {
    console.log("errored here", error);
    res.send(JSON.stringify(error));
  }
});

routes.get("/getProducerSongs", async (req, res) => {
  const geniusProducerId = req.query.geniusProducerId;
  try {
    const data = await getSongsByProducers([{id:geniusProducerId}]);
    //filter the primary artist from producer results
      //should only be one result
      
      const filteredData = data[0].songs.filter(
        (localSong) =>
          localSong.primary_artist.id !== geniusProducerId
      );
      const songsByOtherArtists =  {
        producer: data[0].producer,
        songs: filteredData,
      };
   

    res.send(JSON.stringify(songsByOtherArtists));
  } catch (error) {
    console.log("errored here", error);
    res.send(JSON.stringify(error));
  }
});

module.exports = routes;

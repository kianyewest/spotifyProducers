const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
var axios = require("axios");

var searchConfig = (query) => {
  return {
    method: "get",
    url: `https://api.genius.com/search?q=${query}`,
    headers: {
      Authorization:
        "Bearer Vc3TTP0H4K725TiOtFBrERqNRQA2LSbg5s_YHqUaUVjqUUXUAcFBH22tUO1X--gd",
      Cookie: "__cfduid=d938a28355c93f4c414c99724297184811615539778",
    },
  };
};

// create a GET route
app.get("/api/search", (req, res) => {
  // res.send({working:"its working"});
 
  const query = req.query.firstTrack + " by " + req.query.artistName
  console.log("hit API with: ", query);
  axios(searchConfig(query))
    .then(function (response) {
      console.log(response.data)
      const filteredForArtist = response.data.response.hits.filter((result)=>{return result.result.primary_artist.name === req.query.artistName})
       
      if(filteredForArtist.length>0){
        // const filteredForArtist = response.data.response.hits.filter((result)=>{return result.result.primary_artist.name === req.query.artistName})
        res.send(JSON.stringify(filteredForArtist));
      }else{
        //try to get a response one more time. Just search for artist
        console.log("trying again")
        const nextQuery = req.query.firstTrack
        axios(searchConfig(nextQuery))
        .then(function (response) {
          const filteredForArtist = response.data.response.hits.filter((result)=>{return result.result.primary_artist.name === req.query.artistName})
          console.log("f",filteredForArtist)
          res.send(JSON.stringify(filteredForArtist));
        })
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

var songConfig = (id) => {
  return {
    method: "get",
    url: `https://api.genius.com/songs/${id}`,
    headers: {
      Authorization:
        "Bearer Vc3TTP0H4K725TiOtFBrERqNRQA2LSbg5s_YHqUaUVjqUUXUAcFBH22tUO1X--gd",
      Cookie: "__cfduid=d938a28355c93f4c414c99724297184811615539778",
    },
  };
};

// create a GET route
app.get("/api/song", (req, res) => {
  // res.send({working:"its working"});
 
  const query = req.query.id
  console.log("hit API with id: ", query);
  axios(songConfig(query))
    .then(function (response) {
      console.log("res: ",response.data)
      // res.send(JSON.stringify({ x: 5, y: 6 }))
      console.log("returning: ",response.data.response.song)
      res.send(JSON.stringify(response.data.response.song));
    })
    .catch(function (error) {
      console.log(error);
    });
  // res.send(JSON.stringify({ x: 5, y: 6 }))
});


app.get("/calback", (req, res) => {
  console.log("huh..");
});

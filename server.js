require('dotenv').config()
const app = require('express')();
const apiRoute = require('./routes/api')
const loginRoute = require('./routes/login')

//  Connect all our routes to our application
app.use('/api', apiRoute);
app.use('/login', loginRoute);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello ur at \"/\" nothing here' });
});

const port = process.env.PORT || 8080;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));




// var tools = require('./login');
// console.log(typeof tools.foo); // => 'function'
// console.log(typeof tools.bar); // => 'function'

// const config = (query) => {
//   return {
//     method: "get",
//     url: `https://api.genius.com/${query}`,
//     headers: {
//       Authorization:
//         "Bearer Vc3TTP0H4K725TiOtFBrERqNRQA2LSbg5s_YHqUaUVjqUUXUAcFBH22tUO1X--gd",
//       Cookie: "__cfduid=d938a28355c93f4c414c99724297184811615539778",
//     },
//   };
// };

// var searchConfig = (query) => {
//   return config(`search?q=${query}`);
// };

// // create a GET route
// app.get("/api/search", (req, res) => {
//   // res.send({working:"its working"});

//   const query = req.query.firstTrack ? req.query.firstTrack + " by " + req.query.artistName : req.query.artistName;
//   console.log("hit API with: ", query);
//   axios(searchConfig(query))
//     .then(function (response) {
//       console.log(JSON.stringify(response.data));
//       const filteredForArtist = response.data.response.hits.filter((result) => {
//         return result.result.primary_artist.name === req.query.artistName;
//       });

//       if (filteredForArtist.length > 0) {
//         // const filteredForArtist = response.data.response.hits.filter((result)=>{return result.result.primary_artist.name === req.query.artistName})
//         res.send(JSON.stringify(filteredForArtist));
//       } else {
//         //try to get a response one more time. Just search for artist
//         console.log("trying again");
//         const nextQuery = req.query.firstTrack;
//         axios(searchConfig(nextQuery)).then(function (response) {
//           const filteredForArtist = response.data.response.hits.filter(
//             (result) => {
//               return result.result.primary_artist.name === req.query.artistName;
//             }
//           );
//           console.log("f", filteredForArtist);
//           res.send(JSON.stringify(filteredForArtist));
//         });
//       }
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// });

// var songConfig = (id) => {
//   return config(`songs/${id}`);
// };

// // create a GET route
// app.get("/api/song", (req, res) => {
//   // res.send({working:"its working"});

//   const query = req.query.id;
//   console.log("hit API with id: ", query);
//   axios(songConfig(query))
//     .then(function (response) {
//       res.send(JSON.stringify(response.data.response.song));
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// });

// var artistConfig = (id) => {
//   return config(`artists/${id}`);
// };

// app.get("/api/artist", (req, res) => {
//   const id = req.query.artistId;
//   console.log("hit API with artist id: ", id);
//   axios(artistConfig(id))
//     .then(function (response) {
//       // console.log("res: ",response.data)
//       // console.log("hm: ",response.data.response.artist)
//       // res.send(JSON.stringify({x:4,y:3}))
//       res.send(JSON.stringify(response.data.response.artist));
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// });

// var artistSongConfig = (id,pageNum) => {
//   return config(`artists/${id}/songs?per_page=50&page=${pageNum}&sort=popularity`);
// };

// app.get("/api/artist/songs", (req, res) => {
//   const id = req.query.artistId;
//   var pageNum = 1;
//   if(typeof(req.query.pageNum)!=='undefined'){
//     pageNum = req.query.pageNum
//   }
//   console.log("hit API with artist id: ", id);
//   axios(artistSongConfig(id,pageNum))
//       .then(function (response) {
//         res.send(JSON.stringify(response.data.response));
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
  
// });

// app.get("/calback", (req, res) => {
//   console.log("huh..");
// });

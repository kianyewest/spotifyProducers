const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
var axios = require('axios');

var config = (query)=> { return {
  method: 'get',
  url: `https://api.genius.com/search?q=${query}`,
  headers: { 
    'Authorization': 'Bearer Vc3TTP0H4K725TiOtFBrERqNRQA2LSbg5s_YHqUaUVjqUUXUAcFBH22tUO1X--gd', 
    'Cookie': '__cfduid=d938a28355c93f4c414c99724297184811615539778'
  }
}
};



// create a GET route
app.get('/api', (req, res) => {
    // res.send({working:"its working"});
    console.log("hit API with: ",req.query.searchTerm)
    axios(config(req.query.searchTerm))
    .then(function (response) {
        const d = JSON.stringify(response.data)
    console.log(d);
    res.send(d);
    })
    .catch(function (error) {
    console.log(error);
    });
     
});

app.get('/calback', (req, res) => {
    console.log("huh..")
  });
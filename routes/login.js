// https://www.youtube.com/watch?v=f5OLDvwP-Ug
const routes = require('express').Router();
let request = require('request')
let querystring = require('querystring')

let redirect_uri = 
  process.env.REDIRECT_URI || 
  'http://localhost:8080/login/callback'

  const scopes = [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
    "user-modify-playback-state",
    "user-library-modify",
    "user-library-read",
    "user-read-email",
    "user-read-private",
  ];

routes.get('/', (req, res) => {
  console.log("at login")
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scopes.join("%20"),
      redirect_uri
    }))
});

routes.get('/callback', (req, res) => {
  console.log("at login callback")
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    console.log(body)
    const access_token = body.access_token
    const expires_in = body.expires_in
    const refresh_token = body.refresh_token
    const uri = process.env.FRONTEND_URI || 'http://localhost:3000'
    res.redirect(uri + '?access_token=' + access_token+"&expires_in="+expires_in+"&refresh_token="+refresh_token)
  })
  });
  

  routes.get('/work', function(req, res) {
    console.log("work called")
    res.send(JSON.stringify({hello:"yoyo"}));
  });

  routes.get('/refresh_token', function(req, res) {
    console.log("HELLLOOOOOO\n\n\n\n\nHOOOOO")
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    console.log('token: ',refresh_token)
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }else{
        res.send(body);
      }
      
    });
  });
module.exports = routes;
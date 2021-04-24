module.exports = {
  apps : [
      {
        name: "runSpotifyServer",
        script: "./server.js",
        watch: true,
        env: {
          "NODE_ENV": "production",
          "SPOTIFY_CLIENT_ID":"${SPOTIFY_CLIENT_ID}",
		"SPOTIFY_CLIENT_SECRET":"${SPOTIFY_CLIENT_SECRET}",
		"FRONTEND_URI":"${FRONTEND_URI}",
		"REDIRECT_URI":"${REDIRECT_URI}",
		"GENIUS_BEARER_TOKEN":"${GENIUS_BEARER_TOKEN}",
		"REACT_APP_BACKEND_LINK":"${REACT_APP_BACKEND_LINK}",
        }
      }
  ]
}


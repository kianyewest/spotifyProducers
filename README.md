#What is this?

This webapp creates a spotify playlist based on the producers of given songs. Users can generate a playlist from a song or album (artist support coming soon). 

The producers are found through the Genius api. 

# Getting Started


### To run the server

  	node server.js
  	
  or
  
  	nodemon server.js
  	
  This allows for authentication and calls to the api's. 
  
### To run the site:
open another terminal 
  
  	npm start
  	
 
### Credentials

The following three enviroment variables need to be set.

SPOTIFY_CLIENT_ID 
SPOTIFY_CLIENT_SECRET
GENIUS_BEARER_TOKEN  
  
 These can be set in the terminal running the server. To do so type the following into terminal
 
  	export SPOTIFY_CLIENT_ID="<SPOTIFY_CLIENT_ID>"
  
  or defined in a ".env" file, placed in the root directory.
  Each variable within the file is defined like below (Note: no quotation marks)
  
  	SPOTIFY_CLIENT_ID= <SPOTIFY_CLIENT_ID>
  
  
  see [Here](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html) for more information on enviroment variables
  
  
### Future plans

- Host on AWS
- Create playlist based on artist
- Store link between spotify song ID and genius song ID in database
import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";


function ViewArtist({spotify}) {
    const [spotifyResults, setSpotifyResults] = useState();

    const match = useRouteMatch();
    const history = useHistory();
    const spotifyArtistId = match.params.spotifyArtistId;
     useEffect(()=>{
        spotify.getArtist(spotifyArtistId).then(
            function (data) {
              console.log('Artists information', data);
              setSpotifyResults(data);
              fetch(
                process.env.REACT_APP_BACKEND_LINK+"api/search?" +
                  new URLSearchParams({
                    artistName: data.name,
                    // albumName: data.name,
                    // firstTrack: data.tracks.items[0].name,
                  })
              )
                .then((res) => res.json())
                .then((data) => {
                  console.log("genius artist: ", data);
                  if(data[0]){
                    history.push(`/producer/${data[0].result.primary_artist.id}`)
                  }  
                });
            
            },
            function (err) {
              console.error(err);
            }
          )
     },[]) 
    return (
        <div>
            Artist page: {spotifyResults && spotifyResults.name}
        </div>
    )
}

export default ViewArtist

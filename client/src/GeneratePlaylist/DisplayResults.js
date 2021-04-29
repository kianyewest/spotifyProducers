import React,{useEffect,useState} from "react";
import DisplayProducers from "./DisplayProducers";
import { useRouteMatch } from "react-router-dom";
import { AuthContext } from "../Context/context";

function DisplayResults() {
  const { state, dispatch } = React.useContext(AuthContext);
  const [producers, setProducers] = useState([]);
  const match = useRouteMatch();
  const type = (val) => {
    switch (val) {
      case "artist":
        return "spotifyArtistId";
      case "album":
        return "spotifyAlbumId";
      case "track":
        return "spotifyTrackId";
      default:
        return "ERROR";
    }
  };
  useEffect(() => {
    //loading from local storage is just for development
    fetch(
      process.env.REACT_APP_BACKEND_LINK +
        "api/getProducers?" +
        new URLSearchParams({
          spotifyAccessToken: state.accessToken,
          [type(match.params.type)]: match.params.id,
        })
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log("just set it to: ", data.producers, producers);
        setProducers(data.producers);
        data.producers.forEach((localProducer) => {
            fetch(
              process.env.REACT_APP_BACKEND_LINK +
                "api/getProducerSongs?" +
                new URLSearchParams({
                  geniusProducerId: localProducer.id,
                })
            )
              .then((res) => res.json())
              .then((result) => {
                if(result ===null){
                    console.log("result was null",result);
                    return;
                }  
                if(result.songs ===null){
                    console.log("result.songs was null",result);
                    return;
                } 
                // console.log("returned: ", producers, result);
                //remove null or any empty songs
                const songs = result.songs.filter(Boolean)
                if(songs.length!== result.songs.length){
                    console.log("removed: ",result.songs,songs);
                }
                localProducer.songs = songs;
                setProducers([...data.producers]);
              });
        });
      })
      .catch((error) => {
        console.log(error);
        window.alert(
          "unable to load data, may need to be logged in?: " +
            JSON.stringify(error)
        );
      });
  }, []);

  return producers ? <DisplayProducers producers={producers}/>:<h1>Loading</h1>
}

export default DisplayResults;

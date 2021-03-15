import React,{useState,useEffect} from 'react'
import { useRouteMatch } from 'react-router-dom';
import { useDataLayerValue } from "./DataLayer";
import { ListGroup, Form,FormControl,Button,Dropdown} from 'react-bootstrap';

// const spotify = new SpotifyWebApi();

function View({spotify}) {
    const [state, dispatch] = useDataLayerValue();
    const [album,setAlbum] = useState()
    // spotify.setAccessToken(state.token);
    console.log("the state: ",state);
    const match = useRouteMatch();
    console.log("match:",match);
    // spotify.search
   
    useEffect(()=>{
        spotify.getAlbum(match.params.id).then(
        function (data) {
          console.log('Albums information', data);
          setAlbum(data);
        },
        function (err) {
          console.error(err);
        }
      )},[])

      const showTracks = (track,imageUrl) =>  {
      return   <ListGroup.Item key={track.id}><img   src={album.images[2].url}/>{track.name} {track.artists[0].name} </ListGroup.Item>
      }  
    return (
        <div>
            
            <ListGroup> 
            {console.log("info: ",album)} {console.log("info: ",album)}  {album && album.tracks.items.map((track) => showTracks(track))}
             </ListGroup>
        </div>
    )
}

export default View

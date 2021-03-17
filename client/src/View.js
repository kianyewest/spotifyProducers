import React,{useState,useEffect} from 'react'
import { useRouteMatch } from 'react-router-dom';
import { useDataLayerValue } from "./DataLayer";
import { ListGroup, Form,FormControl,Button,Dropdown} from 'react-bootstrap';

// const spotify = new SpotifyWebApi();

function View({spotify}) {
    const [state, dispatch] = useDataLayerValue();
    const [album,setAlbum] = useState()
    // spotify.setAccessToken(state.token);
    // console.log("the state: ",state);
    const match = useRouteMatch();
    // console.log("match:",match);
    // spotify.search
  
    const searchUrl = 'https://api.genius.com/search?q='+'jim-e%20stack';
    // const apiKey = 'Vc3TTP0H4K725TiOtFBrERqNRQA2LSbg5s_YHqUaUVjqUUXUAcFBH22tUO1X--gd';
    // const apiKey = 'L1sIlV88Kz4vDJiy814FmTHYyMT0qzC-cWLklwbDW9DLTVvXfdTa88yn-z6E6rwo';
    const apiKey = 'e9Xmxeb_M1d0DBlFGF6hLBOYKcECCTgjF3n_Nq9XltB0Ck_6XgrpBj4zz_ybRa0z'
    const headers = {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    

    useEffect(()=>{
        spotify.getAlbum(match.params.id).then(
          function (data) {
            // console.log('Albums information', data);
            setAlbum(data);
          },
          function (err) {
            console.error(err);
          }
        )
        console.log("about to fetch")
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer Vc3TTP0H4K725TiOtFBrERqNRQA2LSbg5s_YHqUaUVjqUUXUAcFBH22tUO1X--gd");
        myHeaders.append("Cookie", "__cfduid=d938a28355c93f4c414c99724297184811615539778");

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        // fetch("https://api.genius.com/search?q=Kendrick%20Lamar?access_token=wlT_33Mgf0b281FJf5NvVsVs0RzZipp16o5PAKztJnQ3gRgW8yOdi_dFKpA6DVkP")
        //   .then(response => response.text())
        //   .then(result => console.log(result))
        //   .catch(error => console.log('error', error));
      fetch("http://localhost:9000/users").then(response => response.json()).then(data => console.log(data));
        // fetch(searchUrl,{
        //   method: 'GET',
        //   withCredentials: true,
        //   credentials: 'include',
        //   headers:headers})
        // .then(response => console.log("hi?:",response))
        // .then(data => console.log("the result was: ",data));
    
    },[])

      const showTracks = (track,imageUrl) =>  {
      return   <ListGroup.Item key={track.id}><img   src={album.images[2].url}/>{track.name} {track.artists[0].name} </ListGroup.Item>
      }  
    return (
        <div>
            
            <ListGroup> 
            {album && album.tracks.items.map((track) => showTracks(track))}
             </ListGroup>
        </div>
    )
}

export default View

import React,{useState,useEffect} from 'react'
import { useRouteMatch } from 'react-router-dom';
import { useDataLayerValue } from "./DataLayer";
import { ListGroup,Image, Spinner} from 'react-bootstrap';


function View({spotify}) {
    const [state, dispatch] = useDataLayerValue();
    const [album,setAlbum] = useState()
    const [geniusResults,setGeniusResults] = useState();

    
    // spotify.setAccessToken(state.token);
    // console.log("the state: ",state);
    const match = useRouteMatch();
    // console.log("match:",match);
    // spotify.search

    useEffect(()=>{
        spotify.getAlbum(match.params.id).then(
          function (data) {
            console.log('Albums information', data);
            setAlbum(data);
        
              fetch('/api?'+ new URLSearchParams({searchTerm: data.artists[0].name}))
              .then(res => res.json())
              .then(data=>{
                
                console.log("data: ",data);
                setGeniusResults(data.response.hits)
              }) 
            
          },
          function (err) {
            console.error(err);
          }
        )    
    },[])

      const showTracks = (track,imageUrl) =>  {
      return   <ListGroup.Item key={track.id}><img   src={album.images[2].url}/>{track.name} {track.artists[0].name} </ListGroup.Item>
      }  
    return (
      <div class="container-fluid">
                <div class="row">
                    <div class="col-sm">
                    
                    <h2>spotify results</h2>

                    <ListGroup> 
                    {album ? album.tracks.items.map((track) => showTracks(track)): <Spinner animation="border" />}
                    </ListGroup>
                    </div>
                    <div class="col-sm">
                    <h2>geniusResults</h2>
                    <ListGroup> 
    { geniusResults ? geniusResults.map((result) => { return (
    
    <ListGroup.Item key={result.result.id}>
  
          <Image rounded width="64" src={result.result.header_image_thumbnail_url}/> {result.result.full_title}  

    </ListGroup.Item>
      
    )}):<Spinner animation="border" />}
                    </ListGroup>
                    </div>
                </div>
            </div>
        
            
            
        
    )
}

export default View

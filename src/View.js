import React,{useState,useEffect} from 'react'
import { useRouteMatch } from 'react-router-dom';
import { useDataLayerValue } from "./DataLayer";
import { ListGroup,Image, Spinner} from 'react-bootstrap';
import { Link } from 'react-router-dom';


function View({spotify}) {
    const [state, dispatch] = useDataLayerValue();
    const [spotifyResults,setResults] = useState()
    const [geniusResults,setGeniusResults] = useState();

    const match = useRouteMatch();


    const getSpotifyData = ()=>{
      switch(match.params.type) {
        case 'album':
          return spotify.getAlbum(match.params.id);
        case 'artist':
          return spotify.getArtist(match.params.id);
        case 'track':
          return spotify.getTrack(match.params.id);;
        default:
          return 'Error';
      }
    }

    const displaySpotifyData  = ()=>{
      console.log("displaying: ",match.params.type,spotifyResults)
      switch(match.params.type) {
        case 'album':
          return <ListGroup>{spotifyResults.tracks.items.map((track) => showTrack(track))}</ListGroup>
        case 'artist':
          return showArtist(spotifyResults);
        case 'track':
          return "Temp"
        default:
          return 'Unable to display data :(';
      }
    }


    
    // useEffect(()=>{
    //   getSpotifyData().then(
    //       function (data) {
    //         console.log('Albums information', data);
    //         setResults(data);
        
    //           fetch('/api?'+ new URLSearchParams({searchTerm: getGeniusSearchTerm() data.artists[0].name}))
    //           .then(res => res.json())
    //           .then(data=>{
                
    //             console.log("data: ",data);
    //             setGeniusResults(data.response.hits)
    //           }) 
            
    //       },
    //       function (err) {
    //         console.error(err);
    //       }
    //     )    
    // },[])

     
    return (
      <div class="container-fluid">
                <div class="row">
                    <div class="col-sm">
                    
                    <h2>spotify results</h2>
                    {spotifyResults ? displaySpotifyData(): <Spinner animation="border" />}
                    {/* <ListGroup> 
                    {album ? album.tracks.items.map((track) => showTracks(track)): <Spinner animation="border" />}
                    </ListGroup> */}
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

const showTrack = (track) =>  {
  return <Link to={{  pathname: `/view/track/${track.id}` }}>
    {/* /Get smallest image possible, to reduce loading time */}
<ListGroup.Item key={track.id}> {track.name} </ListGroup.Item>
</Link>
}

const showArtist = (artist) =>  {
  return 
    {/* /Get smallest image possible, to reduce loading time */}
<ListGroup.Item key={artist.id}> {artist.images.length && <img   src={artist.images[artist.images.length -1].url}/>}{artist.name} </ListGroup.Item>

}

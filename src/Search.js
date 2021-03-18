import React from 'react'
import { useEffect,useState } from 'react';
import { ListGroup, Form,FormControl,Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const searchTypes = ["track", "album" , "artist"]
const emptyState = {tracks:[],albums:[],artists:[]};
function Search({spotify}) {
  

    const [results,setResults] = useState(emptyState);
    const {tracks,albums,artists} = results;
    const [searchQuery, setSearchQuery] = useState("");
   
    const doSearch = (query = searchQuery) =>{
      query && spotify.search(query,searchTypes).then(
            function (newData) {
              console.log("new Data: ",query,newData);
              setResults(prevResults => {
                return {
                  ...emptyState
                };
              });
              if(newData.hasOwnProperty('albums')){
                console.log(typeof(newData.albums.items))
                
                newData.albums.items.sort((a,b)=>{
                  if(a.album_type === b.album_type){
                    return 0;
                  }else if(a.album_type ==="album"){
                    return -1;
                  }
                  return 1;
                })
                setResults(prevResults => {
                  return {
                    ...prevResults,
                    albums:(newData.albums.items)
                  };
                });
                
              }
              if(newData.hasOwnProperty('artists')){
                setResults(prevResults => {
                  return {
                    ...prevResults,
                    artists:newData.artists.items
                  };
                });
                
              }
              if(newData.hasOwnProperty('tracks')){
                setResults(prevResults => {
                  return {
                    ...prevResults,
                    tracks:newData.tracks.items
                  };
                });
                
              }
             

            },
            function (err) {
              console.error(err);
            }
          );
    }
    useEffect(()=>{
        searchQuery && doSearch();
    },[])//probably link useEffect to fire whenever search is updated

    const showAlbums = (album) =>  {
      return <Link to={{  pathname: '/album/'+album.id }}>
      <ListGroup.Item key={album.id}><img   src={album.images[2].url}/>{album.name} {album.artists[0].name}</ListGroup.Item>
    </Link>
    }
    const showArtists = (artist) =>  {
      return <Link to={{  pathname: '/artist/'+artist.id }}>
        {/* /Get smallest image possible, to reduce loading time */}
    <ListGroup.Item key={artist.id}> {artist.images.length && <img   src={artist.images[artist.images.length -1].url}/>}{artist.name} </ListGroup.Item>
    </Link>
    }

    const showTracks = (track) =>  {
      return <Link to={{  pathname: `/track/${track.id}` }}>
        {/* /Get smallest image possible, to reduce loading time */}
    <ListGroup.Item key={track.id}> {track.album.images.length && <img   src={track.album.images[track.album.images.length -1].url}/>}{track.name} </ListGroup.Item>
    </Link>
    }

   
    return (
            <div>
              
             <Form inline >
              <FormControl type="text" placeholder="Search" className="mr-sm-2" value={searchQuery} onInput={(e)=>{
                setSearchQuery(e.target.value);
                 if(e.target.value===''){
                   setResults(emptyState);
                  }else{
                     doSearch(e.target.value);
                    }
                  }} onsubmit={()=>alert("a")
                }/>
              {/* <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>type of Results: </Form.Label> */}
              {/* <Form.Control as="select" onChange={(e)=>{

                 if(e.target.value === "all"){
                  setSearch({...search,searchType:searchTypes});
                 }else{
                   console.log("setting to: ",e.target.value)
                  setSearch({...search,searchType:[e.target.value]});
                 }
                 
                 doSearch(searchQuery,e.target.value);
                 }}>
                
                <option value="all">all</option>
                 {searchTypes.map((type)=> <option value={type}>{type}</option>)}
                
              </Form.Control> */}
            {/* </Form.Group> */}
              <Button variant="outline-info" >Search</Button>
            </Form>
            
            {/* <h1>Top Result: {topResult ? topResult.name:"nope :("}</h1> */}
            

            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm">
                    <h2>{albums ? "Albums":""}</h2>

                      <ListGroup> 
                      { albums.map((album)=>showAlbums(album))}
                      </ListGroup>
                    </div>
                    <div class="col-sm">
                    <h2>{artists ? "Artists":""}</h2>

                      <ListGroup> 
                      { artists.map((artist)=>showArtists(artist))}
                      </ListGroup>
                    </div>
                    <div class="col-sm">
                    <h2>{tracks ? "Tracks":""}</h2>
                    <ListGroup> 
                     { tracks.map((track)=>showTracks(track))}
                     </ListGroup>
                    </div>
                </div>
            </div>

            

            
            


          </div>
      
    )
}

export default Search

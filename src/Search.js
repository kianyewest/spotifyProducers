import React from 'react'
import { SpotifyWebApi } from 'spotify-web-api-js';
import { useEffect,useState } from 'react';
import { useDataLayerValue } from "./DataLayer";
import InfiniteScroll from "react-infinite-scroll-component";
import Albums from './Albums';
import { ListGroup, Form,FormControl,Button,Dropdown} from 'react-bootstrap';
import { Link } from 'react-router-dom';


const emptyState = {topResult:null,albums:[],singles:[]};
function Search({spotify}) {
  console.log("Search")

    const [{topResult,albums,singles},setResults] = useState(emptyState);
    const [searchQuery, setSearchQuery] = useState('');
    const doSearch = () =>{
        spotify.search(searchQuery,['album']).then(
            function (newData) {
              console.log("new Data: ",newData);
              const topResult =  newData.albums.items[0];
              const albums = newData.albums.items.filter(result => result.album_type === "album");
              const singles = newData.albums.items.filter(result => result.album_type === "single");
              console.log(topResult);
              console.log(albums);
              console.log(singles);
              setResults({topResult,albums,singles})
            },
            function (err) {
              console.error(err);
            }
          );
    }
    useEffect(()=>{
        doSearch();
    },[])//probably link useEffect to fire whenever search is updated

    const showAlbums = (album) =>  {
      return <Link to={{  pathname: '/view/'+album.id }}>
      <ListGroup.Item key={album.id}><img   src={album.images[2].url}/>{album.name} {album.artists[0].name}</ListGroup.Item>
    </Link>
    }

    const onChangeHandler = (e) => {setSearchQuery(e.target.value); if(e.target.value===''){setResults(emptyState);}else{ doSearch();}}
    
    return (
            <div>
              
             <Form inline >
              <FormControl type="text" placeholder="Search" className="mr-sm-2" value={searchQuery} onInput={(e)=>{setSearchQuery(e.target.value); if(e.target.value===''){setResults(emptyState);}else{ doSearch();}}} onsubmit={()=>alert("a")}/>
              
              <Button variant="outline-info" type="submit">Search</Button>
            </Form>
            
            <h1>Top Result: {topResult ? topResult.name:"nope :("}</h1>
            

            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm">
                    <h2>{albums ? "Albums":""}</h2>

                      <ListGroup> 
                      { albums.map((album)=>showAlbums(album))}
                      </ListGroup>
                    </div>
                    <div class="col-sm">
                    <h2>{singles ? "Singles":""}</h2>
                    <ListGroup> 
                        { singles.map((single) =>  <ListGroup.Item key={single.id}><img   src={single.images[2].url}/>{single.name}    by {single.artists[0].name}</ListGroup.Item>)}
                    </ListGroup>
                    </div>
                </div>
            </div>

            

            
            


          </div>
      
    )
}

export default Search

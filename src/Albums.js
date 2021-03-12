import React from 'react'
import { SpotifyWebApi } from 'spotify-web-api-js';
import { useEffect,useState } from 'react';
import { useDataLayerValue } from "./DataLayer";
import InfiniteScroll from "react-infinite-scroll-component";

function Albums({spotify}) {
    // window.onload = ()=> console.log("on load");
     const [state, dispatch] = useDataLayerValue();
    // console.log("token: ",state.token);
    // spotify.setAccessToken(state.token);
    const [{albums,next,isMore},setAlbums] = useState({albums:[],next:0,isMore:true});
    

    useEffect(()=>{
        console.log("useEffect called, ",albums)
        if(state.token){
            console.log("have token, ",next);
            const n = next;
            fetchMoreData()
            
        }
        
    },[]);  


  const  fetchMoreData = () => {
      // a fake async api call like which sends
      // 20 more records in 1.5 secs
      console.log("called")
      const limit = 30;
      spotify.getMySavedAlbums({limit:30, offset:next}).then(
        function (newData) {
          console.log("new Data: ",newData);
          
          const newAlbums = [...albums,...newData.items]
          const newVal = {albums:newAlbums,next:next+30,isMore:(newAlbums.length !== newData.total)}
          console.log("new Val: ",newVal);
          setAlbums(newVal);
        },
        function (err) {
          console.error(err);
        }
      );
    };


    return (
        <div>
          <InfiniteScroll
          dataLength={albums.length}
          next={fetchMoreData}
          hasMore={isMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          {albums.map((i, index) => (
            <div key={index}>
              div - #{index}
            </div>
          ))}
        </InfiniteScroll>
           {/* <div className="album py-5 bg-light">
    <div className="container">
      <div className="row">
      {albums.map((album)=>{
                return ( 

                <div  className="col-md-4">
                    <div className="card mb-4 shadow-sm">
                        <img   key={album.uri} src={album.album.images[0].url}  className="img-fluid" />
                        <div className="card-body">
                        <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="btn-group">
                            <button type="button" className="btn btn-sm btn-outline-secondary">View</button>
                            <button type="button" className="btn btn-sm btn-outline-secondary">Edit</button>
                            </div>
                            <small className="text-muted">9 mins</small>
                        </div>
                        </div>
                    </div>
                    </div>

                 )
        })}
        
        
          </div>
        
  </div>
  </div> */}
           </div>

      
    )
}

export default Albums

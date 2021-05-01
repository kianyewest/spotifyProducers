import React, { useState,useRef,useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { FixedSizeList } from "react-window";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CardHeader,
  CardActions,
  Button,
  Grid,AppBar
} from "@material-ui/core";
import Skeleton from '@material-ui/lab/Skeleton';
import LazyLoad from 'react-lazyload';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

const DisplaySongs = (props) => {
  const song = props.data.songs[props.index];
  const mapping = props.data.mapping;
  const searched = mapping.hasOwnProperty(song.id);
  const noResult = searched&& mapping[song.id].status === 'noResult';

  return (
    <ListItem alignItems="flex-start" style={props.style}>
      {/* <ListItemAvatar>
        <Avatar alt="Remy Sharp" src={song.header_image_thumbnail_url} />
      </ListItemAvatar> */}
      <ListItemText
        primary={song.title_with_featured}
        secondary={song.primary_artist.name}
      />
     {searched?  (mapping[song.id].status==="Found"? <a href={mapping[song.id].song.external_urls.spotify}>open in spotify</a> :mapping[song.id].status):"no search"}
      {/* {searched? (noResult ? "No Result":mapping[song.id].status):"searching..."} */}
      {/* <a href={mapping[song.id].song.external_urls.spotify}>open in spotify</a>       */}
    </ListItem>
  );
};


const DisplayProducer = ({ producerData,geniusToSpotify }) => {
  const classes = useStyles();
  const [numItemsDisplayed, setNumItemsDisplayed] = useState(10);
  const [sizeCard,setSizeCard] = useState(900);
  const cardRef   = useRef(null);
  const numItems = producerData.length;
  const size = 65;  

  useEffect ( () => {
      if(cardRef.current){
        setSizeCard(cardRef.current.offsetWidth-20);
      }
  },[cardRef])
  const DisplayProducerSongs = ({ producerData, size, height,width }) => {
    return producerData.hasOwnProperty("songs") ? (
      <div className={classes.root}>
        <FixedSizeList
          height={height}
          width={width}
          itemSize={size}
          itemCount={producerData.songs.length}//{Math.min(10,producerData.songs.length)}
          itemData={{songs:producerData.songs,mapping:geniusToSpotify}}
        >
          {DisplaySongs}
        </FixedSizeList>
      </div>
    ) : (
      <p>Loading Songs</p>
    );
  };

  return (
    <Card className={classes.root} raised={true} ref={cardRef}>
      
      
        
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {producerData.name}
          </Typography>
          {/* <Typography variant="subtitle1" component="h2">
            {producerData.songs.length} Songs
          </Typography> */}
          <Divider />
          <DisplayProducerSongs
            producerData={producerData}
            size={size}
            height={numItemsDisplayed* size}
            width={sizeCard}
          />
          <Divider />
        </CardContent>
      
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => {
            setNumItemsDisplayed((prev) => {return (prev * 2>numItems) ? numItems:prev*2});
          }}
          disabled={numItemsDisplayed>=numItems}
        >
          View More
        </Button>
        <Button
          size="small"
          color="primary"
          onClick={() => {
            
            setNumItemsDisplayed((prev) => Math.ceil(prev / 2));
          }}
          disabled={numItemsDisplayed<=1}
        >
          View Less
        </Button>
      </CardActions>
    </Card>
  );
};

function DisplayProducers({ producers,geniusToSpotify }) {
  return (
      <div  style={{padding:"1%"}}>
    <Grid
  container
  direction="row"
  justify="space-around"
  alignItems="flex-start"
  spacing={3}
 
>
      {(producers.length>0  ? producers:[1,2,3]).map((element) => {
        return (
            
          <Grid item xs={12} md={6} lg={4} key={element.id} >
              <LazyLoad height={650} once offset={1000}>
            {producers.length>0 ? <DisplayProducer producerData={element} geniusToSpotify={geniusToSpotify}/> :<Skeleton variant="rect" width={"100%"} height={200} />}
            </LazyLoad>
          </Grid>
          
        );

      })}
    </Grid>
    </div>
  );
}

export default DisplayProducers;

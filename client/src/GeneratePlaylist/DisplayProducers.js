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
  CardActions,
  Button,
  Grid,
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
  const song = props.data[props.index];
  return (
    <ListItem alignItems="flex-start" style={props.style}>
      {/* <ListItemAvatar>
        <Avatar alt="Remy Sharp" src={song.header_image_thumbnail_url} />
      </ListItemAvatar> */}
      <ListItemText
        primary={song.title_with_featured}
        secondary={song.primary_artist.name}
      />
    </ListItem>
  );
};


const DisplayProducer = ({ producerData }) => {
  const classes = useStyles();
  const [numItemsDisplayed, setNumItemsDisplayed] = useState(2);
  const [sizeCard,setSizeCard] = useState(900);
  const cardRef   = useRef(null);
  const numItems = 10;
  const size = 65;

  useEffect ( () => {
      if(cardRef.current){
        console.log("cardRef: ",cardRef)
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
          itemCount={Math.min(10,producerData.songs.length)}
          itemData={producerData.songs}
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
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {producerData.name}
          </Typography>
          <DisplayProducerSongs
            producerData={producerData}
            size={size}
            height={numItemsDisplayed* size}
            width={sizeCard}
          />
        </CardContent>
      </CardActionArea>
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

function DisplayProducers({ producers }) {
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
            {producers.length>0 ? <DisplayProducer producerData={element} /> :<Skeleton variant="rect" width={"100%"} height={200} />}
            </LazyLoad>
          </Grid>
          
        );

      })}
    </Grid>
    </div>
  );
}

export default DisplayProducers;

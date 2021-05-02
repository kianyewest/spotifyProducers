import React, { useState,useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ControlAudio,{PlaceHolderIcon} from './ControlAudio';
const useStyles = makeStyles({
  table: {
    minWidth: 100,
  },
  tableContainer:{
    margin:0,
  }
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

function DisplayPlaylist({ songs, geniusToSpotify }) {
  const classes = useStyles();
  const [playing,setPlaying] = useState(false);
  const [playingIndex,setPlayingIndex] = useState(-1);
  const [hoverIndex,setHoverIndex] = useState(-1);
  
  const handleClick = (song, geniusToSpotify,index) => {
    const searched = geniusToSpotify.hasOwnProperty(song.id);
    if (searched) {
      if (geniusToSpotify[song.id].status === "Found") {
        if (geniusToSpotify[song.id].song.preview_url !== null) {
          console.log("HERE!", geniusToSpotify[song.id].song);
          //pause current song if playing
          if(index===playingIndex){
            setPlaying(!playing);
          }else{ 
            setPlayingIndex(index);
            setPlaying(true);
          }
        }
      }
    }
  };

  //Todo remove duplicates from songs
  return (
    <TableContainer className={classes.tableContainer} component={Paper} >
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Song</StyledTableCell>
            <StyledTableCell>Artist</StyledTableCell>
            <StyledTableCell align="right">Preview</StyledTableCell>
            <StyledTableCell align="right">Open</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {songs.map((song,index) => {
            const searched = geniusToSpotify.hasOwnProperty(song.id);
            const found = searched &&geniusToSpotify[song.id].status === "Found";
            const hasPreview = found && geniusToSpotify[song.id].song.preview_url!==null;
            
            const isActive = playingIndex===index;
            const isHovering = hoverIndex === index;
            // if(index<1){
            //   console.log("stuffL ",searched,found,hasPreview,geniusToSpotify[song.id].status,song.id,geniusToSpotify)
            // }
            return (
            <TableRow
              hover
              key={song.id}
              onClick={()=>handleClick(song,geniusToSpotify,index)}
              // onMouseEnter={() => setHoverIndex(index)}
              // onMouseLeave={() => setHoverIndex(-1)}
            >
              <TableCell component="th" scope="row">
                {song.title_with_featured}
                {/* //todo switch to title when on small device */}
              </TableCell>
              <TableCell>
                {song.primary_artist.name}
              </TableCell>
 <TableCell align="right" >
   {hasPreview? (isActive ? <ControlAudio url={ geniusToSpotify[song.id].song.preview_url } playing={playing} setPlaying={setPlaying}/>:<PlaceHolderIcon />):<p>No preview</p>}
                  {/* {isActive ? (hasPreview ? <ControlAudio url={ geniusToSpotify[song.id].song.preview_url } playing={playing} setPlaying={setPlaying}/>:<p>No Preview</p>):<PlaceHolderIcon />} */}

              </TableCell>
             
           
              <TableCell align="right">
                {found ? <a href={geniusToSpotify[song.id].song.external_urls.spotify}>open in spotify</a>:"not Found"}
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


export default DisplayPlaylist;

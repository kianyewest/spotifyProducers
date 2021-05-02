import React, { useState, useEffect } from "react";
import PauseIcon from '@material-ui/icons/Pause';
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

function ControlAudio({ url,playing,setPlaying }) {
  const [audio] = useState(new Audio(url));
  // const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    console.log("in playing:", audio, playing);
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => {
      console.log("audio finished i think");
      setPlaying(false);
    });
    audio.addEventListener("timeupdate", (t) => {
      if (t.target.ended) {
        setProgress(100);
        setPlaying(false);
      } else {
        setProgress((t.target.currentTime / t.target.duration) * 100);
      }
    });

    return () => {
      console.log("component finished");
      audio.pause();
      audio.removeEventListener("timeupdate", () => setPlaying(false));
    };
  }, []);

  return (
    <div>
      <CircularProgressWithLabel value={progress} playing={playing}/>
    </div>
  );
}

function CircularProgressWithLabel({ value, playing }) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" value={value} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {playing  ?<PauseIcon />: <PlayArrowIcon />}
      </Box>
    </Box>
  );
}

export const PlaceHolderIcon = ()=> <CircularProgressWithLabel value={0} playing={false}/>;

export default ControlAudio;

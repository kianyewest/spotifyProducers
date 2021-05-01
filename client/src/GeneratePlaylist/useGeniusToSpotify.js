import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
const matchExactArtist = (spotifyResult, geniusArtistName) => {
  return spotifyResult.filter((track) => {
    if (track === null) {
      return false;
    }
    const spotifyArtist = track.artists[0].name.normalize("NFKD");

    //normalise to so that characters such as space and no-break space will match each other
    // console.log(track.name,spotifyArtist,geniusArtistName,spotifyArtist.localeCompare(geniusArtistName, 'en', { sensitivity: 'base' })===0);
    return (
      spotifyArtist.localeCompare(geniusArtistName, "en", {
        sensitivity: "base",
      }) === 0
    );
    // geniusArtistName
  });
};

const matchSimilarArtist = (spotifyResult, geniusArtistName) => {
  //try seeing if artist is within genius artist name i.e "Drake" within the artist name of "Drake,Kanye west, Lil Wayne"
  //unsure of why genius would store an artist as a list of artists they already have in there database with no reference to them :(
  return spotifyResult.filter((track) => {
    if (track === null) {
      return false;
    }
    const spotifyArtist = track.artists[0].name.normalize("NFKD").toUpperCase();
    return geniusArtistName.includes(spotifyArtist);
  });
};

const processResults = (data, geniusTrack, setGeniusToSpotify) => {
  //exact match
  const geniusArtistName = geniusTrack.primary_artist.name
    .normalize("NFKD")
    .toUpperCase();
  var sameArtist = matchExactArtist(data.tracks.items, geniusArtistName);

  //if no matches
  if (sameArtist.length === 0) {
    sameArtist = matchSimilarArtist(data.tracks.items, geniusArtistName);
  }

  if (sameArtist.length > 0) {
    const topSong = sameArtist[0];

    setGeniusToSpotify((prev) => {
      return { ...prev, [geniusTrack.id]: {status:"Found",song:topSong} };
    });
    // setSpotifyToGenius((prev) => {
    //   return { ...prev, [topSong.id]: geniusTrack };
    // });
    return true;
  } else {
    const noResultObj = { status: "NoResult" };
   
    setGeniusToSpotify((prev) => {
      return { ...prev, [geniusTrack.id]: noResultObj };
    });
    // setSpotifyToGenius((prev)=>{return {...prev, [topSong.id]:noResultObj}})
    return false;
  }
};

const getSpotifyTrackFromGeniusTrack = async (
  geniusTrack,
  geniusToSpotify,
  setGeniusToSpotify,
  spotify
) => {
  // return;
  const query = geniusTrack.title + " " + geniusTrack.primary_artist.name;
  //check entry does not already exist
  if (geniusToSpotify.hasOwnProperty(geniusTrack.id)) {
    console.log("already searched for: ", query);
    return;
  } else {
    // console.log("searching for: ", query);
  }

  // console.log("geniusTrack", geniusTrack);
  // const q = String.raw();
  const cleanQuery = query.normalize("NFKD").replace("’", "'");

  try{
  //this is ugly, it searches for the track with artist name, if that fails then
  //searches with a higher limit i.e return more tracks
  // if that fails it searches only using the title
  //if that fails it reduces the title to a bare form and searches again
  const data = await spotify.search(cleanQuery, ["track"], { limit: 10 });
  if (processResults(data, geniusTrack, setGeniusToSpotify)) {
    return;
  }
  const data1 = await spotify.search(query, ["track"], { limit: 50 });
  if (processResults(data1, geniusTrack, setGeniusToSpotify)) {
    return;
  }
  const data2 = await spotify.search(geniusTrack.title, ["track"], {
    limit: 50,
  });

  //if that failed modify the search term
  if (processResults(data2, geniusTrack, setGeniusToSpotify)) {
    return;
  }
  // console.log("oringal q: ", query);
  //removes text between brackets i.e "Speedom (Worldwide Choppers 2)" becomes "Speedom"
  //this was done as spotify represented Worldwide Choppers 2 as Wc2, and the song title for it was Speedom (Wc2) which was not found when searching
  const regex = /\(([^HS]{1,})\)/gm;
  const newQuery = geniusTrack.title.replace(regex, "");
  // console.log("newQuery", newQuery);
  const data3 = await spotify.search(newQuery, ["track"], { limit: 50 })
  processResults(data3, geniusTrack, setGeniusToSpotify);
  }catch(err){
    console.log("errored when searching :(",err)
    if(err.status===429){
      //hit rate limit
      //setTimeout()
      setGeniusToSpotify((prev) => {
        return { ...prev, [geniusTrack.id]: {status:"Timeout"} };
      });
    }
  }
};

const useGeniusToSpotify = (spotifyAccessToken) => {
  const [songsToFind, setSongsToFind] = useState([]);
  const [geniusToSpotify, setGeniusToSpotify] = useState({});
  const spotify = new SpotifyWebApi();

  spotify.setAccessToken(spotifyAccessToken);
  useEffect(() => {
    setGeniusToSpotify((prev) => {
      songsToFind.forEach((geniusTrack)=>{
        prev[[geniusTrack.id]] = {status:"Searching"}
      })
      

      return { ...prev}
    });
    songsToFind.forEach((song) => {
      
      getSpotifyTrackFromGeniusTrack(
        song,
        geniusToSpotify,
        setGeniusToSpotify,
        spotify
      );
    });
  }, [songsToFind]);
  return [geniusToSpotify, setSongsToFind];
};

export default useGeniusToSpotify;

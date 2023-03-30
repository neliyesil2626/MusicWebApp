import React,{useState} from 'react';
import rewindpng from './assets/Rewind.png'; 
import fastForwardpng from './assets/Fast Forward.png';
import playpng from './assets/Play.png';
import pausepng from './assets/Pause.png';

const BUTTON_SIZE = 40;

export const formatTime = (seconds) => {
    let minutes = Math.floor(seconds/60)
    seconds = Math.floor(seconds % 60)
    let time
    if(seconds < 10) {
      time = (minutes+":0"+seconds)
    } else {
      time = (minutes+":"+seconds)
    }
    //console.log("time formatted to: "+time)
    return time
  }
export const formatProgress = (currentTime, duration) => {
    let progress = {width: currentTime/duration*100+'%'}
    return progress
  }

const Player = (song) => {
    const [audio, setAudio] = useState(new Audio())
    const [playing, setPlaying] = useState(false)
    const [initialized, setInitialized] = useState(false)
    const [playNextSong, setPlayNextSong] = useState(false) //used when a song ends to autoplay next song
    const [timeStamp, setTimeStamp] = useState(0)
    const [timeDuration, setTimeDuration] = useState(0)
    const [songEnded, setSongEnded] = useState(false) //used to keep track of when a song finishes playing.
    React.useEffect(() => {
      console.log("Player.Audio changed to next song: "+song.name)
      audio.src = '/stream/'+song.songs[song.index].objectID
      audio.load()
      setTimeout(() => { //used to ensure audio.play() doesn't conflict with audio.load()
        if(playing || playNextSong){ //why am I no longer getting No Audio Source error???
          audio.play()
          setPlayNextSong(false)
        }
        setTimeStamp(0)
      },10)
    }, [song.index] );
  
    React.useEffect(() => {
      if(songEnded){
        setPlayNextSong(true)
        song.next()
        setSongEnded(false)
      }
    }, [songEnded])
  
    
  
    
    if(!initialized){ //ensures that only one event listener is attached to audio. After all songs are loaded 
      audio.src = '/stream/'+song.curSongID
      audio.addEventListener("ended", async (event) =>{ 
       setSongEnded("true")
      })
      audio.addEventListener("play", () => {
        document.getElementById("playpausebutton").setAttribute("src", pausepng)
        setPlaying(true)
      })
      audio.addEventListener("pause", () => {
        document.getElementById("playpausebutton").setAttribute("src", playpng)
        setPlaying(false)
      })
      audio.addEventListener("durationchange", () => {
        setTimeDuration(audio.duration)
      })
      audio.addEventListener("timeupdate", () => {
        setTimeStamp(audio.currentTime)
      })
      setInitialized(true)
    }
    
    audio.volume = 0.5
    const playPause = () =>{ 
      if(!playing){
        audio.play()
      } else {
        audio.pause()
      }
    }
    const nextSong = () => { //used to play next song
      console.log("Player.nextSong() was called.")
      if(playing){setPlayNextSong(true)}
      song.next()
    }
    const prevSong = () => { //used to play previous song
      console.log("Player.prevSong() was called.")
      if(playing){setPlayNextSong(true)}
      song.prev()
    }
    return (
      <div id="player" className="centered">
        <img src={rewindpng} alt="rewindbutton" onClick={() => {prevSong()}} style={{width: BUTTON_SIZE}}/>
        <img src={playpng} alt="playpausebutton" onClick={playPause} id="playpausebutton" style={{width: BUTTON_SIZE}}/>
        <img src={fastForwardpng} alt="fastforwardbutton" onClick={() => {nextSong()}} style={{width: BUTTON_SIZE}}/>
        <label id="songtitle">{song.name}</label>
        <br></br>
        <div id="timestamp"><label>{formatTime(timeStamp)}/{formatTime(timeDuration)}</label></div>
        <div id="progressbar-container">
          <span id="progressbar" style={formatProgress(timeStamp, timeDuration)}></span>
        </div>
        
      </div>
    )
  }
export default Player
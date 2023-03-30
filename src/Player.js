import React,{useState} from 'react';
import rewindpng from './assets/Rewind.png'; 
import fastForwardpng from './assets/Fast Forward.png';
import playpng from './assets/Play.png';
import pausepng from './assets/Pause.png';

import { HStack, Box, Text, VStack, Center} from '@chakra-ui/react'
import { COLOR } from './ChakraTheme';

const BUTTON_SIZE = 40;
const PROGRESS_WIDTH = 500; //width of the progress bar in px

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
    let progress = {width: currentTime/duration*PROGRESS_WIDTH+'px'}
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
      <Box
        w='full'
        bg='gray.900'
        overflow='hidden'
        position='fixed'
        bottom='0'
        p='0'
      >
        <HStack id="mediabuttons"
          marginTop='10px'
          marginLeft='22.5vw'
          w='33vw'
        >
          <img src={rewindpng} alt="rewindbutton" onClick={() => {prevSong()}} style={{width: BUTTON_SIZE}}/>
          <img src={playpng} alt="playpausebutton" onClick={playPause} id="playpausebutton" style={{width: BUTTON_SIZE}}/>
          <img src={fastForwardpng} alt="fastforwardbutton" onClick={() => {nextSong()}} style={{width: BUTTON_SIZE}}/>
          <HStack>
            <Text id="songtitle">{song.name}</Text>
            <Text id="songalbum" color={COLOR.secondaryFont}> - {song.album}</Text>
          </HStack>
        </HStack>
       <Center><HStack>
          <HStack id="timestamp">
            <Text>{formatTime(timeStamp)}</Text><Text color={COLOR.secondaryFont}>/</Text><Text color={COLOR.secondaryFont}>{formatTime(timeDuration)}</Text>
          </HStack>
          <Box id="progressbar-container" bg={COLOR.progressBar} w='50vw' h='7px' borderRadius='3px'>
            <Box id="progressbar" h='full' w={(timeStamp/timeDuration)*100+'%'} bg={COLOR.pink} borderRadius='3px'></Box>
          </Box>
        </HStack></Center>
        
      </Box>
    )
  }
export default Player
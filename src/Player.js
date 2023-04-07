import React,{useState} from 'react';

import rewindpng from './assets/Rewind.svg'; 
import fastForwardpng from './assets/Fast Forward.svg';
import playpng from './assets/Play.svg';
import pausepng from './assets/Pause.svg';
import looppng from './assets/LoopSong.svg';
import shufflepng from './assets/ShufflePlay.svg';
import queuepng from './assets/QueueSong.svg';
import volumepng from './assets/volume control.svg';

import { HStack, Box, Text, VStack, Center, Image, Spacer, Flex, Slider, SliderTrack, SliderFilledTrack, SliderThumb} from '@chakra-ui/react'
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


const Player = (song) => {
    const [audio, setAudio] = useState(new Audio())
    const [playing, setPlaying] = useState(false)
    const [initialized, setInitialized] = useState(false)
    const [playNextSong, setPlayNextSong] = useState(false) //used when a song ends to autoplay next song
    const [timeStamp, setTimeStamp] = useState(0)
    const [timeDuration, setTimeDuration] = useState(0)
    const [songEnded, setSongEnded] = useState(false) //used to keep track of when a song finishes playing.
    const [volume, setVolume] = useState(0.5)
    const [volumeBar, setVolumeBar] = useState(0)
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
      audio.volume = volume
      setInitialized(true)
    }
    
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
    const muteVolume = () => {
      if(audio.volume === 0.0){
        audio.volume = volume
      } else {
        audio.volume = 0.0
      }
    }
    return (
      <Box
        w='full'
        bg='gray.900'
        overflow='hidden'
        position='fixed'
        bottom='0'
        p='0'
        id='player'
      >
        <HStack id="mediabuttons"
          marginTop='10px'
          marginLeft='22.5vw'
          w='54vw'
        >
          <Image src={rewindpng} alt="rewindbutton" onClick={() => {prevSong()}} style={{width: BUTTON_SIZE}}/>
          <Image src={playpng} alt="playpausebutton" onClick={playPause} id="playpausebutton" style={{width: BUTTON_SIZE}}/>
          <Image src={fastForwardpng} alt="fastforwardbutton" onClick={() => {nextSong()}} style={{width: BUTTON_SIZE}}/>
          
          <HStack>
            <Text id="songtitle">{song.name}</Text>
            <Text id="songalbum" color={COLOR.secondaryFont}> - {song.album}</Text>
          </HStack>
          <Spacer />
          <HStack 
          float='left'>
            <Image src={shufflepng} alt="shufflebutton" onClick={() => {}} style={{width: BUTTON_SIZE}}/>
            <Image src={looppng} alt="fastforwardbutton" onClick={() => {}} style={{width: BUTTON_SIZE}}/>
            <Image src={queuepng} alt="fastforwardbutton" onClick={() => {}} style={{width: BUTTON_SIZE}}/>
          </HStack>
        </HStack>
       <Center><HStack>
          <HStack id="timestamp">
            <Text>{formatTime(timeStamp)}</Text><Text color={COLOR.secondaryFont}>/</Text><Text color={COLOR.secondaryFont}>{formatTime(timeDuration)}</Text>
          </HStack>
          <Box id="progressbar-container" bg={COLOR.progressBar} w='50vw' h='7px' borderRadius='3px'>
            <Box id="progressbar" h='full' w={(timeStamp/timeDuration)*100+'%'} bg={COLOR.pink} borderRadius='3px'></Box>
          </Box>
          <Flex 
            onMouseOver={() => {
              console.log("hovered over flex")
              setVolumeBar(10)
            }} 
            onMouseOut={() => {
              setVolumeBar(0)
            }}
            overflow='visible'
            h={(BUTTON_SIZE/2 + 10)+'px'}
          >
            <Image src={volumepng} alt="fastforwardbutton" onClick={() => {muteVolume()}} h={(BUTTON_SIZE/2)+'px'} draggable='false' />
            <Flex position='absolute' pl={BUTTON_SIZE/2+'px'}>
              <Slider
                defaultValue={audio.volume * 100}
                onChange={(percent)=> {
                  audio.volume = (percent/100)
                  setVolume(audio.volume)
                }}
                id='volume-container' 
                bg='transparent'
                w={volumeBar+'rem'}
                h='full' borderRadius='3px' 
                verticalAlign='center'
                _hover={{cursor: 'pointer'}}
                p='0'
                ml='5px'
              >
              <SliderTrack bg={COLOR.bgHover}>
                                  <SliderFilledTrack bg={COLOR.pink}/>
              </SliderTrack>
              <SliderThumb 
                dragable='false' 
                h='13px' w='13px' bg='transparent' 
                _hover={{bg:COLOR.primaryFont}}
                _active={{bg:COLOR.primaryFont, border:'0'}}
              />
            </Slider>
          </Flex>
        </Flex>
          
        </HStack></Center>
        
        
      </Box>
    )
  }
export default Player
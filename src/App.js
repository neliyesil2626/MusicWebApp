import Pages from './PageEnums.js';
import Player from './Player.js';
import SideMenu from './SideMenu.js';
import SongAdder from './SongAdder.js';
import Library from './Library.js';
import LogInSignUp from './LogInSignUp.js';
import {shuffle} from './Shuffle.js';
import {theme, COLOR} from './ChakraTheme.js';
import React,{useState, useEffect} from 'react';
import { ChakraProvider, Flex, Button} from '@chakra-ui/react';
import CreatePlaylist from './CreatePlaylist.js';
import CreatePlaylistNotLoggedIn from './CreatePlaylistNotLoggedIn.js'
import { getAuth } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { useTheme } from '@emotion/react';
const fetchData = async (url) => {
  fetch('/library').then(
      (response) => response.json()
    ).then((value) => {
      return value;
    });
}

//got this from: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
async function deleteData(id) {
  // Default options are marked with *
  const response = await fetchData('/deletesong', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
    },
    body: '{"_id": "'+id+'"}'// body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

//got code from: https://stackoverflow.com/questions/3749231/download-file-using-javascript-jquery
const downloadFile = (file, fileName) => {
  const url = URL.createObjectURL(file)
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

const connectFirebase = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyCGhNG4Q4n49smsKIa_zjkzIr0SwSSMDG0",
    authDomain: "webmusicplayer-seniorproject.firebaseapp.com",
    projectId: "webmusicplayer-seniorproject",
    storageBucket: "webmusicplayer-seniorproject.appspot.com",
    messagingSenderId: "607390814407",
    appId: "1:607390814407:web:2a174fc1a386f9f251aee2"
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  return {auth:auth, app:app}
}

/**
 * Create the player component. 
 * 
 * @returns The App component
 */
function App() {
  const [curSongIndex, setCurSongIndex] = useState(0)//index of the current song playing in the mongodb
  const [songs, setSongs] = useState([]) //list of song objects from t.library in mongodb
  const [indexes, setIndexes] = useState([]);
  const [shuffledIndexes, setShuffledIndexes] = useState([]);
  const [playlists, setPlaylists] = useState([])
  const [playlist, setPlaylist] = useState()
  const [isLoadingSong, setLoadingSong] = useState(false) //used when the song ends and the next song is starting
  const [refresh, setRefresh] = useState(false) //used to detect when db.library collection has updated
  const [uid, setUid] = useState("")
  const [userName, setUsername] = useState("")
  const [page, setPage] = useState(Pages.Library)

  const [shufflePlay, setShufflePlay] = useState(false)
  const [loopPlay, setLoopPlay] = useState(false)
  const [queue, setQueue] = useState([])

  const [app, setApp] = useState()
  const [auth, setAuth] = useState()
  if(auth === null || auth === undefined){
    console.log("connecting to firebase...")
    let connection = connectFirebase()
    setApp(connection.app)
    setAuth(connection.auth)
  }

  React.useEffect(() => {
    console.log("\n[index update] indexes = ")
    console.log(indexes)
    console.log('\n')
  },[indexes])
  React.useEffect(() => { //set variables when song info is retrieved from backend.
    console.log("app is fetching data...")
    fetch('/library').then(
      (response) => response.json()
    ).then((value) => {
      setSongs(value)
      console.log("songs = ")
      console.log(songs)
      console.log("\n")
    });
  }, [refresh] );
  React.useEffect(() => {
    if(uid !== ""){
      console.log("uid = " + uid)
      fetch('/userPlaylists/'+uid).then(
        (response) => response.json()
      ).then((value) => {
        setPlaylists(value)
      });
    } else {
      console.log("logged out")
    }
  }, [uid] );

  React.useEffect(() => {
    if(songs === undefined || songs.length === 0){
      console.log("songs null")
      return
    }else {
      console.log("useEffect[page] songs = ")
      console.log(songs)
    
      console.log("useEffect[page]: state changed to: " + page)
      if(page === Pages.Library || page === Pages.CreatePlaylist){
        let newIndexes = songs.map((song, i) => i)
        setIndexes(newIndexes)
        console.log("useEffect[page]: indexes = ")
        console.log(newIndexes)
        console.log("\n")
        setPlaylist([])
        if(shufflePlay){
          let newShuffledIndexes = shuffle(newIndexes)
          setShuffledIndexes(newShuffledIndexes)
          setCurSongIndex(newShuffledIndexes[0])
        } else {
          setCurSongIndex(newIndexes[0])
        }
      }
      console.log('useEffect[page,songs] curSongIndex = '+ curSongIndex)
    }
  }, [page, songs] );
  React.useEffect(()=>{
    console.log("useEffect[playlist]: page = " +page)
    let newIndexes = []
    if(page !== Pages.Library && playlist !== [] && playlist.songs !== undefined){
      for(let i = 0; i < songs.length; i++){
        if(playlist.songs.includes(songs[i].objectID)){
          newIndexes.push(i)
        }
      }
      setIndexes(newIndexes)
      console.log('useEffect[playlist]: Indexes = ')
      console.log(newIndexes)
      if(shufflePlay){
        let newShuffledIndexes = shuffle(newIndexes)
        setShuffledIndexes(newShuffledIndexes)
        setCurSongIndex(newShuffledIndexes[0])
      } else {
        setCurSongIndex(newIndexes[0])
      }
    }
   }, [playlist])
  
  React.useEffect(() => {
    if(auth.currentUser !== undefined && auth.currentUser !== null){
      setUid(auth.currentUser.uid)
      setUsername(auth.currentUser.displayName)
    }
  }, [auth] );
  React.useEffect(() => {
    console.log("shufflePlay is updated to: " + shufflePlay)
    if(shufflePlay){
      let newShuffledIndexes = shuffle(indexes)
      setShuffledIndexes(newShuffledIndexes)
      setCurSongIndex(newShuffledIndexes[0])
      console.log("shuffeled indexes: ")
      console.log(newShuffledIndexes)
    }
  }, [shufflePlay] );



  const incSong = () => {
    let songIndexes = (shufflePlay)? shuffledIndexes : indexes
      let nextSongIndex = songIndexes.indexOf(curSongIndex) + 1
      if(nextSongIndex  >= songIndexes.length){
        nextSongIndex = 0
      }
      console.log("\nincsong.songIndexes = ")
      console.log(songIndexes)
      console.log('\n')
      setCurSongIndex(songIndexes[nextSongIndex])
      console.log(nextSongIndex+" incremented song to: "+songs[nextSongIndex].name)
  }

  const decSong = () => {
    let songIndexes = (shufflePlay)? shuffledIndexes : indexes
    let nextSongIndex = songIndexes.indexOf(curSongIndex) - 1
    if(nextSongIndex < 0){
      nextSongIndex = songIndexes.length - 1
    }
    setCurSongIndex(songIndexes[nextSongIndex])
    console.log(nextSongIndex+" decremented song to: "+songs[nextSongIndex].name)
  }
  const setSong = (i) => {
    setCurSongIndex(indexes[i])
  }

  const loadSong = () => {
    setLoadingSong(true)
    setTimeout(setLoadingSong(false), 1000)//wait a second to finish loading the song
  }

  /*
   * I added this conditional because I don't want to load the app unless the list of songs is loaded from the db. 
   */
  if(songs.length == 0 || typeof songs == Promise){ 
    return <ChakraProvider theme={theme}>
          <div className="App">
            <div id="sidemenu">
              <SideMenu page={page} setPage={setPage}></SideMenu>
            </div>
            <div id="pagecontent">
              <SongAdder refresh={refresh} setRefresh={setRefresh}/>
            </div>
           </div>
          </ChakraProvider>
  }

  let focusedPage;
  switch(page) {
    case Pages.Library:
      // Library
      focusedPage = <Library header='Library' setIndex={setSong} songs={songs} setSongs={setSongs}/>
      break;
    case Pages.AddSong:
      // AddSong
      focusedPage = <SongAdder refresh={refresh} setRefresh={setRefresh}/>
      break;
    case Pages.CreatePlaylist:
      //CreatePlaylist
        focusedPage = (uid !== "") ? 
        <CreatePlaylist uid={uid} setUid={setUid} songs={songs} setIndex={setCurSongIndex}></CreatePlaylist> :
        <CreatePlaylistNotLoggedIn></CreatePlaylistNotLoggedIn>
      break;
    case Pages.Login:
      //Login
      focusedPage = <LogInSignUp uid={uid} setUid={setUid} userName={userName} setUsername={setUsername} auth={auth} app={app}></LogInSignUp>
      break;
    case Pages.Playlist:
      //playlist
      let plSongs = songs.filter((song, i) =>  indexes.includes(i))
      focusedPage = <Library header={playlist.name} setIndex={setSong} songs={plSongs} setSongs={setSongs}/>
      break;
    default:
      // code block
  }

  let loginButtonText = (uid === undefined || uid == '') ? 'Log in' : userName+' ▼'
  let playerHeight = (document.getElementById("player") !== null) ? document.getElementById("player").offsetHeight : 0
  let sideMenuWidth = (document.getElementById("sidemenu") !== null) ? document.getElementById("sidemenu").offsetWidth : 0
  return (
    <ChakraProvider theme={theme}>
      <div className="App">
        <Flex>
          <SideMenu 
            page={page} 
            setPage={setPage} 
            playlists={playlists} 
            setPlaylist={setPlaylist}
            
          ></SideMenu>
          <Flex id="pagecontent"
            w={'calc(100vw - '+sideMenuWidth+'px)'}
            h={'calc(100vh - '+playerHeight+'px)'}
            position='relative'
            overflow='hidden'
            left='0'
            p='0'
            m='0'
          >
            {focusedPage} 
          </Flex>
        </Flex>
        <Player 
          name={songs[curSongIndex].name}
          album={songs[curSongIndex].album}
          curSongID={songs[curSongIndex].objectID} 
          next={incSong} 
          prev={decSong} 
          isLoading = {isLoadingSong}
          load = {loadSong}
          songs = {songs}
          index = {curSongIndex}
          loopPlay={loopPlay} setLoopPlay={setLoopPlay}
          shufflePlay={shufflePlay} setShufflePlay={setShufflePlay}

        />
      </div>
      <Button id="loginbutton" onClick={() => {
            if(page != Pages.Login){
              setPage(Pages.Login)
            } else {
              setPage(Pages.Library)
            }
            
          }}
              bg={COLOR.pink}
              _hover={{ bg: COLOR.pinkHover }}
              pos='fixed'
              top='20px'
              right='20px'
      >
        {loginButtonText}
      </Button>
    </ChakraProvider>
  );
}

export default App;

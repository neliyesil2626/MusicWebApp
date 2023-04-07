import Pages from './PageEnums.js';
import Player from './Player.js';
import SideMenu from './SideMenu.js';
import SongAdder from './SongAdder.js';
import Library from './Library.js';
import LogInSignUp from './LogInSignUp.js';
import {theme, COLOR} from './ChakraTheme.js';
import React,{useState, useEffect} from 'react';
import { ChakraProvider, Flex, Button} from '@chakra-ui/react';
import CreatePlaylist from './CreatePlaylist.js';
import CreatePlaylistNotLoggedIn from './CreatePlaylistNotLoggedIn.js'
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

/**
 * Create the player component. 
 * 
 * @returns The App component
 */
function App() {
  const [curSongIndex, setCurSongIndex] = useState(0)//index of the current song playing in the mongodb
  const [songs, setSongs] = useState([]) //list of song objects from t.library in mongodb
  const [indexes, setIndexes] = useState([]);
  const [playlists, setPlaylists] = useState([])
  const [playlist, setPlaylist] = useState()
  const [isLoadingSong, setLoadingSong] = useState(false) //used when the song ends and the next song is starting
  const [refresh, setRefresh] = useState(false) //used to detect when 
  const [uid, setUid] = useState("")
  const [userName, setUsername] = useState("")
  const [page, setPage] = useState(Pages.Library)

  React.useEffect(() => { //set variables when song info is retrieved from backend.
    console.log("app is fetching data...")
    fetch('/library').then(
      (response) => response.json()
    ).then((value) => {
      setSongs(value)
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
    }
  }, [uid] );

  React.useEffect(() => { //set variables when song info is retrieved from backend.
    console.log("state changed to: " + page)
    if(page === Pages.Library || page === Pages.CreatePlaylist){
      setIndexes(songs.map((song, i) => i));
      setPlaylist([])
    }
  }, [page] );
  React.useEffect(()=>{
    if(page !== Pages.Library && playlist !== [] && playlist.songs !== undefined){
      let newIndexes = []
      for(let i = 0; i < songs.length; i++){
        if(playlist.songs.includes(songs[i].objectID)){
          newIndexes.push(i)
        }
      }
      setIndexes(newIndexes)
      console.log('Indexes = ')
      console.log(newIndexes)
      setCurSongIndex(newIndexes[0])
    }
    console.log(indexes)
    
  }, [playlist])

  const incSong = () => {
      let nextSongIndex = indexes.indexOf(curSongIndex) + 1
      if(nextSongIndex  >= indexes.length){
        nextSongIndex = 0
      }
      setCurSongIndex(indexes[nextSongIndex])
      console.log(nextSongIndex+" incremented song to: "+songs[nextSongIndex].name)
  }

  const decSong = () => {
    let nextSongIndex = indexes.indexOf(curSongIndex) - 1
    if(nextSongIndex < 0){
      nextSongIndex = indexes.length - 1
    }
    setCurSongIndex(indexes[nextSongIndex])
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
      focusedPage = <LogInSignUp uid={uid} setUid={setUid} userName={userName} setUsername={setUsername}></LogInSignUp>
      break;
    case Pages.Playlist:
      //playlist
      console.log("indexes = ")
      console.log(indexes)
      console.log("songs = ")
      console.log(songs)
      let plSongs = songs.filter((song, i) =>  indexes.includes(i) )
      console.log("plSongs = ")
      console.log(plSongs)
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

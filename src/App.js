import './App.css';
import Player from './Player.js';
import SongAdder from './SongAdder.js';
import Library from './Library.js';
import LogInSignUp from './LogInSignUp.js';
import React,{useState, useEffect} from 'react';

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
  const [isLoadingSong, setLoadingSong] = useState(false) //used when the song ends and the next song is starting
  const [refresh, setRefresh] = useState(false) //used to detect when 
  const [uid, setUid] = useState("")
  const [userName, setUsername] = useState("")
  React.useEffect(() => { //set variables when song info is retrieved from backend.
    console.log("app is fetching data...")
    fetch('/library').then(
      (response) => response.json()
    ).then((value) => {
      setSongs(value)
    });
  }, [refresh] );

  const incSong = () => {
    let nextSongIndex = curSongIndex + 1
    if(nextSongIndex  >= 4){
      nextSongIndex = 0
    }
    setCurSongIndex(nextSongIndex)
    console.log(nextSongIndex+" incremented song to: "+songs[nextSongIndex].name)
  }

  const decSong = () => {
    let nextSongIndex = curSongIndex - 1
    if(nextSongIndex < 0){
      nextSongIndex = songs.length - 1
    }
    setCurSongIndex(nextSongIndex)
    console.log(nextSongIndex+" decremented song to: "+songs[nextSongIndex].name)
  }

  const loadSong = () => {
    setLoadingSong(true)
    setTimeout(setLoadingSong(false), 1000)//wait a second to finish loading the song
  }

  /*
   * I added this conditional because I don't want to load the app unless the list of songs is loaded from the db. 
   */
  if(songs.length == 0 || typeof songs == Promise){ 
    return <div className="App">
              <SongAdder refresh={refresh} setRefresh={setRefresh}/>
           </div>
  }
  return (
    <div className="App">
      <LogInSignUp uid={uid} setUid={setUid} userName={userName} setUsername={setUsername}></LogInSignUp>
      <SongAdder refresh={refresh} setRefresh={setRefresh}/>
      <Library setIndex={setCurSongIndex} songs={songs} setSongs={setSongs}/>
      <Player 
        name={songs[curSongIndex].name}
        curSongID={songs[curSongIndex].objectID} 
        next={incSong} 
        prev={decSong} 
        isLoading = {isLoadingSong}
        load = {loadSong}
        songs = {songs}
        index = {curSongIndex}
      />
    </div>
  );
}

export default App;

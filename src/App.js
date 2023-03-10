import './App.css';
import React,{useState,useEffect} from 'react'
import rewindpng from './assets/Rewind.png'; 
import fastForwardpng from './assets/Fast Forward.png';
import playpng from './assets/Play.png';
import pausepng from './assets/Pause.png' 
import structuredClone from '@ungap/structured-clone';

// function from: https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const fetchData = async (url) => {
  fetch('/library').then(
      (response) => response.json()
    ).then((value) => {
      return value;
    });
}

//got this from: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
async function addSong(newSong) {
  //downloadFile(mp3File, "songtest.mp3")
  console.log("Song Title = "+newSong.name+"\n"+
              "Song Artist = "+newSong.artist+"\n"+
              "Song Album = "+newSong.album+"\n"+
              "Song Duration = "+newSong.duration+"\n"+
              "Song ID = "+ newSong.objectID)
  // Default options are marked with *
  const response = await fetch('/addsong', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newSong) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

//used to upload an mp3 file to the backend server. 
//found out how to use formData from https://stackoverflow.com/questions/5587973/javascript-upload-file
async function uploadSong(newSongFile){
  return new Promise(async(res,rej) => {
    console.log("uploading song: "+newSongFile.name);
    console.log(newSongFile)
    let formData = new FormData()
    formData.append("name", newSongFile.name)
    formData.append("track", newSongFile)
      const response = await fetch('/uploadsong', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        body: formData // body data type must match "Content-Type" header
      });
      let id = response.text()
      console.log("response complete: "+id)
      res(id)
  })
       //returns the id returned from the http post response 
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

//using tempProps to prevent App.js:111 Uncaught TypeError: Cannot add property onClick, object is not extensible
const Library = (props) => {
  let tableHeaders = []
  let tableBody = []
    tableHeaders = <tr>
                       <td key="hnumber">#</td>
                       <td key="hname">title</td>
                       <td key="hartist">artist</td>
                       <td key="halbum">album</td>
                   </tr>; //header elements
    tableBody = props.songs.map((song, i) => <tr key={song.objectID} id={song.objectID} onClick={() => { props.setIndex(i)}}>
                                               <td key={"number"} className="number">{i+1}</td>
                                               <td key={"name"} className="name">{song.name}</td>
                                               <td key={"artist"} className="artist">{song.artist}</td> 
                                               <td key={"album"} className="album">{song.album}</td>
                                             </tr>);
    // tableBody.forEach((row, i) => {
    //   row.onclick = console.log("lol")
    // })
    //addSongLinks(props.songs)
  return (<div>
            <h1>Library</h1>
            <table className="songlist">
              <thead id="listheaders">
                {tableHeaders}
              </thead>
              <tbody id="songlist">
               {tableBody}
              </tbody>
            </table>
          </div>);
}

const SongAdder = () => {
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [album, setAlbum] = useState("")
  const [validUploadPrompt, setValidUploadPrompt] = useState("");
  let duration = -1

  const onUpload = () => {
    //TODO: figure out how to turn this url into a file
    console.log(document.getElementById("upload").files[0])
    console.log("title = "+title)
    console.log("artist = "+artist)
    console.log("album = "+album)
  }
  const onSubmit = async () => {
    let fileExtension = document.getElementById("upload").files[0].name.split('.').pop()
    console.log("fileExtension ="+fileExtension)
    if(fileExtension != 'mp3'){
      console.log("ERROR: uploaded file type must have extension .mp3")
      setValidUploadPrompt("file must be of type .mp3")
    } else {
      setValidUploadPrompt("")
      console.log("Submitting...")
      uploadSong(document.getElementById("upload").files[0]).then((id) => {
        id = id.replace('"','')
        id = id.replace('"','')
        console.log("uploaded song with ObjectId = " + id)

        let songFile = new Audio('/stream/'+id)
        console.log("\nsongfile: ")
        console.log(songFile)
        duration = songFile.duration 
    
        let newSong = {
          name: title,
          artist: artist,
          album: album,
          duration: duration,
          objectID: id
        }
        console.log("\nnewSong: ")
        console.log(newSong)
        addSong(newSong)
    })
    }
  } 


  return <div>
    <h1>Add Song</h1>
    <div>Title: <input type="text" name="songTitle" onChange={event => setTitle(event.target.value)}></input></div>
    <div>Artist: <input type="text" name="songArtist" onChange={event => setArtist(event.target.value)}></input></div>
    <div>Album: <input type="text" name="songAlbum" onChange={event => setAlbum(event.target.value)}></input></div>
    <div>Audio File: <input id="upload" type="file" accept=".mp3" onChange={event => onUpload(event.target.value)}></input></div>
    <div><button onClick={onSubmit}>addSong</button><p id="validupdateprompt">{validUploadPrompt}</p></div>
  </div>
}
const formatTime = (seconds) => {
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
  const [timeStamp, setTimeStamp] = useState(formatTime(0))
  const [timeDuration, setTimeDuration] = useState(formatTime(0))
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
      setTimeStamp(formatTime(0))
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
      setTimeDuration(formatTime(audio.duration))
    })
    audio.addEventListener("timeupdate", () => {
      setTimeStamp(formatTime(audio.currentTime))
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
    <div className="player">
      <h1>Player</h1>
      <div>
        <img src={rewindpng} onClick={() => {prevSong()}}/>
        <img src={playpng} onClick={playPause} id="playpausebutton"/>
        <img src={fastForwardpng} onClick={() => {nextSong()}}/>
        <p>{song.name} {timeStamp}/{timeDuration}</p>
      </div>
    </div>
  )
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
  React.useEffect(() => { //set variables when song info is retrieved from backend.
    fetch('/library').then(
      (response) => response.json()
    ).then((value) => {
      setSongs(value)
    });
  }, [] );

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
              <SongAdder/>
           </div>
  }
  return (
    <div className="App">
      <SongAdder/>
      <Library setIndex={setCurSongIndex} songs={songs} setSongs={setSongs} />
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

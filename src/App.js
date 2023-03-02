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
  fetch('http://127.0.0.1:8000/library').then(
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

//https://stackoverflow.com/questions/1207939/adding-an-onclick-event-to-a-table-row
//TODO: make this work with props
const addSongLinks = (songs) => {
  console.log("rows = ")
  let table = document.getElementById("songlist");
    let rows = table.getElementsByTagName("tr")
    songs.forEach((row,i)=> {
      row = table.rows[i]
      let updateSong = (objectID) => {
        console.log(objectID)
        //props.changeSong(objectID)
      }
      row.onclick = console.log("hi")
      console.log(row)
    })
    console.log("\n")
}
//using tempProps to prevent App.js:111 Uncaught TypeError: Cannot add property onClick, object is not extensible
const Library = (props) => {
  let tableHeaders = []
  let tableBody = []
  const updateSong = () => {
    let id="63fd9d84f9ec3ed4e73c9685"
    props.changeSong(id)
  }
  
  if(props.songs.length != 0){ //TODO: figure out how to put this into a seperate function.
    // console.log("\n songs = "+typeof props.songs)
    // console.log(props.songs)
    tableHeaders = <tr><td key="hname">title</td>
                       <td key="hartist">artist</td>
                       <td key="halbum">album</td>
                   </tr>; //header elements
    // props.songs.forEach((song, i) => {
    //   let updateSong = (objectID) => {
    //     console.log(objectID)
    //     //props.changeSong(objectID)
    //   }
    //   tableBody[i] = <tr key={song.objectID}>
    //     <td key={"name"}>{song.name}</td>
    //     <td key={"artist"}>{song.artist}</td> 
    //     <td key={"album"}>{song.album}</td>
    //   </tr>
    //   tableBody[i].onclick = updateSong(song.objectID)
    // })
    tableBody = props.songs.map((song) => <tr key={song.objectID} id={song.objectID} onClick={updateSong()}>
     <td key={"name"}>{song.name}</td>
     <td key={"artist"}>{song.artist}</td> 
     <td key={"album"}>{song.album}</td>
    </tr>);
    //addSongLinks(props.songs)
  }
  
  return (<div>
            <h1>Library</h1>
            <table>
              <thead>
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
  let duration = -1

  const onUpload = () => {
    //TODO: figure out how to turn this url into a file
    console.log(document.getElementById("upload").files[0])
    console.log("title = "+title)
    console.log("artist = "+artist)
    console.log("album = "+album)
  }
  const onSubmit = async () => {
    console.log("Submitting...")
    uploadSong(document.getElementById("upload").files[0]).then((id) => {
      id = id.replace('"','')
      id = id.replace('"','')
      console.log("uploaded song with ObjectId = " + id)

      let songFile = new Audio('http://127.0.0.1:8000/stream/'+id)
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


  return <div>
    <h1>Add Song</h1>
    <div>Title: <input type="text" name="songTitle" onChange={event => setTitle(event.target.value)}></input></div>
    <div>Artist: <input type="text" name="songArtist" onChange={event => setArtist(event.target.value)}></input></div>
    <div>Album: <input type="text" name="songAlbum" onChange={event => setAlbum(event.target.value)}></input></div>
    <div>Audio File: <input id="upload" type="file" onChange={event => onUpload(event.target.value)}></input></div>
    <div><button onClick={onSubmit}>addSong</button></div>
  </div>
}
const formatTime = (seconds) => {
  //TODO: finish this
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
  let songTitle = song.name
  let link = 'http://127.0.0.1:8000/stream/'+song.curSongID
  const [audio, setAudio] = useState(new Audio(link))
  const [playing, setPlaying] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [playNextSong, setPlayNextSong] = useState(false) //used when a song ends to autoplay next song
  const [timeStamp, setTimeStamp] = useState(formatTime(0))
  const [timeDuration, setTimeDuration] = useState(formatTime(0))

  const loadAudio = () => {
  }
  React.useEffect(() => {
    console.log("Player.Audio changed to next song: "+song.curSongID)
    audio.src = 'http://127.0.0.1:8000/stream/'+song.curSongID
    audio.load()
    setTimeout(() => { //used to ensure audio.play() doesn't conflict with audio.load()
      if(playNextSong){
        audio.play()
        setPlayNextSong(false)
      }
      setTimeStamp(formatTime(0))
    },10)
  }, [song.curSongID] );

  if(!initialized && song.songs.length != 0){ //ensures that only one event listener is attached to audio. After all songs are loaded 
    audio.addEventListener("ended", async (event) =>{
      //TODO: figure out why song.next has  App.songs = []
      audio.currentTime = 0
      setPlayNextSong(true)
      song.next()
    })
    audio.addEventListener("play", () => {
      document.getElementById("playpausebutton").setAttribute("src", pausepng)
      console.log("playing song from " + link)
      setPlaying(true)
    })
    audio.addEventListener("pause", () => {
      document.getElementById("playpausebutton").setAttribute("src", playpng)
      console.log("paused song")
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
    if(playing){setPlayNextSong(true)}
    song.next()
  }
  const prevSong = () => { //used to play previous song
    if(playing){setPlayNextSong(true)}
    song.prev()
  }
  return (
    <div className="player">
      <h1>Player</h1>
      <div>
        <img src={rewindpng} onClick={prevSong}/>
        <img src={playpng} onClick={playPause} id="playpausebutton"/>
        <img src={fastForwardpng} onClick={nextSong}/>
        <p>{songTitle} {timeStamp}/{timeDuration}</p>
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
  const [curSongID, setCurSongID] = useState("63e510bd6d07ddf3584909c7") //ocean man
  const [isLoadingSong, setLoadingSong] = useState(false) //used when the song ends and the next song is starting
  const [curSongName, setCurSongName] = useState("Ocean Man")
  const changeSong = (id) => {
    //console.log("changing song to: "+id)
    //set the song to the song clicked in the library
  }

  const incSong = () => {
    let nextSongIndex = curSongIndex + 1
    if(nextSongIndex > (songs.length - 1)){
      nextSongIndex = 0
    }
    // console.log("incSong next song = ")
    // console.log(songs)
    // console.log("at index: "+curSongIndex)
    setCurSongIndex(nextSongIndex)
    setCurSongID(songs[nextSongIndex].objectID)
    setCurSongName(songs[nextSongIndex].name)
    console.log(songs)
    console.log(curSongIndex+" incremented song to: "+curSongName)
    
  }

  const decSong = () => {
    let nextSongIndex = curSongIndex - 1
    if(nextSongIndex < 0){
      nextSongIndex = songs.length - 1
    }
    setCurSongIndex(nextSongIndex)
    setCurSongID(songs[nextSongIndex].objectID)
    setCurSongName(songs[nextSongIndex].name)
    console.log(songs)
    console.log(curSongIndex+" decremented song to: "+curSongName)
  }

  const loadSong = () => {
    setLoadingSong(true)
    setTimeout(setLoadingSong(false), 1000)//wait a second to finish loading the song
  }

  React.useEffect(() => {
    fetch('http://127.0.0.1:8000/library').then(
      (response) => response.json()
    ).then((value) => {
      setSongs(value)
    });
  }, [] );

  return (
    <div className="App">
      <SongAdder/>
      <Library changeSong={changeSong} songs={songs} setSongs={setSongs} />
      <Player 
        name={curSongName}
        curSongID={curSongID} 
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

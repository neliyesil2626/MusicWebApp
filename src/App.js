import './App.css';
import React,{useState,useEffect} from 'react'
import rewindpng from './assets/Rewind.png'; 
import fastForwardpng from './assets/Fast Forward.png';
import playpng from './assets/Play.png';
import pausepng from './assets/Pause.png' 

// function from: https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const myfetch = async (url) => {
  let data = await myfetch(url);
  let json = await data.json(); //convert json returned by fetch into an object
  return json;
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
  const response = await myfetch('/deletesong', {
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

const Player = (song) => {
  //const link = 'https://oco.ceoc.cx/api/v1/download?sig=aAgPdxeETul%2BpOXfGcYKIJy5jX8MGfp9F1vm0xYRHzv7WZWu4PEhRh56QKfIvB8urgkZSi%2B1UtaZdaX5I8zFu1B3geNi%2FWJ%2Fi8FBfDgC0KIEauWSf9TH6ZzTjZzIzq3AkXwz%2BLZRy13atFR5vnPwywlza4MN8ij%2FDo4ehh9HkBNzEO83qVMqRXUnvLPXHurL%2B%2BcOFRDEHC1Yd3n%2Bwj7s42PwuFMtHxAK45aMhG475Lg0xvfMbHDM7JmYi1N0rRM%2F7kcQbJYjhBsyi%2Bau6I%2FvHoqcBP95Yvn2lOXzmt5QCcTZZmFy3ffIeLkCl6vq9hlpj0KLy1zpKlEM5hhEaNu%2BRA%3D%3D&v=slFWHLwLAkw&_=0.3713977547051399'
  //const link = 'http://127.0.0.1:8000/stream/63e510bd6d07ddf3584909c7'
  console.log(song)
  const link = 'http://127.0.0.1:8000/stream/'+song.curSongID
  const [audio, setAudio] = useState(new Audio(link))
  audio.addEventListener("ended", function(){
    audio.currentTime = 0
    console.log("ended")
  })
  const [playing, setPlaying] = useState(false)
  audio.volume = 0.5
  const playPause = () =>{
    if(!playing){
      document.getElementById("playpausebutton").setAttribute("src", pausepng)
      console.log("playing song from " + link)
      audio.play()
      setPlaying(true)
    } else {
      document.getElementById("playpausebutton").setAttribute("src", playpng)
      console.log("paused song")
      audio.pause()
      setPlaying(false)
    }
  }
  //const library = fetch('http://127.0.0.1:8000/library');
  //console.log(library);
  return (
    <div className="player">
      <h1>Player</h1>
      <p><img src={rewindpng}/>
      <img src={playpng} onClick={playPause} id="playpausebutton"/>
      <img src={fastForwardpng}/></p>
    </div>
  )
}

/**
 * Create the player component. 
 * 
 * @returns The App component
 */
function App() {
  //const [curSongID, setCurSongID] = useState("63e510bd6d07ddf3584909c7") //ocean man
  const [curSongID, setCurSongID] = useState("63fd9d84f9ec3ed4e73c9685") //I am a junkyard
  return (
    <div className="App">
      <SongAdder/>
      <Player curSongID={curSongID}/>
    </div>
  );
}

export default App;

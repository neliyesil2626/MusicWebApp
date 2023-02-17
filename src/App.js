import './App.css';
import React,{useState,useEffect} from 'react'

const fetch = async (url) => {
  let data = await fetch(url);
  let json = await data.json(); //convert json returned by fetch into an object
  return json;
}

// async function streamSong(trackNumber) {
//   let data = await fetch('http://127.0.0.1:8000/stream/'+trackNumber);
//   let json = await data.json(); //convert json returned by fetch into an object
//   return json;
// }

//got this from: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
async function addData(newDog) {
  // Default options are marked with *
  const response = await fetch('/addsong', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newDog) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

//got this from: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
async function deleteData(id) {
  // Default options are marked with *
  const response = await fetch('/deletesong', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
    },
    body: '{"_id": "'+id+'"}'// body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

const Player = (song) => {
  //const link = 'https://oco.ceoc.cx/api/v1/download?sig=aAgPdxeETul%2BpOXfGcYKIJy5jX8MGfp9F1vm0xYRHzv7WZWu4PEhRh56QKfIvB8urgkZSi%2B1UtaZdaX5I8zFu1B3geNi%2FWJ%2Fi8FBfDgC0KIEauWSf9TH6ZzTjZzIzq3AkXwz%2BLZRy13atFR5vnPwywlza4MN8ij%2FDo4ehh9HkBNzEO83qVMqRXUnvLPXHurL%2B%2BcOFRDEHC1Yd3n%2Bwj7s42PwuFMtHxAK45aMhG475Lg0xvfMbHDM7JmYi1N0rRM%2F7kcQbJYjhBsyi%2Bau6I%2FvHoqcBP95Yvn2lOXzmt5QCcTZZmFy3ffIeLkCl6vq9hlpj0KLy1zpKlEM5hhEaNu%2BRA%3D%3D&v=slFWHLwLAkw&_=0.3713977547051399'
  //const link = 'http://127.0.0.1:8000/stream/63e510bd6d07ddf3584909c7'
  console.log(song)
  const link = 'http://127.0.0.1:8000/stream/'+song.curSongID
  const [audio, setAudio] = useState(new Audio(link))
  audio.addEventListener("ended", function(){
    audio.currentTime = 0;
    console.log("ended");
  })
  const [p, setP] = useState(false)
  audio.volume = 0.5
  const playPause = () =>{
    if(!p){
      console.log("playing song from " + link)
      audio.play()
      setP(true)
    } else {
      console.log("paused song")
      audio.pause()
      setP(false)
    }
  }
  //const library = fetch('http://127.0.0.1:8000/library');
  //console.log(library);
  return (
    <div className="player">
      <h1>Player</h1>
      <p><button>prev</button>
      <button onClick={playPause}>pause</button>
      <button>next</button></p>
    </div>
  )
}

/**
 * Create the player component. 
 * 
 * @returns The App component
 */
function App() {
  const [curSongID, setCurSongID] = useState("63e510bd6d07ddf3584909c7")
  
  return (
    <div className="App">
      <Player curSongID={curSongID}/>
    </div>
  );
}

export default App;

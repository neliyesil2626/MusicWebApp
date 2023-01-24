import './App.css';
import React,{useState,useEffect} from 'react'

const fetchData = async (url) => {
  let data = await fetch(url);
  let json = await data.json(); //convert json returned by fetch into an object
  return json;
}

//got this from: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
async function addData(newDog) {
  // Default options are marked with *
  const response = await fetch('/adddog', {
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
  const response = await fetch('/deletedog', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
    },
    body: '{"_id": "'+id+'"}'// body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

//player component
const Player = () => {
  return (
    <div className="player">
      <h1>Player</h1>
      <p><button><<</button><button>||</button><button>>></button></p>
    </div>
  )
}

/**
 * Create the player component. 
 * 
 * @returns The App component
 */
function App() {
  return (
    <div className="App">
      <Window component={<Player/>}/>
    </div>
  );
}

export default App;

export const URL = 'http://localhost:8000'

export async function getLibrary(songs, setSongs){
  fetch(URL+'/library', {mode: 'cors'}).then(
    (response) => response.json()
  ).then((value) => {
    setSongs(value)
    console.log("songs = ")
    console.log(songs)
    console.log("\n")
  });
}
export async function getUserPlayLists(uid, setPlaylists) {
  fetch(URL+'/userPlaylists/'+uid).then(
    (response) => response.json()
  ).then((value) => {
    setPlaylists(value)
  });
}

  //got this from: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  export async function addSong(newSong) {
    //downloadFile(mp3File, "songtest.mp3")
    console.log("Song Title = "+newSong.name+"\n"+
                "Song Artist = "+newSong.artist+"\n"+
                "Song Album = "+newSong.album+"\n"+
                "Song Duration = "+newSong.duration+"\n"+
                "Song ID = "+ newSong.objectID)
    // Default options are marked with *
    const response = await fetch(URL+'/addsong', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newSong) // body data type must match "Content-Type" header
      
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
  
  //used to upload an mp3 file to the backend server. 
  //found out how to use formData from https://stackoverflow.com/questions/5587973/javascript-upload-file
  export async function uploadSong(newSongFile){
    return new Promise(async(res,rej) => {
      console.log("uploading song: "+newSongFile.name);
      console.log(newSongFile)
      let formData = new FormData()
      formData.append("name", newSongFile.name)
      formData.append("track", newSongFile)
        const response = await fetch(URL+'/uploadsong', {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors',
          body: formData // body data type must match "Content-Type" header
        });
        let id = response.text()
        console.log("response complete: "+id)
        res(id)
    })
         //returns the id returned from the http post response 
  }

export async function editSong(newSong) {
    // Default options are marked with *
    console.log(JSON.stringify(newSong));
    const response = await fetch(URL+'/editsong', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify(newSong) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
export async function deleteSong(newSong){
  console.log("removing "+ newSong.name);
  console.log(JSON.stringify(newSong));
    const response = await fetch(URL+'/deletesong', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify({id: newSong._id,
                            name: newSong.name, 
                            objectID: newSong.objectID 
                          }) // body data type must match "Content-Type" header
    });
    return response.json();
}

export async function addPlaylist(id, newPlaylist) {
    //downloadFile(mp3File, "songtest.mp3")
    console.log("Playlist Name = "+newPlaylist.name+"\n"+
                "Playlist UID = "+newPlaylist.userID+"\n"+
                "Playlist Songs = ")
                console.log(newPlaylist.songs)
    // Default options are marked with *
    const response = await fetch(URL+'/createPlaylist', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify(newPlaylist) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  export async function editPlaylist(id, newPlaylist) {
    console.log("editing playlist :)"); 
    newPlaylist.id = id;

    console.log("Object ID = "+newPlaylist.id+"\n"+
                "Playlist Name = "+newPlaylist.name+"\n"+
                "Playlist UID = "+newPlaylist.userID+"\n"+
                "Playlist Songs = ")
                console.log(newPlaylist.songs)
    //Default options are marked with *
    const response = await fetch(URL+'/editPlaylist', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify(newPlaylist) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
  

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
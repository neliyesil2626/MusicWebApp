export async function editSong(newSong) {
    // Default options are marked with *
    console.log(JSON.stringify(newSong));
    const response = await fetch('/editsong', {
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
    const response = await fetch('/deletesong', {
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
    const response = await fetch('/createPlaylist', {
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
    const response = await fetch('/editPlaylist', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify(newPlaylist) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
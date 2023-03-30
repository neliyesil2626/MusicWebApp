import React,{useState} from 'react';

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
  const clearSongAdderInputs = () => {
    document.getElementsByName("songTitle")[0].value = ""
    document.getElementsByName("songArtist")[0].value = ""
    document.getElementsByName("songAlbum")[0].value = ""
  }
  const SongAdder = (props) => {
    const [title, setTitle] = useState("")
    const [artist, setArtist] = useState("")
    const [album, setAlbum] = useState("")
    const [validUploadPrompt, setValidUploadPrompt] = useState("");
    let duration = -1
    const refresh = () => {
      if(props.refresh){
        props.setRefresh(false)
      } else {
        props.setRefresh(true)
      }
    }
    const onUpload = () => {
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
          clearSongAdderInputs()
          refresh()
      })
      }
    } 
    return <div style={{width:"fit-content"}}>
      <h1>o Add Song</h1>
      <div><input type="text" name="songTitle" placeholder="Title" onChange={event => setTitle(event.target.value)}></input></div>
      <div><input type="text" name="songArtist" placeholder="Artist" onChange={event => setArtist(event.target.value)}></input></div>
      <div><input type="text" name="songAlbum" placeholder="Album" onChange={event => setAlbum(event.target.value)}></input></div>
      <div><input id="upload" type="file" accept=".mp3" placeholder="Upload File" onChange={event => onUpload(event.target.value)}></input></div>
      <div><center><button onClick={onSubmit}>addSong</button></center><p id="validupdateprompt">{validUploadPrompt}</p></div>
    </div>
  }
  export default SongAdder
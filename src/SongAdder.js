import React,{useState} from 'react';

import { Text, Center, Heading, Button, VStack, Input, Image, Divider, Flex} from '@chakra-ui/react';
import { COLOR } from './ChakraTheme';
import logo from './assets/logo.svg';
import { uploadSong,addSong } from './DatabaseAccess';

  const clearSongAdderInputs = () => {
    document.getElementsByName("songTitle")[0].value = ""
    document.getElementsByName("songArtist")[0].value = ""
    document.getElementsByName("songAlbum")[0].value = ""
    document.getElementById("upload").value="";
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
    let sideMenuWidth = (document.getElementById("sidemenu") !== null) ? document.getElementById("sidemenu").offsetWidth : 0
    return <VStack 
        w={'calc(100vw - '+sideMenuWidth+'px - '+sideMenuWidth+'px)'}
        alignItems='center'
    >
      <Image src={logo} alt="logo" width='15rem' align='center'/>
      <Divider 
        top='9rem'
        left='0rem'
        w='100vw'
        position='absolute'
        borderColor={COLOR.secondaryFont}
      ></Divider>
      <Heading m='20px'>Add Song</Heading>
      <Input type="text" name="songTitle" placeholder="Title" 
       onChange={event => setTitle(event.target.value)} 
       borderColor={COLOR.secondaryFont}w='24rem' id="songTitleInput"
       onKeyUp={(event) => {
        if(event.key === 'Enter'){
          document.getElementById("songArtistInput").focus()
        }
       }}
       ></Input>
      <Input type="text" name="songArtist" placeholder="Artist"
       onChange={event => setArtist(event.target.value)} 
       borderColor={COLOR.secondaryFont}w='24rem' id="songArtistInput"
       onKeyUp={(event) => {
        if(event.key === 'Enter'){
          document.getElementById("songAlbumInput").focus()
        }
       }}
       ></Input>
      <Input type="text" name="songAlbum" placeholder="Album"
       onChange={event => setAlbum(event.target.value)} 
       borderColor={COLOR.secondaryFont}w='24rem' id="songAlbumInput"
       onKeyUp={(event) => {
        if(event.key === 'Enter'){
          document.getElementById("upload").focus()
        }
       }}
       ></Input>
      <Input id="upload" type="file" accept=".mp3" placeholder="Upload File" 
       onChange={event => onUpload(event.target.value)} 
       border='none'w='24rem'
       onKeyUp={(event) => {
        if(document.getElementById("upload").files.length !== 0 && event.key === 'Enter'){
          document.getElementById("addSongButton").focus()
        }
       }}
       ></Input>
      <Center><Button id='addSongButton' onClick={onSubmit} bg={COLOR.pink} _hover={{ bg: COLOR.pinkHover }}>addSong</Button></Center><Text id="validupdateprompt">{validUploadPrompt}</Text>
    </VStack>
  }
  export default SongAdder
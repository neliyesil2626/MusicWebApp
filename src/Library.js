import { 
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  Box,
  Input,
  Button,
  MenuGroup,
  VStack,
  HStack,
  CloseButton
} from '@chakra-ui/react'
import {COLOR} from './ChakraTheme.js';
import React,{useState} from 'react';
  //using tempProps to prevent App.js:111 Uncaught TypeError: Cannot add property onClick, object is not extensible

  async function editSong(newSong) {
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

 const menuItem = (objectID, type, attribute, set) => {
  return <HStack
  ml='20px'
  mr='20px'
>
  <Input type="text" name={'song'+type} placeholder={attribute}
    onChange={event => set(event.target.value)} 
    borderColor={COLOR.secondaryFont} 
    id={type+'edit'+objectID}
    h='2em'
    w='12em'></Input>
  <CloseButton onClick={()=>{
    document.getElementById(type+'edit'+objectID).value = '';
    set(attribute);
  }}
  w='2em'
  h='2em'
  bg='transparent'
  color={COLOR.secondaryFont}
  _hover={{ color: COLOR.primaryFont, bg:COLOR.bg}}
  ></CloseButton>
</HStack>
 }
 const songEditMenu = (song, setTitle, setAlbum, setArtist, onSubmit) => {
  return <Menu bg={COLOR.bg2} closeOnSelect={false} position='fixed'>
  <MenuButton colorscheme='transparent' >•••</MenuButton>
  <MenuList bg={COLOR.bg2}>
    <MenuGroup title={'Edit '+song.name} >
      <VStack>
        {menuItem(song.objectID, 'name', song.name, setTitle)}
        {menuItem(song.objectID, 'artist', song.artist, setArtist)}
        {menuItem(song.objectID, 'album', song.album, setAlbum)}
        <Button onClick={() => {onSubmit(song)}} bg={COLOR.pink} _hover={{ bg: COLOR.pinkHover }}>confirm</Button>
      </VStack>
    </MenuGroup>
  </MenuList>
</Menu>
 }

  const Library = (props) => {
    let tableHeaders = []
    let tableBody = []
    let tableEdits = []
    const [newTitle, setNewTitle] = new useState("")
    const [newAlbum, setNewAlbum] = new useState("")
    const [newArtist, setNewArtist] = new useState("")
    const onSubmit = (song) => {
      if(newTitle === '') {
        setNewTitle(song.name);
      }
      if(newArtist === '') {
        setNewArtist(song.artist);
      }
      if(newAlbum === ''){
        setNewAlbum(song.album);
      } 
      console.log(song._id)
      console.log("song = "+newTitle+", artist = "+newArtist+", album = "+newAlbum)
      let newSong = {
        id: song._id,
        name: newTitle,
        artist: newArtist,
        album: newAlbum,
        duration: song.duration,
        objectID: song.objectID
      }
      editSong(newSong)

    }
    const rowOnClick = (i) => {
      props.setIndex(i);
    }

      tableHeaders = <Tr color={COLOR.secondaryFont} borderBottom='1px' borderColor={COLOR.secondaryFont} >
                         <Td key="hnumber">#</Td>
                         <Td key="hname">title</Td>
                         <Td key="hartist">artist</Td>
                         <Td key="halbum">album</Td>
                         <Td key="heditsong"></Td>
                     </Tr>; //header elements
      tableBody = props.songs.map((song, i) => <Tr key={song.objectID} id={song.objectID} 
        borderBottom='none'
        _hover={{ bg: COLOR.bgHover }}
        h='2em'
      >
          <Td key={"number"} className="number" color={COLOR.secondaryFont} w='1em' onClick={() => { rowOnClick(i)}}>{i+1}</Td>
          <Td key={"name"} className="name" paddingLeft='0' fontSize='1.2em' onClick={() => { rowOnClick(i)}}>{song.name}</Td>
          <Td key={"artist"} className="artist" onClick={() => { rowOnClick(i)}} color={COLOR.secondaryFont}>{song.artist}</Td> 
          <Td key={"album"} className="album" onClick={() => { rowOnClick(i)}} color={COLOR.tertiaryFont}>{song.album}</Td>
          <Td key={"editSong"} className="editsong" >{songEditMenu(song, setNewTitle, setNewAlbum, setNewArtist, onSubmit)}</Td>
      </Tr>);
    let sideMenuWidth = (document.getElementById("sidemenu") === null)? 12 : document.getElementById("sidemenu").offsetWidth
    return (<Box 
              maxH='calc(100vh - 20px)'
              dispaly='inline-block'
              overflowY='scroll'
              overflowX='hidden'
              >
              <Heading m='20px'>{props.header}</Heading>
              
              <Table className="songlist" 
                variant='unstyled'
                size='md' 
                w={'calc(100vw - '+sideMenuWidth+'px)'}
                position='relative'
                
                p='0'
              >
                <Thead id="listheaders">
                  {tableHeaders}
                </Thead>
                <Tbody id="songlist">
                 {tableBody}
                </Tbody>
              </Table>
            </Box>);
  }

  export default Library
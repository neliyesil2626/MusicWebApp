import { 
    Flex,
    Box,
    Text,
    Image,
    Divider,
    Heading,
    Input,
    Button,
    Center,
    VStack,
    HStack,
    CloseButton,
    Tr,
    Td,
    Table,
    Tbody,
    Thead
  } from '@chakra-ui/react'
  import logo from './assets/logo.svg'
  import {COLOR} from './ChakraTheme.js';
  import React,{useState} from 'react';
  

  async function addPlaylist(newPlaylist) {
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

const CreatePlaylist = (props) => {
    let [name, setName] = useState("");
    let [songIndexes, setSongIndexes] = useState([]);
    let tableHeaders = []
    let selectSongTableBody = []
    let addedSongTableBody = []
    React.useEffect(() => {
        console.log(songIndexes);
    }, [songIndexes])
    const onSubmit = () => {
        if(name != ""){
            let newPlaylist = {
                name: name,
                userID: props.uid,
                songs: songIndexes.map(i => props.songs[i].objectID)
            }
            addPlaylist(newPlaylist)
            let refresh = props.uid
            props.setUid("")
            props.setUid(refresh)
        } else {
            alert("Your playlist must have a name.");
        }
    }
    const addSong = (i) => {
        console.log("adding song with index: "+i)
        if(!songIndexes.includes(i)){
            setSongIndexes(songIndexes.concat(i))
        } else {
            console.log("already included")
        }
    }
    const removeSong = (i) => {
        console.log("removed song at index ", i)
        setSongIndexes(songIndexes.filter((songIndex) => songIndex !== i))
    }

    const rowOnClick = (i) => {
        props.setIndex(i);
      }
  
    tableHeaders = <Tr color={COLOR.secondaryFont} borderBottom='1px' borderColor={COLOR.secondaryFont} >
                        <Td key="hname">title</Td>
                        <Td key="hartist">artist</Td>
                        <Td key="heditsong"></Td>
                    </Tr>; //header elements
    selectSongTableBody = props.songs.filter((song, i) => !songIndexes.includes(i)).map((song) => <Tr key={song.objectID} id={song.objectID} 
        borderBottom='none'
        _hover={{ bg: COLOR.bgHover }}
        h='2em'
    >
        <Td key={"name"} className="name" paddingLeft='0' fontSize='1.2em' onClick={() => { rowOnClick(props.songs.indexOf(song))}}>{song.name}</Td>
        <Td key={"artist"} className="artist" onClick={() => { rowOnClick(props.songs.indexOf(song))}}>{song.artist}</Td> 
        <Td key={"addSong"} className="addSong" >
            <Button 
                onClick={() => {addSong( props.songs.indexOf(song)) }} 
                bg='transparent'
                color={COLOR.primaryFont} 
                borderRadius='full'
                _hover={{ bg: COLOR.pink}} 
                fontSize='1.5REM'
            >+</Button>
        </Td>
    </Tr>);

    addedSongTableBody = songIndexes.map((i) => <Tr key={props.songs[i].objectID} id={props.songs[i].objectID} 
        borderBottom='none'
        _hover={{ bg: COLOR.bgHover, cursor: 'default'}}
        h='2em'
    >
        <Td key={"name"} className="name" paddingLeft='0' fontSize='1.2em'>{props.songs[i].name}</Td>
        <Td key={"artist"} className="artist">{props.songs[i].artist}</Td> 
        <Td key={"removeSong"} className="removeSong" >
            <CloseButton
                onClick={() => {removeSong(i)}} 
                bg='transparent'
                color={COLOR.primaryFont} 
                borderRadius='full'
                _hover={{ bg: COLOR.pink}} 
            ></CloseButton>
        </Td>
    </Tr>);

    return (<Box 
        h='fit-content'
        w={'calc(100vw - '+document.getElementById("sidemenu").offsetWidth+'px)'}
        mb='16rem'
        dispaly='inline-block'
        overflowY='scroll'
        maxH={'calc(100vh - '+document.getElementById("player").offsetHeight+'px)'}
        pb='10rem'
        >
            <VStack>
                <Heading m='20px' pb='20px'>Create Playlist</Heading>
                <Input type="text" name="playlistName" placeholder="Title" onChange={event => setName(event.target.value)} borderColor={COLOR.secondaryFont}w='24rem'></Input>
                <HStack>
                    <Table className="songlist" 
                            alignSelf='flex-start'
                            variant='unstyled'
                            size='md' 
                            w='calc(50vw - 127px)'
                            position='relative'
                            
                            p='0'
                    >
                        <Thead id="addedsonglistheaders">
                            {tableHeaders}
                        </Thead>
                        <Tbody id="addedsonglist">
                            {selectSongTableBody}
                        </Tbody>
                    </Table>
                    <Table className="addedsonglist" 
                        alignSelf='flex-start'
                        variant='unstyled'
                        size='md' 
                        w='calc(50vw - 127px)'
                        position='relative'
                        
                        p='0'
                    >
                        <Thead id="addedsonglistheaders">
                            {tableHeaders}
                        </Thead>
                        <Tbody id="addedsonglist">
                            {addedSongTableBody}
                        </Tbody>
                    </Table>
                    
                </HStack>
                <Center pt='20px'><Button onClick={onSubmit} bg={COLOR.pink} _hover={{ bg: COLOR.pinkHover }}>Create Playlist</Button></Center>
            </VStack>
    </Box>);
}
export default CreatePlaylist
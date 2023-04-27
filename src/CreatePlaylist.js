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
import Pages from './PageEnums';
  

  async function addPlaylist(id, newPlaylist) {
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

  async function editPlaylist(id, newPlaylist) {
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

const CreatePlaylist = (props) => {
    let [name, setName] = useState("");
    let [songIndexes, setSongIndexes] = useState([]);
    let [initialized, setInitialized] = useState(false);
    let selectSongTableHeaders = []
    let addedSongTableHeaders = []
    let selectSongTableBody = []
    let addedSongTableBody = []
    let submitFunction = (props.page === Pages.CreatePlaylist)? addPlaylist: editPlaylist;
    let pageTitle = (props.page === Pages.CreatePlaylist)? 'Create Playlist' : 'Edit '+props.name;
    if(props.page === Pages.EditPlaylist && !initialized){
        setSongIndexes(props.indexes)
        setName(props.name)
        setInitialized(true);
    }
    
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
            submitFunction(props.playlistID, newPlaylist)
            props.setRefresh(!props.refresh);
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
  
    selectSongTableHeaders = <Tr color={COLOR.secondaryFont} borderBottom='1px' borderColor={COLOR.secondaryFont} >
                        <Td key="hname" w='45%'>title</Td>
                        <Td key="hartist" w='45%'>artist</Td>
                        <Td key="heditsong" w='10%'>add</Td>
                    </Tr>; //header elements
    selectSongTableBody = props.songs.filter((song, i) => !songIndexes.includes(i)).map((song) => <Tr key={song.objectID} id={song.objectID} 
        borderBottom='none'
        _hover={{ bg: COLOR.bgHover }}
        h='2em'
    >
        <Td key={"name"} className="name" paddingLeft='0' fontSize='1.2em' onClick={() => { rowOnClick(props.songs.indexOf(song))}}>{song.name}</Td>
        <Td key={"artist"} className="artist" onClick={() => { rowOnClick(props.songs.indexOf(song))}} color={COLOR.secondaryFont}>{song.artist}</Td> 
        <Td key={"addSong"} className="addSong" >
            <CloseButton 
                onClick={() => {addSong( props.songs.indexOf(song)) }} 
                bg='transparent'
                color={COLOR.primaryFont} 
                borderRadius='full'
                _hover={{ bg: COLOR.pink}} 
                fontSize='2rem'
            >+</CloseButton>
        </Td>
    </Tr>);

    addedSongTableHeaders = <Tr color={COLOR.secondaryFont} borderBottom='1px' borderColor={COLOR.secondaryFont} >
                        <Td key="hname" w='45%'>title</Td>
                        <Td key="hartist" w='45%'>artist</Td>
                        <Td key="heditsong" w='10%'>remove</Td>
                    </Tr>; //header elements
    addedSongTableBody = songIndexes.map((i) => <Tr key={props.songs[i].objectID} id={props.songs[i].objectID} 
        borderBottom='none'
        _hover={{ bg: COLOR.bgHover, cursor: 'default'}}
        h='2em'
    >
        <Td key={"name"} className="name" paddingLeft='0' fontSize='1.2em'>{props.songs[i].name}</Td>
        <Td key={"artist"} className="artist" color={COLOR.secondaryFont}>{props.songs[i].artist}</Td> 
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
    let sideMenuWidth = document.getElementById("sidemenu").offsetWidth
    return (<Box 
        h='fit-content'
        w={'calc(100vw - '+sideMenuWidth+'px)'}
        display='inline-block'
        overflowY='scroll'
        overflowX='hidden'
        maxH={'calc(100vh - '+document.getElementById("player").offsetHeight+'px)'}
        pb='5rem'
        >
            <Heading m='20px' >{pageTitle}</Heading>
            <VStack alignContent='flex-start'>
                <Input type="text" name="playlistName" placeholder="Playlist Title" value={name} onChange={event => setName(event.target.value)} borderColor={COLOR.secondaryFont}w='24rem'></Input>
                <HStack>
                    <Table className="songlist" 
                            alignSelf='flex-start'
                            variant='unstyled'
                            size='sm' 
                            w={'calc(50vw - 10px - '+sideMenuWidth/2+'px)'}
                            position='relative'
                            borderRight='1px'
                            borderRightColor={COLOR.secondaryFont}
                    >
                        <Thead id="addedsonglistheaders"  >
                            {selectSongTableHeaders}
                        </Thead>
                        <Tbody id="addedsonglist">
                            {selectSongTableBody}
                        </Tbody>
                    </Table>
                    <Table className="addedsonglist" 
                        alignSelf='flex-start'
                        variant='unstyled'
                        size='sm' 
                        w={'calc(50vw - 10px - '+sideMenuWidth/2+'px)'}
                        position='relative'
                    >
                        <Thead id="addedsonglistheaders">
                            {addedSongTableHeaders}
                        </Thead>
                        <Tbody id="addedsonglist">
                            {addedSongTableBody}
                        </Tbody>
                    </Table>
                    
                </HStack>
                <Center pt='20px'><Button onClick={onSubmit} bg={COLOR.pink} _hover={{ bg: COLOR.pinkHover }}>{pageTitle}</Button></Center>
            </VStack>
    </Box>);
}
export default CreatePlaylist
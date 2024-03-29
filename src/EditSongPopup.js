import { 
    
    Popover,
    PopoverTrigger,
    PopoverHeader,
    PopoverContent,
    FocusLock,
    PopoverArrow,
    PopoverCloseButton,
    useDisclosure,
    HStack,
    CloseButton,
    Input,
    Stack, 
    TextInput,
    ButtonGroup,
    Button,
    ColorModeContext,
    Text,
    VStack,
    IconButton,
    background,
  } from '@chakra-ui/react'
  import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
  import logo from './assets/logo.svg'
  import {COLOR} from './ChakraTheme.js';
  import React,{useState} from 'react';
  import {deleteSong, editPlaylist} from './DatabaseAccess.js'
  import Pages from './PageEnums.js';

  const menuItem = (objectID, type, attribute, set) => {
    return <HStack>
      <Input type="text" name={'song'+type} placeholder={attribute}
        className='textform'
        onChange={event => set(event.target.value)} 
        borderColor={COLOR.secondaryFont} 
        id={type+'edit'+objectID}
        h='2em'
        w='12em'
        mr='4em'
        
      />
      <CloseButton onClick={()=>{
          document.getElementById(type+'edit'+objectID).value = '';
          set(attribute);
        }}
        w='2em'
        h='2em'
        bg='transparent'
        color={COLOR.secondaryFont}
        _hover={{ color: COLOR.primaryFont, bg:COLOR.bg}}
      />
    </HStack>
}

const editSongInfo = (song, setTitle, setArtist, setAlbum, onSubmit, onClose) => {
  return <PopoverContent bg={COLOR.bg2} border='none' p='10px' >
                    <PopoverHeader color={COLOR.primaryFont}>{"Edit "+song.name}</PopoverHeader>
                    <PopoverCloseButton/>
                    <FocusLock returnFocus persistentFocus={false}>
                        <VStack pt='15px' alignItems='flex-start' pl='10px'>
                            {menuItem(song.objectID, 'name', song.name, setTitle)}
                            {menuItem(song.objectID, 'artist', song.artist, setArtist)}
                            {menuItem(song.objectID, 'album', song.album, setAlbum)}
                            <ButtonGroup display='flex' alignSelf='flex-end' justifyContent='flex-end'>
                                <Button  
                                    onClick={() => {onClose()}}
                                    border=''
                                    color={COLOR.secondaryFont}
                                    bg='transparent'
                                    _hover={{ color: COLOR.primaryFont, bg: COLOR.bg }}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                  bg={COLOR.pink}
                                  _hover={{ bg: COLOR.pinkHover }}
                                  onClick={() => {onSubmit(song)}}
                                  className='textform'
                                >
                                    Save
                                </Button>
                            </ButtonGroup>
                        </VStack>
                    </FocusLock>
                </PopoverContent>
}

const deletionMenu = (song, onClose, deleteButtonClickHandler) => {
  
  return (<PopoverContent bg={COLOR.bg2} border='none' p='10px' w='fit-content'>
            <Text color={COLOR.primaryFont} pb='15px' pr='1.5rem'>{"Are you sure you want to remove "+song.name+"? "}</Text>
            <PopoverCloseButton/>
            <ButtonGroup display='flex' alignSelf='center' justifyContent='flex-end'>
                                <Button  
                                    onClick={() => {onClose()}}
                                    border=''
                                    color={COLOR.secondaryFont}
                                    bg='transparent'
                                    _hover={{ color: COLOR.primaryFont, bg: COLOR.bg }}
                                    alignItems='center'
                                >
                                    Cancel
                                </Button>
                                <Button 
                                  bg={COLOR.pink}
                                  _hover={{ bg: COLOR.pinkHover }}
                                  onClick={() => {
                                    deleteButtonClickHandler()
                                  }}
                                >
                                    Confirm
                                </Button>
                            </ButtonGroup>
          </PopoverContent>);
}

const selectionMenu = (setMenuFocus, DELETE, EDIT) => {
  
  return (<PopoverContent bg={COLOR.bg2} border='none' 
          p='10px' w='fit-content'
          _hover={{cursor:'default'}}>
            <HStack pr='1rem'>
              <IconButton icon={<EditIcon/>} 
                    bg='transparent'
                    color={COLOR.pink}
                    _hover={{background: COLOR.bg, color: COLOR.primaryFont}}
                    w='fit-content'
                    onClick={()=>{setMenuFocus(EDIT)}}/>
              <IconButton icon={<DeleteIcon/>} 
                    bg='transparent'
                    color={COLOR.pink}
                    _hover={{background: COLOR.bg, color: COLOR.primaryFont}}
                    w='fit-content'
                    onClick={()=>{setMenuFocus(DELETE)}}/>
              <PopoverCloseButton/>
            </HStack>
          </PopoverContent>);
}

const EditSongPopUp = (props) => {
  const FOCUS = {SELECT:0, DELETE:1, EDIT:2} 
  const [menuFocus, setMenuFocus] = new useState(FOCUS.SELECT);
  const { onOpen, onClose, isOpen } = useDisclosure()
  let focusedPage

  const deleteButtonClickHandler = async () => {
    if(props.page === Pages.Playlist){
      let newSongs = props.playlist.songs.filter(songID => songID !== props.song.objectID)
      let response = await editPlaylist(props.playlist._id, {
          name: props.playlist.name,
          userID: props.playlist.uid,
          songs: newSongs
      })
      // if(response.status === 'ok'){
      //   console.log('okay')
      //   props.setSongs(newSongs)
      // }
      // this line creates a weird side effect where clicking on the library tab errors out 
      document.getElementById(props.song.objectID).remove();
      
      props.setRefreshPlaylists(!props.refreshPlaylists)
    } else {
      let response = await deleteSong(props.song)
      props.setRefresh(!props.refresh)
    }
    
    
  }

  switch(menuFocus){
    case FOCUS.DELETE:
      focusedPage=deletionMenu( props.song, onClose, deleteButtonClickHandler);
      break
    case FOCUS.EDIT:
      focusedPage=editSongInfo(props.song, props.setTitle, 
        props.setArtist, props.setAlbum, props.onSubmit,
        onClose)
      break
    case FOCUS.SELECT:
    default:
      focusedPage=selectionMenu(setMenuFocus, FOCUS.DELETE, FOCUS.EDIT);
  }
  
  return (<Popover placement='left'
              isLazy='true'
              onClose={() => {
                setMenuFocus(FOCUS.SELECT)}
              }
              _hover={{cursor:'default'}}
          >
              <PopoverTrigger><Text fontSize='1.2rem'>•••</Text></PopoverTrigger>
              {focusedPage}
          </Popover>);
}

export default EditSongPopUp
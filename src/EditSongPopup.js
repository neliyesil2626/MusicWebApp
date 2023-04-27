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
    VStack
  } from '@chakra-ui/react'
  import logo from './assets/logo.svg'
  import {COLOR} from './ChakraTheme.js';
  import React,{useState} from 'react';

  const menuItem = (objectID, type, attribute, set) => {
    return <HStack>
      <Input type="text" name={'song'+type} placeholder={attribute}
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
                    <PopoverHeader>{"Edit "+song.name}</PopoverHeader>
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
                                >
                                    Save
                                </Button>
                            </ButtonGroup>
                        </VStack>
                    </FocusLock>
                </PopoverContent>
}
const EditSongPopUp = (props) => {
    const { onOpen, onClose, isOpen } = useDisclosure()
    return (<Popover placement='left'
                onClose={onClose}
            >
                <PopoverTrigger><Text>•••</Text></PopoverTrigger>
                {editSongInfo(props.song, props.setTitle, props.setArtist, props.setAlbum, props.onSubmit, onClose) }
            </Popover>);
}
export default EditSongPopUp
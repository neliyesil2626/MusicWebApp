
import Pages from './PageEnums.js';
import logo from './assets/logo.svg';
import {COLOR} from './ChakraTheme.js';
import React,{useState, useEffect} from 'react';
import { Text, VStack, Center , Image, Flex, Box} from '@chakra-ui/react'
/*
 * 
 */
const playlistButton = (playlist, i, setPlaylist, setPage) => {
    // <Box
    //                 position='fixed'
    //                 ml='calc(10rem - 50px)'
    //                 align='flex-end'
    //                 bgImage={'linear-gradient(to right, transparent,var(--chakra-colors-gray-800))'}
    //                 w='50px'
    //                 h='2rem'
    //             ></Box>
    return <Flex
                h='1.5rem'
                key={'playlist'+i}
            >
                
                <Text  
                        w='10rem'
                        h='fit-content'
                        overflow='hidden'
                        whiteSpace='nowrap'
                        textOverflow='clip'
                        position='fixed'
                        color={COLOR.secondaryFont}
                        bgRepeat='repeat-y'
                        pl='1em'
                        borderRadius='5px'
                        _hover={{ pr:'20px',w:'fit-content', cursor: 'pointer', color: COLOR.tertiaryFont, overflow:'visible', bg:COLOR.bg2}}
                        onClick={()=>{
                            setPlaylist(playlist)
                            setPage(Pages.Playlist)
                        }}
                >
                    {playlist.name}
                </Text>
                
            </Flex>
}
const SideMenu = (props) => {
    let addSongButton = <Text onClick={() => {props.setPage(Pages.AddSong)}} className='menuitem' _hover={{ cursor: 'pointer', color: COLOR.secondaryFont}}>o Add Song</Text>
    let createPlaylistButton = <Text onClick={() => {props.setPage(Pages.CreatePlaylist)}} className='menuitem' _hover={{ cursor: 'pointer', color: COLOR.secondaryFont}}>+ Create Playlist</Text>
    let libraryButton = <Text onClick={() => {props.setPage(Pages.Library)}} className='menuitem' _hover={{ cursor: 'pointer', color: COLOR.secondaryFont}}>= Library</Text> 
    
    let playlists = (props.playlists !== undefined) ? props.playlists.map((playlist, i)=>{
        return playlistButton(playlist, i, props.setPlaylist, props.setPage)
    }) : <Text>hi</Text>
    
    return <VStack id="sidemenu"
                    w="16rem"
                    minHeight="99vh"
                    pt='15px'
                    bg={COLOR.bg2}
                    fontSize='1.3em'
            >
            <Image src={logo} alt="logo" width='104px' align='center'/>
            <VStack alignItems={'fex-start'}>
            {addSongButton}
            {createPlaylistButton}
            {libraryButton}
            {playlists}
            </VStack>
        </VStack>
}
export default SideMenu
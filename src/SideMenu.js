
import Pages from './PageEnums.js';
import logo from './assets/logo512.png';
import {COLOR} from './ChakraTheme.js';
import React,{useState, useEffect} from 'react';
import { Text, VStack, Center , Image} from '@chakra-ui/react'
/*
 * 
 */
const playlistButton = (playlist, i, setPlaylist, setPage) => {
    return <Text key={'playlist'+i} 
                color={COLOR.secondaryFont}
                pl='1em'
                onClick={()=>{
                    setPlaylist(playlist)
                    setPage(Pages.Playlist)
                }}
            >
                {playlist.name}
           </Text>
}
const SideMenu = (props) => {
    let addSongButton = <Text onClick={() => {props.setPage(Pages.AddSong)}} className='menuitem' _hover={{ cursor: 'pointer', color: COLOR.secondaryFont}}>o Add Song</Text>
    let createPlaylistButton = <Text onClick={() => {props.setPage(Pages.CreatePlaylist)}} className='menuitem' _hover={{ cursor: 'pointer', color: COLOR.secondaryFont}}>+ Create Playlist</Text>
    let libraryButton = <Text onClick={() => {props.setPage(Pages.Library)}} className='menuitem' _hover={{ cursor: 'pointer', color: COLOR.secondaryFont}}>= Library</Text> 
    console.log("playlists = ")
    console.log(props.playlists)
    let playlists = (props.playlists !== undefined) ? props.playlists.map((playlist, i)=>{
        console.log("playlistname = "+playlist.name)
        return playlistButton(playlist, i, props.setPlaylist, props.setPage)
    }) : <Text>hi</Text>
    console.log(playlists)
    return <VStack id="sidemenu"
                    w="255px"
                    minHeight="97vh"
                    p='15px'
                    bg={COLOR.bg2}
                    fontSize='1.3em'
            >
            <Image src='https://cdn.discordapp.com/attachments/585162703967092736/1090718797763182633/o_o.png' alt="logo" width='104px' align='center'/>
            <VStack alignItems={'fex-start'}>
            {addSongButton}
            {createPlaylistButton}
            {libraryButton}
            {playlists}
            </VStack>
        </VStack>
}
export default SideMenu
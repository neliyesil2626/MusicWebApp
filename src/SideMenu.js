
import Pages from './PageEnums.js';
import logo from './assets/logo512.png';
import React,{useState, useEffect} from 'react';

/*
 * 
 */
const SideMenu = (props) => {
    let addSongButton = <p onClick={() => {props.setPage(Pages.AddSong)}}>o Add Song</p>
    let createPlaylistButton = <p onClick={() => {props.setPage(Pages.CreatePlaylist)}}>+ Create Playlist</p>
    let libraryButton = <p onClick={() => {props.setPage(Pages.Library)}}>= Library</p> 

    return <div id="sidemenu">
        <center><img src='https://cdn.discordapp.com/attachments/585162703967092736/1090718797763182633/o_o.png' alt="logo" style={{width: 104}}/></center>
        {addSongButton}
        {createPlaylistButton}
        {libraryButton}
    </div>
}
export default SideMenu
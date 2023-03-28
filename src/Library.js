
import React,{useState,useEffect} from 'react';
  //using tempProps to prevent App.js:111 Uncaught TypeError: Cannot add property onClick, object is not extensible
  const Library = (props) => {
    let tableHeaders = []
    let tableBody = []
      tableHeaders = <tr>
                         <td key="hnumber">#</td>
                         <td key="hname">title</td>
                         <td key="hartist">artist</td>
                         <td key="halbum">album</td>
                     </tr>; //header elements
      tableBody = props.songs.map((song, i) => <tr key={song.objectID} id={song.objectID} onClick={() => { props.setIndex(i)}}>
                                                 <td key={"number"} className="number">{i+1}</td>
                                                 <td key={"name"} className="name">{song.name}</td>
                                                 <td key={"artist"} className="artist">{song.artist}</td> 
                                                 <td key={"album"} className="album">{song.album}</td>
                                               </tr>);
    return (<div>
              <h1>Library</h1>
              <table className="songlist">
                <thead id="listheaders">
                  {tableHeaders}
                </thead>
                <tbody id="songlist">
                 {tableBody}
                </tbody>
              </table>
            </div>);
  }

  export default Library
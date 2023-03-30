import { Text,
    Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Heading,
 } from '@chakra-ui/react'
 import {COLOR} from './ChakraTheme.js';
import React,{useState,useEffect} from 'react';
  //using tempProps to prevent App.js:111 Uncaught TypeError: Cannot add property onClick, object is not extensible
  const Library = (props) => {
    let tableHeaders = []
    let tableBody = []
      tableHeaders = <Tr color={COLOR.secondaryFont} borderBottom='1px' borderColor={COLOR.secondaryFont} >
                         <Td key="hnumber">#</Td>
                         <Td key="hname">title</Td>
                         <Td key="hartist">artist</Td>
                         <Td key="halbum">album</Td>
                     </Tr>; //header elements
      tableBody = props.songs.map((song, i) => <Tr key={song.objectID} id={song.objectID} onClick={() => { props.setIndex(i)}} 
        borderBottom='none'
        _hover={{ bg: COLOR.bgHover }}
      >
                                                 <Td key={"number"} className="number" color={COLOR.secondaryFont} w='1em'>{i+1}</Td>
                                                 <Td key={"name"} className="name" paddingLeft='0' fontSize='1.2em'>{song.name}</Td>
                                                 <Td key={"artist"} className="artist">{song.artist}</Td> 
                                                 <Td key={"album"} className="album">{song.album}</Td>
                                               </Tr>);
    return (<div>
              <Heading m='20px'>Library</Heading>
              <Table className="songlist" 
                variant='unstyled'
                size='lg' 
                w='full'
                overflow='hidden'
                position='fixed'
                left='255px'
                p='0'
              >
                <Thead id="listheaders">
                  {tableHeaders}
                </Thead>
                <Tbody id="songlist">
                 {tableBody}
                </Tbody>
              </Table>
            </div>);
  }

  export default Library
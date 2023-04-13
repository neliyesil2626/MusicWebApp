import React,{useState} from 'react';
import { HStack, Box, Text, VStack, 
    Center, Image, Spacer, Flex, 
    Slider, SliderTrack, SliderFilledTrack, 
    SliderThumb, Icon, useSlider,
    Menu, MenuButton, MenuList, MenuGroup,
    Input, CloseButton, Button, Heading, Divider,

  } from '@chakra-ui/react'
import { COLOR } from './ChakraTheme';

const QueueMenu = (props) => {
    let queuedSongs = props.queue.map((songIndex, i) => {
        let song = props.songs[songIndex]
            return <HStack
                        key={'row'+i}
                        style={{opacity:'1'}}
                    >
            <Text w='10rem' whiteSpace='nowrap' overflow='hidden' textOverflow='clip'>{song.name} </Text>
            <Text w='10rem' whiteSpace='nowrap' overflow='hidden' textOverflow='clip'>{song.album}</Text>
            <CloseButton
                onClick={() => {
                    props.dequeue(i)
                }}
            ></CloseButton>
        </HStack>
    })

    let playerHeight = (document.getElementById("player") !== null) ? document.getElementById("player").offsetHeight : 0
    return <VStack
            position='absolute'
            right='0'
            bottom={'calc('+playerHeight+'px'+' - 10px)'}
            bg={COLOR.bg2}
            p='20px'
            style={{opacity:'0.8'}}
            alignItems='flex-start'
            w='26rem'
        >
            <Text
                fontSize='1.5rem'
                style={{opacity:'1'}}
            >Up Next</Text>
           <Divider
                borderColor={COLOR.secondaryFont}
            ></Divider>
            {queuedSongs}

        </VStack>
}
export default QueueMenu
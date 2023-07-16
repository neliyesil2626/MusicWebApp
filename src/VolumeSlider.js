import React from 'react';

import {Slider, SliderTrack, SliderFilledTrack, 
         SliderThumb
       } from '@chakra-ui/react'
import { COLOR } from './ChakraTheme';

export const VolumeSlider = (initVolume, updateVolume, volumeBar) => {
    return <Slider
        defaultValue={initVolume}
        onChange={(percent)=> {
        updateVolume(percent)
        }}
        id='volume-container' 
        bg='transparent'
        w={volumeBar+'rem'}
        h='20px' borderRadius='3px' size='lg'
        verticalAlign='center'
        _hover={{cursor: 'pointer'}}
        p='0'
        ml='5px'
    >
    
    <SliderTrack id='volume-track' bg={COLOR.bgHover} h='7px' borderRadius='full' >
      <SliderFilledTrack bg={COLOR.pink} h='7px'/>
    </SliderTrack>
    <SliderThumb 
      id='volume-thumb'
      dragable='true' 
      h='12px' w='12px' bg='transparent' 
      _hover={{bg:COLOR.pink}}
      _active={{bg:COLOR.pink, border:'0'}}
      _focus={{outline:'0 !important'}}
      
    />
  </Slider>
}
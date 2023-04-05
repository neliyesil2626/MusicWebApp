import { extendTheme } from '@chakra-ui/react'
import Montserrat from '@fontsource/montserrat'
import { color } from 'framer-motion'

export const COLOR = {
  pink: 'cat.100',
  pinkHover: 'cat.200',
  bg: 'gray.700',
  bg2: 'gray.800',
  bg3: 'gray.900',
  bgHover: 'gray.600',
  primaryFont: 'gray.50',
  secondaryFont: 'gray.500',
  tertiaryFont: 'gray.400',
  progressBar: 'progress.100',
}
export const theme = extendTheme({
  colors: {
    cat:{
      100: '#FB4C81',
      200: '#982D4D',
    },
    progress: {
      100: '#3A3E43'
    }
    
  },
  fonts: {
    heading: "'Montserrat', sans-serif",
    body: "'Montserrat', sans-serif",
  },
  styles: {
    global: (props) => ({
      body: {
        bg: COLOR.bg,
        color: COLOR.primaryFont,
      },
      '&::-webkit-scrollbar': {
        width: '8px',
        borderRadius: 'full',
        backgroundColor: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        borderRadius: '8px',
        backgroundColor: COLOR.bgHover,
      },
      text: {
        
      },
      button: {
        cursor: 'pointer',
      }, 
      img: {
        cursor: 'pointer',
      },
      tbody: {
      tr: {
        cursor: 'pointer',
      }},
      em: {
        cursor: 'pointer',
        color: COLOR.pink,
      },
    })
  },
    // components: {
  //   Text: {
  //     baseStyle: props => ({
  //       color: mode(
  //         colors.primaryFontColor.lightMode,
  //         colors.primaryFontColor.darkMode
  //       )(props),
  //     }),
  //   },
  // },
})
import { extendTheme } from '@chakra-ui/react'

export const COLOR = {
  pink: 'cat.100',
  pinkHover: 'cat.200',
  bg: 'gray.700',
  bg2: 'gray.800',
  bg3: 'gray.900',
  bgHover: 'gray.600',
  primaryFont: 'gray.50',
  secondaryFont: 'gray.500',
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
    heading: "'Space Mono', 'Space', 'monospace'",
    body: "'Space Mono', 'Space', 'monospace'",
  },
  styles: {
    global: (props) => ({
      body: {
        bg: COLOR.bg,
        color: COLOR.primaryFont,
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
import { Text, Heading, VStack, Image, Divider} from '@chakra-ui/react';
import { COLOR } from './ChakraTheme';
import logo from './assets/logo.svg'

const CreatePlaylistNotLoggedIn = (props) => {
    let sideMenuWidth = (document.getElementById("sidemenu") !== null) ? document.getElementById("sidemenu").offsetWidth : 0
    return <VStack 
        w={'calc(100vw - '+sideMenuWidth+'px - '+sideMenuWidth+'px)'}
        alignItems='center'
    >
        <Image src={logo} alt="logo" width='15rem' align='center'/>
        <Divider 
        top='9rem'
        left='0rem'
        w='100vw'
        position='absolute'
        borderColor={COLOR.secondaryFont}
        ></Divider>
        <Heading m='20px'>Create Playlist</Heading>
        <Text p='10px'>Log in to use this feature.</Text>
    </VStack>
}

export default CreatePlaylistNotLoggedIn
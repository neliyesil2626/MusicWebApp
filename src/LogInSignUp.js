
import React,{useState,useEffect} from 'react';
import { Text, Heading, Button, VStack, Input, Flex, Image, Divider, Box, HStack} from '@chakra-ui/react';
import { COLOR } from './ChakraTheme';
import { initializeApp } from "firebase/app";
import { getAuth, 
         createUserWithEmailAndPassword, 
         signInWithEmailAndPassword, 
         onAuthStateChanged, 
         signOut, 
         updateProfile
       } from "firebase/auth";
import logo from './assets/logo.svg'

const image = () => {
  return <Box><Image src={logo} alt="logo" width='15rem' align='center'/>
  <Divider 
    top='9.5rem'
    left='0rem'
    w='100vw'
    position='absolute'
    borderColor={COLOR.secondaryFont}
  ></Divider>
  </Box>
}
const signUpUser = (auth, username, email, password) => {
  console.log("logging in new user as:")
  console.log(username+"\n"+email+"\n"+password)
  createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const user = userCredential.user;
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}
const logInUser = (auth, email, password) => {
  console.log("logging in: "+email )
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log("user = ")
    console.log(user);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    if(errorCode === 'auth/invalid-email'){
      document.getElementById('validloginprompt').textContent = 'invalid email address'
    } else {
      document.getElementById('validloginprompt').textContent = 'invalid password'
    }
    
  });
}

const SignUp = (props) => {
    const [username, setUsername] = new useState("");
    const[email, setEmail] = new useState("");
    const [password, setPassword] = new useState("");
    const [createUser, setCreateUser] = new useState(false);
    
    onAuthStateChanged(props.auth, (user) => {
      if (createUser && typeof user != Promise) {
        updateProfile(props.auth.currentUser, {
          displayName: username
        }).then(() => {
          // Profile updated!
          console.log(user)
        }).catch((error) => {
          // An error occurred
          console.log("Error while Creating account: ")
          console.log(error)
          console.log("\n");
        });
        setCreateUser(false);
      }
    });
    // if(!(props.uid === undefined || props.uid == '')){
    //   signOut(auth).then(() => {
    //     props.setUid('')
    //     console.log("signed out")
    //   }).catch((error) => {
    //     console.log(error)
    //   });
    // } 
  
    let button =<Button id="signup" onClick={() => {
      signUpUser(props.auth, username, email, password)
      setCreateUser(true);
    }}
      bg={COLOR.pink}
      _hover={{ bg: COLOR.pinkHover }}
      className='textform'
    >Sign Up</Button>
    let logInPrompt = <p>Have an account?<em id="switchToLogIn" onClick={() => {props.setSignUp(false)}}> Log in </em></p>
  
    return <VStack className="logincomponent">
      {image()}
    <Heading m='20px' pb='20px' >Sign Up</Heading>
      <Input 
        type="text" 
        name="logInUserName" 
        placeholder="Username" 
        onChange={event => setUsername(event.target.value)} 
        borderColor={COLOR.secondaryFont} 
        w='24rem'
        className='textform'
      ></Input>
      <Input 
        type="text" 
        name="logInEmail" 
        placeholder="Email" 
        onChange={event => setEmail(event.target.value)} 
        borderColor={COLOR.secondaryFont} 
        w='24rem'
        className='textform'
      ></Input>
      <Input 
        type="text" 
        name="logInPassword" 
        placeholder="Password" 
        onChange={event => setPassword(event.target.value)} 
        borderColor={COLOR.secondaryFont} 
        w='24rem'
        className='textform'
      ></Input>
      <div><center>{button}</center>{logInPrompt}</div>
  </VStack>
  }
  // <VStack paddingLeft='calc(50vw - 12rem - 255px)'  >
  //     <Heading m='20px'>o Add Song</Heading>
  //     <Input type="text" name="songTitle" placeholder="Title" onChange={event => setTitle(event.target.value)} borderColor={COLOR.secondaryFont} w='24rem'></Input>
  //     <Input type="text" name="songArtist" placeholder="Artist" onChange={event => setArtist(event.target.value)} borderColor={COLOR.secondaryFont}></Input>
  //     <Input type="text" name="songAlbum" placeholder="Album" onChange={event => setAlbum(event.target.value)} borderColor={COLOR.secondaryFont}></Input>
  //     <Input id="upload" type="file" accept=".mp3" placeholder="Upload File" onChange={event => onUpload(event.target.value)} border='none'></Input>
  //     <div><Center><Button onClick={onSubmit} bg={COLOR.pink} _hover={{ bg: COLOR.pinkHover }}>addSong</Button></Center><Text id="validupdateprompt">{validUploadPrompt}</Text></div>
  //   </VStack>

  /*
 * Log in component allows a user to login and sign out
 */

const Login = (props) => {
    const[email, setEmail] = new useState("");
    const [password, setPassword] = new useState("");
    let loginOnClick = () => {logInUser(props.auth, email, password)}
    let signoutOnClick = () => {
      signOut(props.auth).then(() => {
        props.setUid('')
        console.log("signed out")
      }).catch((error) => {
        console.log(error)
      });
    }
    onAuthStateChanged(props.auth, (user) => {
      if (user) {
        const uid = user.uid
        const username = props.auth.currentUser.displayName
        console.log("authentication changed to: "+props.auth.currentUser.displayName)
        console.log("uid = "+uid)
        props.setUid(uid)
        props.setUsername(username)
      } else {
        // User is signed out
      }
    });

    // if there is no user logged in
    if(props.uid === undefined || props.uid == ''){
      let button = <Button id="submitloginbutton" onClick={loginOnClick}
      bg={COLOR.pink}
      _hover={{ bg: COLOR.pinkHover }}
      className='textform'
    >Log in</Button> 
      let signUpPrompt = <p>No account? <em id="switchToSignUp" onClick={() => {props.setSignUp(true)}}>Sign up</em></p>
      return <VStack className="logincomponent">
        {image()}
        <Heading m='20px'pb='20px'>Login</Heading>
          <div><Input 
                type="text" 
                name="logInEmail" 
                placeholder="Email" 
                onChange={event => setEmail(event.target.value)} 
                borderColor={COLOR.secondaryFont} 
                w='24rem'
                className='textform'
              ></Input></div>
          <div><Input 
                  type="text" 
                  name="logInPassword" 
                  placeholder="Password" 
                  onChange={event => setPassword(event.target.value)} 
                  borderColor={COLOR.secondaryFont} 
                  w='24rem'
                  className='textform'
                ></Input></div>
          <VStack id="loginsignout">
            <HStack alignItems='center'>
              <Text id='validloginprompt' 
                position='fixed' 
                color={COLOR.pink}
                pl='6rem'
              />
              {button}
            </HStack>
            {signUpPrompt}
            
          </VStack>
      </VStack>
    } 

    // the user is logged in:
    else {
      let button = <Button id="signout" onClick={signoutOnClick}
        bg={COLOR.pink}
        _hover={{ bg: COLOR.pinkHover }}
      >Sign Out</Button>
      return <VStack className="logincomponent" w='24rem'>
        {image()}
        <Heading m='20px'pb='20px'>Login</Heading>
          <Text pb='10px'>You are already Logged in.</Text>
          <div id="loginsignout"><center>{button}</center></div>
      </VStack>
    }
  }
  
  const LogInSignUp = (props) => {
    const [signUp, setSignUp] = new useState(false);
    let sideMenuWidth = (document.getElementById("sidemenu") !== null) ? document.getElementById("sidemenu").offsetWidth : 0
    if(signUp){
        return <VStack 
              w={'calc(100vw - '+sideMenuWidth+'px - '+sideMenuWidth+'px)'}
              alignItems='center'
            >
          <SignUp 
            auth={props.auth}
            uid={props.uid} 
            setUid={props.setUid} 
            userName={props.userName} 
            setUsername={props.setUsername}
            setSignUp={setSignUp}>
          </SignUp>
        </VStack>
    } else {
        return <VStack 
            w={'calc(100vw - '+sideMenuWidth+'px - '+sideMenuWidth+'px)'}
            alignItems='center'
          >
          <Login 
            auth={props.auth}
            uid={props.uid} 
            setUid={props.setUid} 
            userName={props.userName} 
            setUsername={props.setUsername}
            setSignUp={setSignUp}>
          </Login>
        </VStack>
    }
  }
  export default LogInSignUp
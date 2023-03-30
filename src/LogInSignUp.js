
import React,{useState,useEffect} from 'react';
import { Text, Center, Heading, Button, VStack, Input, Flex} from '@chakra-ui/react';
import { COLOR } from './ChakraTheme';
import { initializeApp } from "firebase/app";
import { getAuth, 
         createUserWithEmailAndPassword, 
         signInWithEmailAndPassword, 
         onAuthStateChanged, 
         signOut, 
         updateProfile
       } from "firebase/auth";
       
const firebaseConfig = {
    apiKey: "AIzaSyCGhNG4Q4n49smsKIa_zjkzIr0SwSSMDG0",
    authDomain: "webmusicplayer-seniorproject.firebaseapp.com",
    projectId: "webmusicplayer-seniorproject",
    storageBucket: "webmusicplayer-seniorproject.appspot.com",
    messagingSenderId: "607390814407",
    appId: "1:607390814407:web:2a174fc1a386f9f251aee2"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const signUpUser = (username, email, password) => {
    console.log("logging in new user as:")
    console.log(username+"\n"+email+"\n"+password)
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }
  const logInUser = (email, password) => {
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
    });
  }

const SignUp = (props) => {
    const [username, setUsername] = new useState("");
    const[email, setEmail] = new useState("");
    const [password, setPassword] = new useState("");
    const [createUser, setCreateUser] = new useState(false);
    
    onAuthStateChanged(auth, (user) => {
      if (createUser && typeof user != Promise) {
        updateProfile(auth.currentUser, {
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
      signUpUser(username, email, password)
      setCreateUser(true);
    }}
      bg={COLOR.pink}
      _hover={{ bg: COLOR.pinkHover }}
    >Sign Up</Button>
    let logInPrompt = <p>Have an account?<em id="switchToLogIn" onClick={() => {props.setSignUp(false)}}> Log in </em></p>
  
    return <VStack className="logincomponent">
    <Heading m='20px'>Sign Up</Heading>
      <Input type="text" name="logInUserName" placeholder="Username" onChange={event => setUsername(event.target.value)} borderColor={COLOR.secondaryFont} w='24rem'></Input>
      <Input type="text" name="logInEmail" placeholder="Email" onChange={event => setEmail(event.target.value)} borderColor={COLOR.secondaryFont} w='24rem'></Input>
      <Input type="text" name="logInPassword" placeholder="Password" onChange={event => setPassword(event.target.value)} borderColor={COLOR.secondaryFont} w='24rem'></Input>
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
    let loginOnClick = () => {logInUser(email, password)}
    let signoutOnClick = () => {
      signOut(auth).then(() => {
        props.setUid('')
        console.log("signed out")
      }).catch((error) => {
        console.log(error)
      });
    }
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid
        const username = auth.currentUser.displayName
        console.log("authentication changed to: "+auth.currentUser.displayName)
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
    >Log in</Button> 
      let signUpPrompt = <p>No account? <em id="switchToSignUp" onClick={() => {props.setSignUp(true)}}>Sign up</em></p>
      return <VStack className="logincomponent">
        <Heading m='20px'>Login</Heading>
          <div><Input type="text" name="logInEmail" placeholder="Email" onChange={event => setEmail(event.target.value)} borderColor={COLOR.secondaryFont} w='24rem'></Input></div>
          <div><Input type="text" name="logInPassword" placeholder="Password" onChange={event => setPassword(event.target.value)} borderColor={COLOR.secondaryFont} w='24rem'></Input></div>
          <div id="loginsignout"><center>{button}</center>{signUpPrompt}</div>
      </VStack>
    } 

    // the user is logged in:
    else {
      let button = <Button id="signout" onClick={signoutOnClick}
        bg={COLOR.pink}
        _hover={{ bg: COLOR.pinkHover }}
      >Sign Out</Button>
      return <VStack className="logincomponent" w='24rem'>
        <Heading m='20px'>Login</Heading>
          <Text>You are already Logged in.</Text>
          <div id="loginsignout"><center>{button}</center></div>
      </VStack>
    }
  }
  
  const LogInSignUp = (props) => {
    const [signUp, setSignUp] = new useState(false);
    if(signUp){
        return <Flex paddingLeft='calc(50vw - 12rem - 255px)'><SignUp 
        uid={props.uid} 
        setUid={props.setUid} 
        userName={props.userName} 
        setUsername={props.setUsername}
        setSignUp={setSignUp}>
        </SignUp></Flex>
    } else {
        return <Flex paddingLeft='calc(50vw - 12rem - 255px)'><Login 
        uid={props.uid} 
        setUid={props.setUid} 
        userName={props.userName} 
        setUsername={props.setUsername}
        setSignUp={setSignUp}>
        </Login></Flex>
    }
  }
  export default LogInSignUp

import React,{useState,useEffect} from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, 
         createUserWithEmailAndPassword, 
         signInWithEmailAndPassword, 
         onAuthStateChanged, 
         EmailAuthProvider, 
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
  
    let button =<button id="signup" onClick={() => {
      signUpUser(username, email, password)
      setCreateUser(true);
    }}>Sign Up</button>
    let logInPrompt = <p>Have an account?<em id="switchToLogIn" onClick={() => {props.setSignUp(false)}}> Log in </em></p>
  
    return <div className="logincomponent">
    <h1>Sign Up</h1>
      <div><input type="text" name="logInUserName" placeholder="Username" onChange={event => setUsername(event.target.value)}></input></div>
      <div><input type="text" name="logInEmail" placeholder="Email" onChange={event => setEmail(event.target.value)}></input></div>
      <div><input type="text" name="logInPassword" placeholder="Password" onChange={event => setPassword(event.target.value)}></input></div>
      <div><center>{button}</center>{logInPrompt}</div>
  </div>
  }

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
      let button = <button id="submitloginbutton" onClick={loginOnClick}>Log in</button> 
      let signUpPrompt = <p>No account? <em id="switchToSignUp" onClick={() => {props.setSignUp(true)}}>Sign up</em></p>
      return <div className="logincomponent">
        <h1>Login</h1>
          <div><input type="text" name="logInEmail" placeholder="Email" onChange={event => setEmail(event.target.value)}></input></div>
          <div><input type="text" name="logInPassword" placeholder="Password" onChange={event => setPassword(event.target.value)}></input></div>
          <div id="loginsignout"><center>{button}</center>{signUpPrompt}</div>
      </div>
    } 

    // the user is logged in:
    else {
      let button = <button id="signout" onClick={signoutOnClick}>Sign Out</button>
      return <div className="logincomponent">
        <h1>Login</h1>
          <p>You are already Logged in.</p>
          <div id="loginsignout"><center>{button}</center></div>
      </div>
    }
  }
  
  const LogInSignUp = (props) => {
    const [signUp, setSignUp] = new useState(false);
    if(signUp){
        return <SignUp 
        uid={props.uid} 
        setUid={props.setUid} 
        userName={props.userName} 
        setUsername={props.setUsername}
        setSignUp={setSignUp}>
        </SignUp>
    } else {
        return <Login 
        uid={props.uid} 
        setUid={props.setUid} 
        userName={props.userName} 
        setUsername={props.setUsername}
        setSignUp={setSignUp}>
        </Login>
    }
  }
  export default LogInSignUp
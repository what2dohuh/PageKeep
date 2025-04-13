  import React from 'react';
  import {
    createUserWithEmailAndPassword,
  } from "firebase/auth";
  import { useState } from "react";
  import {auth,db}from '../config/config_fire'
  import '../style/signup.css' 
  import { Link, useNavigate} from 'react-router-dom'
  import {  setDoc,doc } from "firebase/firestore"; 

const Signup = () => {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpass, setConfirmPass] = useState("");
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const nav = useNavigate();


    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        if(confirmpass!=password){
            setError(true);
            setErrorMessage("Passwords do not match.");
            return;
        }
    
         await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )
        const docRef = await setDoc(doc(db, "users",auth.currentUser.uid), {
          name:name,
          email: email,
          number: number,
        });
        console.log(docRef)
  
        nav('/')
      } catch (err) {

        const errorMessage = err.message;
        const errorCode = err.code;
  
        setError(true);
  
        switch (errorCode) {
          case "auth/weak-password":
            setErrorMessage("The password is too weak.");
            break;
          case "auth/email-already-in-use":
            setErrorMessage("This email address is already in use by another account.");
            break;
          case "auth/invalid-email":
            setErrorMessage("This email address is invalid.");
            break;
          case "auth/operation-not-allowed":
            setErrorMessage("Email/password accounts are not enabled.");
            break;
          default:
            setErrorMessage(errorMessage);
            break;
        }
      }
    };
  
    return (
        <div className='studentsignup'>
        <h2>Signup As </h2> 
        <div className="containersignup">
        <div className="imgs">
            <img src='/src/assets/student.gif'/>
        </div>
            <div className="signupbox">
        <form onSubmit={handleSubmit}>
            <label>Gmail</label>
            <input type="email" placeholder="Enter your Gmail" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <label>Name</label>
            <input type="name" placeholder="Enter your name" value={name} onChange={(e)=>setName(e.target.value)}/>
            <label>Password</label>
            <input type="password" placeholder="Enter your password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <label>Confirm password</label>
            <input type="password" placeholder="Confirm your password" value={confirmpass} onChange={(e)=>setConfirmPass(e.target.value)}/>
            <label>Phone number</label>
            <input type="number" placeholder="Enter your phone number"value={number} onChange={(e)=>setNumber(e.target.value)}/>
            
            <button type="submit"> Join us</button>
            <p>Have a account already? <Link to="/login/student"> Login as student</Link></p>
            {error && <p>{errorMessage}</p>}
        </form>
            </div>
        
        </div>
    </div>
    );
  
}

export default Signup;


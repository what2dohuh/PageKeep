import { useState } from 'react';
import "../style/login.css";
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../config/config_fire';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

const Login = () => {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!gmail || !password) {
      setError(true);
      setErrorMessage("All fields are required.");
      toast("All fields are required."); // Trigger toast
      return;
    }

    try {
      const user = await signInWithEmailAndPassword(auth, gmail, password);
      if (user) {
        nav("/home");
      }
    } catch (err) {
      const errMessage = err.message;
      const errCode = err.code;
      setError(true);

      switch (errCode) {
        case "auth/invalid-credential":
          setErrorMessage("The password or email is invalid.");
          break; 
   
        case "auth/invalid-email":
          setErrorMessage("This email address is invalid.");
          break;
        case "auth/operation-not-allowed":
          setErrorMessage("Email/password accounts are not enabled.");
          break;
        case "auth/too-many-requests":
          setErrorMessage("Too many failed attempts try later.");
          break;
        default:
          setErrorMessage(errMessage);
          break;
      }

      toast(errorMessage); // Trigger toast with error message
    }
  };

  return (
    <>
      <div className='login'>
        <h2>Login</h2>
        <div className="containerr">
          <div className="box1">
            <div className="box2">
              <img src='/src/assets/student.gif' alt="Student GIF" />
              <p>Give lessons or manage bookings with your customers</p>
            </div>
            <div className="line"></div>
            <div className="box2">
              <h3>Welcome Back!!!</h3>
              <form onSubmit={handleSubmit}>
                <label>Gmail</label>
                <input 
                  type="text" 
                  placeholder="ect@gmail.com" 
                  value={gmail} 
                  onChange={(e) => setGmail(e.target.value)} 
                />
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <button type="submit">Login</button>
              </form>
              <div className='forgot'>
                <Link to="/forgot">Forgot Password?</Link>
              </div>
            </div>
          </div>
        </div>
        <p className='para'>Don't have an account?</p>
        <div className="btncre">
          <Link to='/signup'>
            <button>Create account</button>
          </Link>
        </div>
      </div>
      <ToastContainer /> {/* Toast Container should be placed here */}
    </>
  );
};

export default Login;

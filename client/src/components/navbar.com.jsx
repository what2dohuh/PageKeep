import  { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import '../style/sidebar.css'
import {auth} from "../config/config_fire.js"
import { useUser } from '../contexAPI/userContex.jsx';
const NavbarCom = () => {
    const { user } = useUser();
    const nav = useNavigate();
    const [openLinks, setopenLinks] = useState(false);
    const toggole=()=>{
        setopenLinks(!openLinks)
    }

    const handlelogout =async()=>{
        if( user == null) return;
        try {
            await auth.signOut();
            nav('/')
        } catch (error) {
            console.error(error)
        }
      }
    return (
        <div className='navbar'>
        <div className='left' id={openLinks ? "open":"close"}>
            <Link to='/'><h2>StudyChain</h2></Link>

        <div className='hiddenLinks'>
        <div className=" bold">
        <Link to='/'>Home</Link>
        </div>
        <div className=" bold">
        </div>
            <Link to="/studentblog"> {user ? "StudentBlog ": ""}</Link>
            <Link to={`/${user ? "": "login"}`}> <div  className="btnn">{user ? "Logout ": "login"} </div></Link>
        </div>

        </div>
        <div className='right'>
        <div className=" bold">
        <Link to='/'>Home</Link>
        </div>

        <div className=" bold">
        </div>
        <Link to="/studentblog"> {user ? "StudentBlog ": ""}</Link>
            <Link to={`/${user ? "": "login"}`}> <div  className="btnn" onClick={handlelogout}>{user ? "Logout ": "login"} </div></Link>

        <button className="on"onClick={toggole}>
            <i className="fa fa-bars"></i>  
        </button >
        </div>
    </div>
    );
}

export default NavbarCom;

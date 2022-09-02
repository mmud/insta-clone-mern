import React,{useRef} from 'react'
import "./header.css"
import { NavLink,useNavigate,Link } from "react-router-dom";
import shlogo from "../images/sh.png"
import avatar from "../images/avatar.png"


export default function Header() {
  const Navigate = useNavigate();

  const sidenav = useRef(null)
  const dropdown = useRef(null)

  const logout=()=>{
    localStorage.setItem("token",null);
    Navigate("/", {replace: true})
    window.location.reload();
  }

  function parseJwt (token) {
    if(token==="null")
      return null
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
    };

  return (
    <>
      <header>
        <div className='container'>
          <div className="head_container">
          <NavLink to="/" className="logo">
            <img src={shlogo} alt="logo"/>
          </NavLink>
          <div className="search-box">
          <input className="search-input" type="text" placeholder="Search something.."/>
          <button className="search-btn"><i className="fas fa-search"></i></button>
          </div>
          <div className="menu" id="myTopnav">
            <ul style={{"display":"flex","alignItems":"center","position":"relative"}}>
              <div className='icon' onClick={()=>sidenav.current.style.width="250px"}>&#9776;</div>
              <li><NavLink to="/"><i className="fa-solid fa-house"></i></NavLink></li>
              <li><NavLink to="/messages"><i className="fa-solid fa-comment"></i></NavLink></li>
              <li><Link to="#"><i className="fa-solid fa-bell"></i></Link></li>
              <div className='avatardiv' style={{"position":"relative"}}>
                <img src={avatar} alt="avatar" className='avatar' onClick={()=>dropdown.current.classList.toggle("active")}/>
                <div className='dropdown' ref={dropdown}>
                  {localStorage.getItem("token")!=="null"?<NavLink to="/profile"> profile </NavLink>:""}
                  {parseJwt(localStorage.getItem("token"))?.role==="admin"?<NavLink to="/admin"> admin </NavLink>:""}
                  {localStorage.getItem("token")==="null"?<NavLink to="/register"> register </NavLink>:""}
                  {localStorage.getItem("token")==="null"?<NavLink to="/login"> login </NavLink>:""}
                  {localStorage.getItem("token")!=="null"?<span onClick={logout}> logout </span>:""}
                </div>
              </div>
            </ul>
          </div>
        </div>
        </div>
      </header>
      
   

      <div id="mySidenav" class="sidenav" ref={sidenav}>
        <div className='icon x' onClick={()=>sidenav.current.style.width="0"}>&times;</div>
          <li><NavLink to="/"><i className="fa-solid fa-house"></i> Home</NavLink></li>
          <li><NavLink to="/messages"><i className="fa-solid fa-comment"></i> Messages</NavLink></li>
          <li><Link to="#"><i className="fa-solid fa-bell"></i> Notification</Link></li>
		  </div>
    </>
  )
}

/**
 * <div className='container'>
            <NavLink to="/" className="logo"> Auth </NavLink>
            <nav>
                {localStorage.getItem("token")!=="null"?<NavLink to="/profile"> profile </NavLink>:""}
                {parseJwt(localStorage.getItem("token"))?.role==="admin"?<NavLink to="/admin"> admin </NavLink>:""}
                {localStorage.getItem("token")==="null"?<NavLink to="/register"> register </NavLink>:""}
                {localStorage.getItem("token")==="null"?<NavLink to="/login"> login </NavLink>:""}
                {localStorage.getItem("token")!=="null"?<span onClick={logout}> logout </span>:""}
            </nav>
        </div>
 * 
 * 
 * 
 */
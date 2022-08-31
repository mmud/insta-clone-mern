import React from 'react'
import "./header.css"
import { NavLink,useNavigate } from "react-router-dom";


export default function Header() {
  const Navigate = useNavigate();
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
    <header>
        <div className='container'>
            <NavLink to="/" className="logo"> Auth </NavLink>
            <nav>
                {localStorage.getItem("token")!=="null"?<NavLink to="/profile"> profile </NavLink>:""}
                {parseJwt(localStorage.getItem("token"))?.role==="admin"?<NavLink to="/admin"> admin </NavLink>:""}
                {localStorage.getItem("token")==="null"?<NavLink to="/register"> register </NavLink>:""}
                {localStorage.getItem("token")==="null"?<NavLink to="/login"> login </NavLink>:""}
                {localStorage.getItem("token")!=="null"?<span onClick={logout}> logout </span>:""}
            </nav>
        </div>
    </header>
  )
}
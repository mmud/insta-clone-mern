import React, { useRef } from 'react'
import "./post.css"
import { Link } from "react-router-dom";
import moment from 'moment/moment';

export default function Post(props) {
    const dropdown = useRef(null)
    function parseJwt (token) {
        if(token==="null" ||token===null ||token===undefined)
          return null
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
        };

  return (
    <div className="post">
        <div className='postheader'>
            <Link to={`/user/${props.postdata.user._id}`} className="name">
                <img src={props.postdata.user.avatar} alt="useravatar" className='avatar'/>
            </Link>
            <div>
            <Link to={`/user/${props.postdata.user._id}`} className="name">
                {props.postdata.user.UserName} 
            </Link>
            <div className='date'>
                {moment(props.postdata.createdAt).fromNow()}
            </div>
            </div>
        </div>

        <i className="fa-solid fa-ellipsis" onClick={()=>dropdown.current.classList.toggle("active")}></i>
        {props.postdata.user._id ===  parseJwt(localStorage.getItem("token")).id?
        <div className='togglemenu' ref={dropdown}>
            <div className='option'><i className="fa-solid fa-pen"></i> Edit Post</div>
            <div className='option'><i className="fa-solid fa-trash"></i> Delete Post</div>
        </div>
        :""
        }
    </div>
  )
}

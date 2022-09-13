import React, { useEffect, useRef, useState } from 'react'
import "./comment.css"
import { Link } from "react-router-dom";
import moment from 'moment/moment';

export default function Comment({post,comment}) {
    const [Content, setContent] = useState(null);
    const [readmore, setreadmore] = useState(false)
    const dropdown = useRef(null)

    useEffect(() => {
      
        setContent(comment.Content);
     
    }, [comment])
    
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
    <div className='comment'>
        <Link to={`/user/${comment.user._id}`} className="userstatus">
            <img src={comment.user.avatar} alt="commentavatar" className='avatar'/>
            <h6>{comment.user.UserName}</h6>
        </Link>

        <div className='commentcontent'>
        {
                Content?.length<60?
                Content:readmore? Content + ' ':Content?.slice(0,60)+' ...'
                }
                    {
                        Content?.length>60?
                        <span className='readmore' onClick={()=>setreadmore(!readmore)}>
                            {readmore?'Hide content' : 'Read more'}
                        </span> :""
                    }
        </div>
        <div className='commentstatus'>
            <small>
                {moment(comment.creatAt).fromNow()}
            </small>

            <small style={{"fontWeight":"bold","cursor":"pointer"}}>
                {comment.likes.length} Likes
            </small>

            <small style={{"fontWeight":"bold","cursor":"pointer"}}>
                reply
            </small>
        </div>



        {post.user._id ===  parseJwt(localStorage.getItem("token")).id && comment.user._id ===  parseJwt(localStorage.getItem("token")).id?
        <>
        <i className="fa-solid fa-ellipsis" onClick={()=>dropdown.current.classList.toggle("active")}></i>
        <div className='togglemenu' ref={dropdown}>
            <div className='option'><i className="fa-solid fa-pen"></i> Edit Comment</div>
            <div className='option'><i className="fa-solid fa-trash"></i> Delete Comment</div>
        </div>
        </>
        :post.user._id ===  parseJwt(localStorage.getItem("token")).id && comment.user._id !==  parseJwt(localStorage.getItem("token")).id?
        <>
        <i className="fa-solid fa-ellipsis" onClick={()=>dropdown.current.classList.toggle("active")}></i>
        <div className='togglemenu' ref={dropdown}>
            <div className='option'><i className="fa-solid fa-trash"></i> Delete Comment</div>
        </div>
        </>
        :post.user._id !==  parseJwt(localStorage.getItem("token")).id && comment.user._id ==  parseJwt(localStorage.getItem("token")).id?
        <>
        <i className="fa-solid fa-ellipsis" onClick={()=>dropdown.current.classList.toggle("active")}></i>
        <div className='togglemenu' ref={dropdown}>
            <div className='option'><i className="fa-solid fa-pen"></i> Edit Comment</div>
            <div className='option'><i className="fa-solid fa-trash"></i> Delete Comment</div>
        </div></>:""
    }
    </div>
  )
}

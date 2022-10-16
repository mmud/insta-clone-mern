import React, { useEffect, useRef, useState } from 'react'
import "./comment.css"
import { Link } from "react-router-dom";
import moment from 'moment/moment';
import Swal from 'sweetalert2';
import  Axios  from 'axios';

export default function Comment({post,comment}) {
    const [Content, setContent] = useState(null);
    const [postContent, setpostContent] = useState(null);
    const [readmore, setreadmore] = useState(false);
    const [isliked, setisliked] = useState(false);
    const [loadlike, setloadlike] = useState(false);
    const [onedit, setonedit] = useState(false);
    const textcontentedit = useRef(null)
    const dropdown = useRef(null);

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
        const errormsg=(errormsg)=>{
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
              
              Toast.fire({
                icon: 'error',
                title: errormsg
              })
          }

    const opencommentedit=()=>{
        setonedit(true);
        setTimeout(() => {
            textcontentedit.current.value=Content;
        }, 10);
    }

    const handleeditcomment= async()=>{
        if(postContent ===Content)
        {
            setonedit(false);
            return
        }

        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };
        const bodyParameters = {
            Content:postContent,
            _id:comment._id
        };
      
        await Axios.post( 
        'http://localhost:3500/api/post/editcomment',
        //'/api/post/editcomment',
        bodyParameters,
        config
        ).then((response)=>{
          console.log(response);
          setonedit(false)
        }).catch(e=>{errormsg(e.response.data.msg);console.log(e)});
    }

    //like
    useEffect(() => {
      
        if(comment.likes.find(like=>like==parseJwt(localStorage.getItem("token")).id))
            setisliked(true);
        else
            setisliked(false);

    },[isliked,comment,comment.likes])
    

    const handlelike=async()=>{
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };
        const bodyParameters = {
        _id:comment._id,
        };
      
        await Axios.post( 
        'http://localhost:3500/api/post/likecomment',
        //'/api/post/likecomment',
        bodyParameters,
        config
        ).then((response)=>{}).catch(e=>console.log(e));

        setisliked(true);
        comment.likes.push(parseJwt(localStorage.getItem("token")).id);
    }
    const handleunlike= async()=>{
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };
        const bodyParameters = {
        _id:comment._id,
        };
      
        await Axios.post( 
        'http://localhost:3500/api/post/unlikecomment',
        //'/api/post/unlikecomment',
        bodyParameters,
        config
        ).then((response)=>{}).catch(e=>console.log(e));

        setisliked(false);
        comment.likes.pop();
    }

    //delete
    const [isdelete, setisdelete] = useState(false)
    const handledelete=async()=>{
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };
        const bodyParameters = {
        _id:comment._id,
        };
      
        await Axios.post( 
        'http://localhost:3500/api/post/deletecomment',
        //'/api/post/deletecomment',
        bodyParameters,
        config
        ).then((response)=>{setisdelete(true)}).catch(e=>console.log(e));
    }

  return (
    <div className={isdelete?"comment none":'comment'}>
        <Link to={`/user/${comment.user._id}`} className="userstatus">
            <img src={comment.user.avatar} alt="commentavatar" className='avatar'/>
            <h6>{comment.user.UserName}</h6>
        </Link>

        <div className='commentcontent'>
        {
        onedit?
            <textarea ref={textcontentedit} onChange={e=>setpostContent(e.target.value)} style={{"width":"100%","maxWidth":"100%"}}></textarea>
        :
        Content?.length<60?
        Content:readmore? Content + ' ':Content?.slice(0,60)+' ...'
        }
        {
            onedit?"":
            Content?.length>60?
            <span className='readmore' onClick={()=>setreadmore(!readmore)}>
                {readmore?'Hide content' : 'Read more'}
            </span> :""
        }
        </div>

        <div className='commentstatus'>
            {
                onedit?
                <>
                    <small style={{"fontWeight":"bold","cursor":"pointer"}} onClick={handleeditcomment}>
                        save
                    </small>

                    <small style={{"fontWeight":"bold","cursor":"pointer"}} onClick={()=>setonedit(false)}>
                        cancel
                    </small>
                </>
                :
                <>
                    <small>
                        {moment(comment.createdAt).fromNow()}
                    </small>

                    {
                    isliked?
                    <small style={{"fontWeight":"bold","cursor":"pointer","color":"#f48021"}} onClick={handleunlike}>
                        {comment.likes.length} Likes
                    </small>
                    :
                    <small style={{"fontWeight":"bold","cursor":"pointer"}} onClick={handlelike}>
                        {comment.likes.length} Likes
                    </small>
                    }

                </>
            }
        </div>

        {post.user._id ===  parseJwt(localStorage.getItem("token")).id && comment.user._id ===  parseJwt(localStorage.getItem("token")).id?
        <>
        <i className="fa-solid fa-ellipsis" onClick={()=>dropdown.current.classList.toggle("active")}></i>
        <div className='togglemenu' ref={dropdown}>
            <div className='option' onClick={opencommentedit}><i className="fa-solid fa-pen" ></i> Edit Comment</div>
            <div className='option' onClick={handledelete}><i className="fa-solid fa-trash"></i> Delete Comment</div>
        </div>
        </>
        :post.user._id ===  parseJwt(localStorage.getItem("token")).id && comment.user._id !==  parseJwt(localStorage.getItem("token")).id?
        <>
        <i className="fa-solid fa-ellipsis" onClick={()=>dropdown.current.classList.toggle("active")}></i>
        <div className='togglemenu' ref={dropdown}>
            <div className='option' onClick={handledelete}><i className="fa-solid fa-trash"></i> Delete Comment</div>
        </div>
        </>
        :post.user._id !==  parseJwt(localStorage.getItem("token")).id && comment.user._id ==  parseJwt(localStorage.getItem("token")).id?
        <>
        <i className="fa-solid fa-ellipsis" onClick={()=>dropdown.current.classList.toggle("active")}></i>
        <div className='togglemenu' ref={dropdown}>
            <div className='option' onClick={opencommentedit}><i className="fa-solid fa-pen"></i> Edit Comment</div>
            <div className='option' onClick={handledelete}><i className="fa-solid fa-trash"></i> Delete Comment</div>
        </div></>:""
    }
    </div>
  )
}

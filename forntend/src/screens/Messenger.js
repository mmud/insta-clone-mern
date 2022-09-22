import  Axios  from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router';
import MyMessage from '../components/MyMessage';
import UserSearchCard from '../components/UserSearchCard';
import YourMessage from '../components/YourMessage';
import "./messenger.css"
import socketIO  from "socket.io-client"

export default function Messenger() {

    const socket = socketIO.connect('http://localhost:3500');
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
    

    useEffect(() => {
        socket.emit('joinUser',parseJwt(localStorage.getItem("token")).id);
    }, [])
    


    const {id} = useParams();
    const [selecteduser, setselecteduser] = useState(null)
    const leftside = useRef(null)
    //search
    const [search, setsearch] = useState(null)
    const [issearch, setissearch] = useState(false);
    const [users, setusers] = useState(null); 
    useEffect(() => {
      if(issearch)
      {
        const ser = async()=>{
        await Axios.get( 
          `http://localhost:3500/api/user/searchbyname?UserName=${search}`,
        ).then((Response)=>setusers(Response.data)).catch(console.log);
      }
      ser();
      }
      else
        setTimeout(() => {
          setusers(null);
        }, 100);
    }, [search,issearch])
    
    //avatar
    const [avatar, setavatar] = useState(null);
    useEffect(() => {
      const config = {
       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      };

      Axios.get( 
      `http://localhost:3500/api/auth/avatar`,
      config,
      ).then((Response)=>{
        setavatar(Response.data.avatar);
        localStorage.setItem("avatar",Response.data.avatar)
    }).catch(console.log);

  }, [])
  
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

  //send message
  const [commentcontent, setcommentcontent] = useState("")
  const commentinput = useRef(null)
  const handlesendcomment=async()=>{
    if(selecteduser){
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };
        const bodyParameters = {
        Content:commentcontent,
        recipient:selecteduser?._id
        };
        console.log(bodyParameters);
        await Axios.post( 
        'http://localhost:3500/api/message',
        bodyParameters,
        config
        ).then((response)=>{
            console.log(response);
            setcommentcontent("");
            commentinput.current.value="";
            setmessages([response.data,...messages]);
            socket.emit("addMessage",response.data);
            scrolldown();
        }).catch(e=>console.log(e));
    }
  }
    const [conv, setconv] = useState([])
    const [convloading, setconvloading] = useState(true)
  //get conversations
  useEffect(() => {
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };
        Axios.get( 
        'http://localhost:3500/api/message/conversations',
        config
        ).then((response)=>{
            let nrearr=[];
            response.data.forEach(item => {
                item.recipients.forEach(user=>{
                    if(user._id !== parseJwt(localStorage.getItem("token")).id)
                        nrearr.push(user);
                })
            });
            setconv(nrearr);
            setconvloading(false);
        }).catch(e=>console.log(e));
  }, [])

  //get messages
  const [messages, setmessages] = useState([])
  const [messagesloading, setmessagesloading] = useState(false)
  useEffect(() => {
    if(selecteduser)
    {
        setmessagesloading(true)
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };
        const bodyParameters = {
        id:selecteduser?._id
        };
        Axios.post( 
        'http://localhost:3500/api/message/messages',
        bodyParameters,
        config
        ).then((response)=>{
            setmessages(response.data);      
            scrolldown();     
            setmessagesloading(false); 
        }).catch(e=>console.log(e));
    }
  }, [selecteduser])
  
  //realtime messages
  const [getm, setgetm] = useState(null)
  const [getd, setgetd] = useState(null)

    socket.on("addMessageClient",msg=>setgetm(msg))

   
    //delete realtime messages
   
    
    socket.on("deleteMessageClient",msg=>setgetd(msg))


    // const sendmessage= async(msg)=>{
    //     setTimeout(async() => {
    //         await setmessages([msg,...messages]);
    //     }, 100);
    //     scrolldown()
    // }
    
   

  //scroll
  const displaychat = useRef(null);
  const scrolldown=()=>{
    if(displaychat.current)
    {
        setTimeout(() => {
            displaychat.current.scrollIntoView({behavior:'smooth',block:'end'});
        }, 50);
    }
  }

  //delete message
  const deletemessage=async(id)=>{
    const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    };
    const bodyParameters = {
    "id":id
    };
    Axios.post( 
    'http://localhost:3500/api/message/deletemessage',
    bodyParameters,
    config
    ).then((response)=>{
        let mes = messages;
        mes = mes.filter(m=>m._id !=id)
        setmessages(mes);      
        scrolldown();      
        socket.emit("deleteMessage",response.data);
    }).catch(e=>console.log(e));
  }

   

    
    useEffect(() => {
        if(getm !=null && getm.sender == selecteduser._id){
            setmessages([getm,...messages]);
            setgetm(null)
        }

        console.log(getd)
        if(getd !=null  && getd.sender == selecteduser._id){
            let mes = messages
            mes = mes.filter(me=>me._id !=getd._id);
            setmessages(mes); 
            setgetd(null)
        }
     
    }, [socket])
    

   


  return (
    <div className='container'>
        <div className='messenger'>
            <div className='leftside' ref={leftside}>
                <div className='mheader'>
                    <div className="search-box">
                        <input className="search-input" onFocus={()=>setissearch(true)} onBlur={()=>{setTimeout(() => {setissearch(false)}, 100); }} onChange={(e)=>setsearch(e.target.value)} type="text" placeholder="Search something.."/>
                        <button className="search-btn"><i className="fas fa-search"></i></button>
                    </div>
                </div>
                <div className='musers'>
                    {issearch?users?.map((user,i)=><div className={selecteduser==user?"active":""}  key={`usersearchard${i}`} onClick={()=>{setselecteduser(user);console.log(user)}}><UserSearchCard messages={true} avatar={user.avatar} UserName={user.UserName} id={user._id} /></div>)
                    :
                        convloading?"loading...":conv.map((user,i)=><div className={selecteduser==user?"active":""}  key={`usersearchard${i}`} onClick={()=>{setselecteduser(user)}}><UserSearchCard messages={true} avatar={user.avatar} UserName={user.UserName} id={user._id} /></div>)
                    }
                </div>
            </div>
            <div className='rightside'>
                {
                    id == undefined? <div className='icon' onClick={()=>leftside.current.classList.toggle("active")} style={{"float":"right","position":"absolute","top":"5px","right":"-10px"}}>&#9776;</div>:""
                }
                {id == undefined?<div className='main' >
                    <i className="fa-solid fa-comment"></i>
                    </div>:
                <>
                    <div className='mheader'>
                    <div className='icon' onClick={()=>leftside.current.classList.toggle("active")} style={{"float":"right"}}>&#9776;</div>

                        <div className='userstate'>
                            {selecteduser?.avatar?<img src={selecteduser.avatar} alt="avatar" style={{"borderRadius":"50%"}}/>:""}
                            <span>{selecteduser?.UserName}</span>
                        </div>
                    </div>
                    <div className='chat'>
                        <div className='chatdisplay' ref={displaychat}>
                            
                               { messagesloading?"loading...": messages.map((m,i)=>
                                    m.sender ==parseJwt(localStorage.getItem("token")).id?
                                    <MyMessage Content={m.Content} deletefun={deletemessage} _id={m._id}/>
                                    :
                                    <YourMessage Content={m.Content}/>
                                )
                                }

                            
                        </div>
                    </div>

                    <div className='commentinput'>
                        <input type="text" placeholder='Add your comment' onChange={(e)=>setcommentcontent(e.target.value)} ref={commentinput} />
                        
                        {
                            commentcontent.trim().length>0?<button className='active sendcomment' onClick={handlesendcomment}>send</button>:<button className='sendcomment'>send</button>
                        }
                    </div>
                </>
                }
            </div>
        </div>
    </div>
  )
}

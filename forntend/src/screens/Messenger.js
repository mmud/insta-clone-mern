import  Axios  from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router';
import MyMessage from '../components/MyMessage';
import UserSearchCard from '../components/UserSearchCard';
import YourMessage from '../components/YourMessage';
import "./messenger.css"

export default function Messenger() {
    const {id} = useParams();
    const [selecteduser, setselecteduser] = useState(null)
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
  

  //send message
  const [commentcontent, setcommentcontent] = useState("")
  const commentinput = useRef(null)
  const handlesendcomment=async()=>{
      const config = {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      };
      const bodyParameters = {
      Content:commentcontent
      };
      console.log(bodyParameters);
      await Axios.post( 
      'http://localhost:3500/api/post/comment',
      bodyParameters,
      config
      ).then((response)=>{
          if(response.data.msg == "done")
          {
              setcommentcontent("");
              commentinput.current.value="";
          }
      }).catch(e=>console.log(e));

  }
  

  return (
    <div className='container'>
        <div className='messenger'>
            <div className='leftside'>
                <div className='mheader'>
                    <div className="search-box">
                        <input className="search-input" onFocus={()=>setissearch(true)} onChange={(e)=>setsearch(e.target.value)} type="text" placeholder="Search something.."/>
                        <button className="search-btn"><i className="fas fa-search"></i></button>
                    </div>
                </div>
                <div className='musers'>
                    {users?.map((user,i)=><div className={selecteduser==user?"active":""}  key={`usersearchard${i}`} onClick={()=>{setselecteduser(user);console.log(user)}}><UserSearchCard messages={true} avatar={user.avatar} UserName={user.UserName} id={user._id} /></div>)}
                </div>
            </div>
            <div className='rightside'>
                {id == undefined?<div className='main'><i className="fa-solid fa-comment"></i></div>:
                <>
                    <div className='mheader'>
                        <div className='userstate'>
                            {selecteduser?.avatar?<img src={selecteduser.avatar} alt="avatar" style={{"borderRadius":"50%"}}/>:""}
                            <span>{selecteduser?.UserName}</span>
                        </div>
                    </div>
                    <div className='chat'>
                        <div className='chatdisplay'>
                            <MyMessage Content="test"/>
                            <YourMessage Content="test"/>
                            <YourMessage Content="test"/>
                            <YourMessage Content="test"/>
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

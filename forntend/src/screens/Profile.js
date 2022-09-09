import React, { useEffect, useRef, useState } from 'react'
import Axios from "axios"
import LoadingSpinner from '../components/LoadingSpinner'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom';
import "./profile.css"
import Swal from 'sweetalert2'
import { connect } from 'react-redux';

export default function Profile() {
  const {id} = useParams();
  const [loading, setloading] = useState(true)
  const [notfound, setnotfound] = useState(false)
  const [userdata, setuserdata] = useState(null)
  let navigate = useNavigate();
  const nameinput = useRef(null)
  const emailinput = useRef(null)
  const disinput = useRef(null)

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
      if(id == parseJwt(localStorage.getItem("token"))?.id)
          navigate("/profile");
      setnotfound(false);

      const config = {
       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      };

      Axios.get( 
      `http://localhost:3500/api/auth/getme`,
      config,
      ).then((Response)=>{
        setuserdata(Response.data);
        setInputs({UserName:Response.data.UserName,Email:Response.data.Email,discription:Response.data.discription})
        nameinput.current.value= Response.data.UserName;
        emailinput.current.value= Response.data.Email;
        disinput.current.value= Response.data.discription;

    }).catch((e)=>{
          if(e.response.data.msg =="Not Found")
              setnotfound(true);
      });
      setloading(false);

  }, [id])
  
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

  function base64(file, callback){
    var coolFile = {};
    function readerOnload(e){
      var base64 = btoa(e.target.result);
      coolFile.base64 = base64;
      callback(coolFile)
    };
  
    var reader = new FileReader();
    reader.onload = readerOnload;
  
    coolFile.filetype = file.type;
    coolFile.size = file.size;
    coolFile.filename = file.name;
    reader.readAsBinaryString(file);
  }

  //edit profile
  const [avatar, setavatar] = useState(null);
  const img = useRef(null);
  const avatarchange=(e)=>{
    let file = e.target.files[0]

    if(!file)
    {
        errormsg("image not exist");
        return;
    }

    if(file.type !=="image/jpg" && file.type !=="image/jpeg" && file.type !=="image/png")
    {
        errormsg("image format is oncorrect");
        return;
    }

    if(file.size>1024*1024*5)
    {
        errormsg("the largest image size is 5mb");
        return;
    }

    base64( file, function(data){
        setavatar("data:image/*;base64,"+data.base64)
      })
        
  }

  const theform = useRef(null);
  const theoverlay = useRef(null);
  const openeditform=()=>{
    theform.current.style.display="block";
    theoverlay.current.style.display="block";
  }

  const closeeditform=()=>{
    theform.current.style.display="none";
    theoverlay.current.style.display="none";
  }

  const [inputs,setInputs] = useState({
    UserName:"",
    Email:"",
    discription:""
  })

  const handleChange=(e)=>{
    setInputs((prev)=>({
        ...prev,
        [e.target.name]: e.target.value
    }))
  }

  const submithandler= async(e)=>{
    e.preventDefault();

    const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    };

    const bodyParameters = {
    avatar: avatar,
    ...inputs
    };

    await Axios.post( 
    'http://localhost:3500/api/user/updateuser',
    bodyParameters,
    config
    ).then(()=>window.location.reload()).catch(e=>{errormsg(e.response.data.msg);console.log(e)});


  }

  if(loading)
  {
      return(
          <LoadingSpinner/>
      )
  }
  else{
      if(notfound)
      {
          return(
              <div className='main'>
                  User Not Found
              </div>
          )
      }
      else{
          return(
              <div className='container'>
                  <div className="userdata">
                      <img src={userdata?.avatar} className="avatar" alt="avatar"/>
                      <div className='text'>
                          <div className='username'>{userdata?.UserName}<button className='editbtn' onClick={openeditform}>Edit Profile</button></div>
                          <div className='followers'><span>{userdata?.followers.length>=1000000?(userdata?.followers.length / 1000000).toFixed(1).replace(/\.0$/, '') + 'M':userdata?.followers.length>=1000?(userdata?.followers.length / 1000).toFixed(1).replace(/\.0$/, '') + 'K':userdata?.followers.length} Followers</span>
                                                        <span> {userdata?.following.length>=1000000?(userdata?.following.length / 1000000).toFixed(1).replace(/\.0$/, '') + 'M':userdata?.following.length>=1000?(userdata?.following.length / 1000).toFixed(1).replace(/\.0$/, '') + 'K':userdata?.following.length} Following</span>
                          </div>
                          <div className='email'>{userdata?.Email}</div>
                      </div>
                  </div>
                  <div className='overlaye' ref={theoverlay}></div>
                  <div className='editform' ref={theform}>
                    <div className='closeform' onClick={closeeditform}>&times;</div>
                    <form>
                        <div style={{"position":"relative","display":"flex","justifyContent":"center"}}>
                            <input type="file" onChange={avatarchange} id="upload" name='avatar' accept='image/*' hidden/>
                            <label htmlFor="upload" className='uploadbtn'><i className="fa-solid fa-camera"></i></label>
                            <img src={avatar?avatar: userdata?.avatar} ref={img} alt="avatar"/>
                        </div>
                        <input type="text" placeholder="name" name='UserName' ref={nameinput} onChange={handleChange}/>
                        <input type="text" placeholder="email" name='Email' ref={emailinput} onChange={handleChange}/>
                        <textarea placeholder="discription" name='discription' ref={disinput} onChange={handleChange}/>
                        <button onClick={submithandler}>Submit</button>
                    </form>
                  </div>
              </div>
          )
      }
  }

}
// const config = {
//  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//};
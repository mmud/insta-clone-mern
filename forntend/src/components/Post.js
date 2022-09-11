import React, { useEffect, useRef, useState } from 'react'
import "./post.css"
import { Link } from "react-router-dom";
import moment from 'moment/moment';
import ImageGallery from 'react-image-gallery';
import Swal from 'sweetalert2';
import  Axios  from 'axios';

export default function Post(props) {
    const dropdown = useRef(null)
    const [readmore, setreadmore] = useState(false)
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

        const [imagestoshow, setimagestoshow] = useState([])

        useEffect(() => {
          
            let m=[];
            props.postdata.images.forEach(element => {
                m.push({
                    original:element,
                    thumbnail:element
                })
            });
            setTimeout(() => {
                setimagestoshow(m);
            }, 100);
         
        }, [])
        
    const handleeditpost =()=>{
        setonedit(true);
        setTimeout(() => {
            disinput.current.value=props.postdata.Content;
            setimages(props.postdata.images);
            setInputs({
              Content:props.postdata.Content
            })
            openeditform();
            window.scrollTo(0,0)
            document.body.style.overflow="hidden";

        }, 100);
      
    }


  
  //editpost
  const [onedit, setonedit] = useState(false)
  const disinput = useRef(null)
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
  


  const [images, setimages] = useState([]);
  const avatarchange=(e)=>{
      let imgs = [];
      let files= [...e.target.files];
      files.forEach(file => {
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
  
      return base64( file, function(data){
          imgs.push("data:image/*;base64,"+data.base64)
        })
      });
      setTimeout(() => {
          setimages(imgs);
      }, 100);
  }

  const deleteimg=(index)=>{
      let newArr = [...images];
      newArr.splice(index,1);
      setimages(newArr);
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
  document.body.style.overflow="scroll";
  setonedit(false);
}

const [inputs,setInputs] = useState({
  Content:""
})

const handleChange=(e)=>{
  setInputs((prev)=>({
      ...prev,
      [e.target.name]: e.target.value
  }))
}

const spinner = useRef(null)

const submithandler= async(e)=>{
  e.preventDefault();
  e.target.disabled=true;
  spinner.current.style.display="inline-block";


  const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  };
  const bodyParameters = {
  images: images,
  userid:props.postdata.user._id,
  _id:props.postdata._id,
  ...inputs
  };

  await Axios.post( 
  'http://localhost:3500/api/post/edit',
  bodyParameters,
  config
  ).then((response)=>{
    console.log(response);
    if(response.data.msg ==="done")
    {
      disinput.current.value="";
      setimages([]);
      setInputs({
        Content:""
      })
      closeeditform();
      e.target.disabled=false;
      spinner.current.style.display="none";
      setonedit(false);
    }
  }).catch(e=>{errormsg(e.response.data.msg);console.log(e)});
}

  return (
    <>
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

        <div className='postbody'>
            <div className='content'>
                {
                props.postdata.Content?.length<60?
                props.postdata.Content:readmore? props.postdata.Content + ' ':props.postdata.Content?.slice(0,60)+' ...'
                }
                    {
                        props.postdata.Content?.length>60?
                        <span className='readmore' onClick={()=>setreadmore(!readmore)}>
                            {readmore?'Hide content' : 'Read more'}
                        </span> :""
                    }
            </div>
            <div className='images'>
                {
                    props.postdata.images.length === 1 && <img src={props.postdata.images} alt="postimage"/>
                }

                {
                    props.postdata.images.length > 1 ?
                    <ImageGallery items={imagestoshow} showBullets={true} showPlayButton={false} showFullscreenButton={false} showThumbnails={false}/>
                    :""
                }
            </div>
        </div>

        <div className='postfooter'>
                <div className='icons'>
                    <i className="fa-regular fa-heart"></i>
                    <Link to={`/post/${props.postdata._id}`}>
                    <i className="fa-regular fa-comment"></i>
                    </Link>
                </div>
                <div className='poststatus'>
                    <h6>{props.postdata.likes.length} Likes</h6>
                    <h6>{props.postdata.comments.length} Comments</h6>
                </div>
        </div>

        <i className="fa-solid fa-ellipsis" onClick={()=>dropdown.current.classList.toggle("active")}></i>
        {props.postdata.user._id ===  parseJwt(localStorage.getItem("token")).id?
        <div className='togglemenu' ref={dropdown}>
            <div className='option' onClick={handleeditpost}><i className="fa-solid fa-pen"></i> Edit Post</div>
            <div className='option'><i className="fa-solid fa-trash"></i> Delete Post</div>
        </div>
        :""
        }
    </div>
    {onedit?
    <>
    <div className='overlaye' ref={theoverlay}></div>
    <div className='editform home' ref={theform}>
        <div className='closeform' onClick={closeeditform}>&times;</div>
        <form>
            <textarea placeholder="Content" name='Content' ref={disinput} onChange={handleChange}/>
            <div className='showimage'>
                {
                    images.map((img,index)=>(
                        <div  key={index} className="imgcont">
                            <span onClick={()=>deleteimg(index)}>&times;</span>
                            <img src={img} alt="img"/>
                        </div>
                    ))
                }
            </div>
            <div style={{"position":"relative","display":"flex","justifyContent":"center"}}>
                <input type="file" onChange={avatarchange} id="upload" name='avatar' accept='image/*' multiple hidden/>
                <label htmlFor="upload" className='uploadbtn'><i className="fa-solid fa-camera"></i></label>
            </div>
            <div className="lds-spinner" ref={spinner}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            <button onClick={submithandler}>Submit</button>
        </form>
    </div>
    </>
    :""}
    </>
  )
}

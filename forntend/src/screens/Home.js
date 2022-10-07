import  Axios  from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2';
import Post from '../components/Post';
import "./home.css"

export default function Home() {
  
  
  
  //sendpost
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
    ...inputs
    };

    await Axios.post( 
    'http://localhost:3500/api/post',
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
    
      }
    }).catch(e=>{errormsg(e.response.data.msg);console.log(e)});
  }
  

  //show posts
  const [posts, setposts] = useState([])
  const [num, setnum] = useState(1);
  const [loadposts, setloadposts] = useState(false)
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    };
    const asyncfun=async()=>{
      await Axios.get( 
      `http://localhost:3500/api/post?num=${num}`,
      config
      ).then((response)=>{ setTimeout(() => {
        setposts(response.data.posts)
        setloadposts(true);
      }, 10);}).catch(e=>{errormsg(e.response.data.msg);console.log(e)});
    }
    asyncfun();
  }, [])

  //scroll postes
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxscrollPosition, setmaxscrollPosition] = useState(0);
  const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
      const maxposition = -document.documentElement.clientHeight +document.documentElement.offsetHeight;      ;
      setmaxscrollPosition(maxposition);
  };

  useEffect(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
          window.removeEventListener('scroll', handleScroll);
      };
  }, []);

  const [anothergetpost, setanothergetpost] = useState(false)
  const [nomoredata, setnomoredata] = useState(false)
  const scrollloading = useRef(null)
  const nomoredatatext = useRef(null)
  useEffect(() => {
    if((scrollPosition/maxscrollPosition)*100>=70 && !anothergetpost &&!nomoredata)
    {
      setanothergetpost(true);
      scrollloading.current.style.display="block";
      const nextnum = num+1;
      setnum(num+1)
        const config = {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };
        const asyncfun=async()=>{
          await Axios.get( 
          `http://localhost:3500/api/post?num=${nextnum}`,
          config
          ).then((response)=>{ setTimeout(() => {
            console.log(response);
            setposts([...posts,...response.data.posts])
            if(!response.data.posts?.length > 0)
            {
              setnomoredata(true)
              nomoredatatext.current.style.display="block";
            }
            scrollloading.current.style.display="none";
            setanothergetpost(false);
          }, 10);}).catch(e=>{errormsg(e.response.data.msg);console.log(e)});
        }
        asyncfun();
    }
  }, [scrollPosition])
  

  return (
    <>
    <div className='container'>
        <div className='status'>
            <img src={localStorage.getItem("avatar")} alt="avatar" className='avatar'/>
            <button className='statusbtn' onClick={openeditform}>
                What are you thinking?
            </button>
        </div>
        <div className='posts'>
          {
          loadposts?
            posts.map((post,i)=>{
              return <Post key={`post${i}`} postdata={post}></Post>
            }):<div className="lds-ring main"><div></div><div></div><div></div><div></div></div>
        }
        </div>
        <div ref={scrollloading} style={{"display":"none","textAlign":"center","fontWeight":"bolder"}}>Loading...</div>
        <div ref={nomoredatatext} style={{"display":"none","textAlign":"center","fontWeight":"bolder"}}>No More Posts</div>
    </div>
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
  )
}

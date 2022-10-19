import React, { useEffect, useRef, useState } from 'react'
import "./reeluploadvieos.css"
import Swal from 'sweetalert2'
import  Axios  from 'axios'
import { useNavigate } from "react-router-dom";

export default function Reeluploadvieos() {
    const [video, setvideo] = useState(null)
    const [videotime, setvideotime] = useState(null)
    const [Content, setContent] = useState("")
    const [startupload, setstartupload] = useState(false)
    const [videourl, setvideourl] = useState(false)
    const v = useRef(null)
    const videox = useRef(null)
    const uploadarea = useRef(null)
    const progress = useRef(null)
    const showprogress = useRef(null)
    const Navigate = useNavigate();

    const videochange= (e)=>{
        v.current.preload="metadata";
        v.current.onloadedmetadata=()=>{
            window.URL.revokeObjectURL(v.current.src);
            setvideotime(v.current.duration);
            var aspect = v.current.videoHeight/v.current.videoWidth==16/9||v.current.videoHeight/v.current.videoWidth==18/9||v.current.videoHeight/v.current.videoWidth==19.5/9||v.current.videoHeight/v.current.videoWidth==218/480;
            console.log(aspect);
            videox.current.src =window.URL.createObjectURL(e.target.files[0]);
            if(e.target.files[0].size <=104857600 ){
                if(v.current.duration<=120){
                  console.log("v")
                    if(aspect){
                        setvideo(e.target.files[0]);
                        setstartupload(true);
                    }
                    else{
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
                            title: "720x1280 or higher"
                          })
                    }
                }
                else
                {
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
                        title: "max time is 2min"
                      })
                }
            }
            else{
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
                    title: "max size is 100mb"
                  })
            }


            
        }
        v.current.src = window.URL.createObjectURL(e.target.files[0])
        console.log(e.target.files[0]);
    }

    useEffect(() => {
      if(startupload)
      {
        videox.current.style.display="block";
        videox.current.src = window.URL.createObjectURL(video)
        videox.current.play();
        uploadarea.current.style.display ="none";
        showprogress.current.style.display="block";
        const uploadfun=async()=>{
          const formData = new FormData();
          formData.append("file",video);
          formData.append("upload_preset","hcgqvulf");
          const options={
              onUploadProgress:(e)=>{
                  var percent=Math.floor((e.loaded*100)/e.total);
                  progress.current.style.width=`${percent}%`
              }
          }
          Axios.post("https://api.cloudinary.com/v1_1/herostest/video/upload",formData,options).then((response)=>{
              console.log(response);
              setvideourl(response.data.url);
              showprogress.current.style.display="none";
          })
        }
        uploadfun();
        setstartupload(false);
      }
    }, [startupload,video])
    
    const reeluploadbuttonclickhandle= async(e)=>{
      if(videourl)
      {
        e.target.disabled=true;


    const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    };

    const bodyParameters = {
    VideoURL: videourl,
    Content
    };

    await Axios.post( 
      'http://localhost:3500/api/reel',
      //'/api/reel',
    bodyParameters,
    config
    ).then((response)=>{
      console.log(response);
      Navigate(`/reel/${response.data.Reel._id}`)
    }).catch(e=>{console.log(e)});

      }
    }

  
  return (
    <div className='container'>
        <div className="reelupload">
        <video src={video} ref={v} style={{"display":"none"}} className="video"/>
            <div>
              <video src={video} ref={videox} loop muted style={{"display":"none"}}  className="video"/>
              <div className="myBar" style={{"display":"none"}} ref={showprogress}>
                <p className="commonProgressBar" id="myBar1" ref={progress}/>
              </div> 
            </div>
            <input  type="file" id='file' accept="video/mp4"  style={{"display":"none"}} onChange={videochange}/>
            <label htmlFor="file" className='uploadarea' ref={uploadarea}>
              <i className="fa-solid fa-cloud-arrow-up"></i>
              <h2>Select video to upload</h2>
              <p>mp4</p>
              <p>720x1280 or higher</p>
              <p>Up tp 2 min</p>
              <p>less than 100mb</p>
            </label>
            <div className='form'>
                <label htmlFor='cap'>Caption</label>
                <input type="text" id='cap' onChange={(e)=>setContent(e.target.value)}/>
                <button onClick={reeluploadbuttonclickhandle}>post</button>

            </div>
        </div>
    </div>
  )
}

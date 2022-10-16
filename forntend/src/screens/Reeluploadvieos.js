import React, { useEffect, useRef, useState } from 'react'
import "./reeluploadvieos.css"
import Swal from 'sweetalert2'

export default function Reeluploadvieos() {
    const [video, setvideo] = useState(null)
    const [videotime, setvideotime] = useState(null)
    const [startupload, setstartupload] = useState(false)
    const v = useRef(null)
    const videochange= (e)=>{
        v.current.preload="metadata";
        v.current.onloadedmetadata=()=>{
            window.URL.revokeObjectURL(v.current.src);
            setvideotime(v.current.duration);
            var aspect = v.current.videoHeight/v.current.videoWidth==16/9||v.current.videoHeight/v.current.videoWidth==18/9||v.current.videoHeight/v.current.videoWidth==19.5/9;
            console.log(aspect);
            if(e.target.files[0].size <=104857600 ){
                if(v.current.duration<=120){
                    if(aspect){
                        console.log(true);
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
        v.current.src = URL.createObjectURL(e.target.files[0])
        console.log(e.target.files[0]);
    }

    useEffect(() => {
      
    
      
    }, [startupload,video])
    
    
  return (
    <div className='container'>
        <div className="reelupload">
            <video src={video} ref={v} style={{"display":"none"}}/>
            <input  type="file" id='file' accept="video/mp4"  style={{"display":"none"}} onChange={videochange}/>
            <label htmlFor="file" className='uploadarea'>
            <i className="fa-solid fa-cloud-arrow-up"></i>
            <h2>Select video to upload</h2>
            <p>mp4</p>
            <p>720x1280 or higher</p>
            <p>Up tp 2 min</p>
            <p>less than 100mb</p>
            </label>
            <div className='form'>
                <label htmlFor='cap'>Caption</label>
                <input type="text" id='cap'/>
                <button>post</button>

            </div>
        </div>
    </div>
  )
}

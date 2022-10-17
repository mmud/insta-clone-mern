import React, { useRef } from 'react'
import "./reel.css"

export default function Reel(props) {
    const reel = useRef(null)
    const reelclick=()=>{
        if(reel.current.paused)
        {
            reel.current.play();
        }
        else
        {
            reel.current.pause()
        }
    }
    console.log(props.postdata)
  return (
    <div style={{"position":"relative"}}>
        <video src={props.postdata.VideoURL} ref={reel} className='reel' onClick={reelclick}/>
        <p className='reelcontent'>{props.postdata.Content?props.postdata.Content:""}</p>
    </div>
  )
}

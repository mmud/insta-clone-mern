import React, { useRef } from 'react'

export default function MyMessage(props) {
  const m = useRef(null);
  const handeldelete =()=>{
    props.deletefun(props._id);
  }
  return (
    <div className='mymessage' ref={m}>
        <i className="fa-solid fa-trash" onClick={handeldelete}></i>
        {props.Content}
    </div>
  )
}

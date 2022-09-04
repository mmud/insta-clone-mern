import React from 'react'
import "./UserSearchCard.css"

export default function UserSearchCard(props) {
  return (
    <div className='usersearchcard'>
        {props.avatar?<img src={props.avatar} alt="avatar"/>:""}
        <span>{props.UserName}</span>
    </div>
  )
}

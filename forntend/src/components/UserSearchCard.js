import React from 'react'
import "./UserSearchCard.css"
import { Link } from "react-router-dom";


export default function UserSearchCard(props) {
  return (
    <Link to={`/user/${props.id}`}>
      <div className='usersearchcard'>
          {props.avatar?<img src={props.avatar} alt="avatar"/>:""}
          <span>{props.UserName}</span>
      </div>
    </Link>
  )
}

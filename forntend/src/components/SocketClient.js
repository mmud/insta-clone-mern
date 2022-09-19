import React, { useEffect } from 'react'
import  {socket}  from '../socketio'

export default function SocketClient() {
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
    

    console.log(socket);

    useEffect(() => {
        socket.emit('joinUser',parseJwt(localStorage.getItem("token")).id);
    }, [socket,localStorage.getItem("token")])
    

  return (
    <></>
  )
}

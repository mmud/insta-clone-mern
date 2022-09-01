import React,{useState} from 'react'
import "./register.css"
import Axios from "axios"
import { useNavigate } from "react-router-dom";
import shimg from "../images/sh.png"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function Login() {
  const Navigate = useNavigate();
  const MySwal = withReactContent(Swal)

  const [inputs,setInputs] = useState({
    Email:"",
    Password:""
  })

  const handleChange=(e)=>{
    setInputs((prev)=>({
        ...prev,
        [e.target.name]: e.target.value
    }))
    console.log(inputs);
  }

  const submithandler=(e)=>{
    e.preventDefault();
    
    Axios.post( 
      'http://localhost:3500/api/auth/login',
      inputs
    ).then((response)=>{
      console.log(response)
      localStorage.setItem("token",response.data.token);
      Navigate("/", {replace: true})
      window.location.reload();
    }).catch(e=>{
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
        title: e.response.data.msg
      })
    });
  }
  


  return (
    <form className="register-form">
      <img src={shimg} alt="logo" className='logo'/>
      <h1>Login</h1>
      <input type="text" name='Email' placeholder="email" onChange={handleChange}/>
      <input type="password" name='Password' placeholder="password" onChange={handleChange}/>
      <button onClick={submithandler}>Login</button>
    </form>
  )
}

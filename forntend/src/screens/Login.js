import React,{useState} from 'react'
import "./register.css"
import Axios from "axios"
import { useNavigate } from "react-router-dom";

export default function Login() {
  const Navigate = useNavigate();

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
    }).catch(console.log);
  }
  


  return (
    <form className="register-form">
      <h1>Login</h1>
      <input type="text" name='Email' placeholder="email" onChange={handleChange}/>
      <input type="password" name='Password' placeholder="password" onChange={handleChange}/>
      <button onClick={submithandler}>Login</button>
    </form>
  )
}

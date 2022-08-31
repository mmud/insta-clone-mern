import React,{useState} from 'react'
import "./register.css"
import Axios from "axios"
import { useNavigate } from "react-router-dom";

export default function Register() {
  const Navigate = useNavigate();

  const [inputs,setInputs] = useState({
    UserName:"",
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
      'http://localhost:3500/api/auth/register',
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
      <h1>Register</h1>
      <input type="text" placeholder="name" name='UserName' onChange={handleChange}/>
      <input type="text" placeholder="email" name='Email' onChange={handleChange}/>
      <input type="password" placeholder="password" name='Password' onChange={handleChange}/>
      <button onClick={submithandler}>register</button>
    </form>
  )
}

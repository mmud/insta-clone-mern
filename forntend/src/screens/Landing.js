import React from 'react'
import landingimg from "../images/landingimg.png"
import "./landing.css"
import { useNavigate } from 'react-router-dom';


export default function Landing() {
  let navigate = useNavigate(); 

  return (
    <div className='home'>
      <div className='container'> 
        <img src={landingimg} alt="landing img"/>
        <div className='text'>
          <h1>SH Social Media</h1>
          <p>
            the best social media website ever here you can find any thing you want and you can text your frinds and follow them and you can post your photos
          </p>
          <button onClick={()=>navigate("/register")}>Join Us</button>
        </div>
      </div>
    </div>
  )
}

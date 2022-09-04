import Axios from 'axios';
import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import "./user.css"

export default function User() {
    const {id} = useParams();
    const [loading, setloading] = useState(true)
    const [notfound, setnotfound] = useState(false)
    const [userdata, setuserdata] = useState(null)
    let navigate = useNavigate();

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

    useEffect(() => {
        if(id == parseJwt(localStorage.getItem("token"))?.id)
            navigate("/profile");
        setnotfound(false);

        Axios.get( 
        `http://localhost:3500/api/user/getuser/${id}`,

        ).then((Response)=>{setuserdata(Response.data);console.log(Response.data)}).catch((e)=>{
            if(e.response.data.msg =="Not Found")
                setnotfound(true);
        });
        setloading(false);

    }, [id])
    
    if(loading)
    {
        return(
            <LoadingSpinner/>
        )
    }
    else{
        if(notfound)
        {
            return(
                <div className='main'>
                    User Not Found
                </div>
            )
        }
        else{
            return(
                <div className='container'>
                    <div className="userdata">
                        <img src={userdata?.avatar} alt="avatar"/>
                        <div className='text'>
                            <div className='username'>{userdata?.UserName}</div>
                            <div className='followers'><span>{userdata?.followers.length} Followers</span> <span> {userdata?.following.length} Following</span></div>
                            <div className='email'>{userdata?.Email}</div>
                        </div>
                    </div>


                </div>
            )
        }
    }

}

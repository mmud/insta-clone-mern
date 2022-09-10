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
            navigate("/profile",{replace:true});
        setnotfound(false);

        Axios.get( 
        `http://localhost:3500/api/user/getuser/${id}`,

        ).then((Response)=>{setuserdata(Response.data)}).catch((e)=>{
            if(e.response.data.msg =="Not Found")
                setnotfound(true);
        });


        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };
        
        const bodyParameters = {
            id: id
        };
        
        Axios.post( 
          'http://localhost:3500/api/user/isfollowed',
          bodyParameters,
          config
        ).then(response=>{
            if(response.data.msg==="followed")
            {
                setfollowed(true);
            }
        }).catch(e=>{
            if(e.response.data.msg==="not followed")
            {
                setfollowed(false);
            }
        });
        
        setloading(false);

    }, [id])
    

    //follow
    const [followed, setfollowed] = useState(false)

    const handlefollow= async()=>{
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };
        
        const bodyParameters = {
            id: id
        };
        
        Axios.post( 
          'http://localhost:3500/api/user/follow',
          bodyParameters,
          config
        ).then(response=>{
            console.log(response);
            if(response.data.msg==="done")
            {
                setfollowed(true);
            }
        }).catch(e=>{
            console.log(e);
        });
        setfollowed(true);
    }

    const handleunfollow=()=>{
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };
        
        const bodyParameters = {
            id: id
        };
        
        Axios.post( 
          'http://localhost:3500/api/user/unfollow',
          bodyParameters,
          config
        ).then(response=>{
            console.log(response);
            if(response.data.msg==="done")
            {
                setfollowed(true);
            }
        }).catch(e=>{
            console.log(e);
        });
        setfollowed(false);
    }

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
                            <div className='username'>{userdata?.UserName}{!followed?<button className='editbtn' onClick={handlefollow}>Follow</button>:<button className='editbtn' onClick={handleunfollow}>UnFollow</button>}</div>
                            <div className='followers'><span>{userdata?.followers.length>=1000000?(userdata?.followers.length / 1000000).toFixed(1).replace(/\.0$/, '') + 'M':userdata?.followers.length>=1000?(userdata?.followers.length / 1000).toFixed(1).replace(/\.0$/, '') + 'K':userdata?.followers.length} Followers</span>
                                                        <span> {userdata?.following.length>=1000000?(userdata?.following.length / 1000000).toFixed(1).replace(/\.0$/, '') + 'M':userdata?.following.length>=1000?(userdata?.following.length / 1000).toFixed(1).replace(/\.0$/, '') + 'K':userdata?.following.length} Following</span>
                            </div>
                            <div className='email'>{userdata?.Email}</div>
                        </div>
                    </div>


                </div>
            )
        }
    }

}

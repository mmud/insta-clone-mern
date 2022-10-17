import  Axios  from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';
import Post from '../components/Post';
import Reel from '../components/Reel';

export default function ReelPage() {
    const {id} = useParams();
    const [loading, setloading] = useState(true)
    const [notfound, setnotfound] = useState(false)
    const [postdata, setpostdata] = useState(null)
    useEffect(() => {
        setnotfound(false);

        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };
        

        Axios.get( 
            `http://localhost:3500/api/reel/reel/${id}`,
            //`/api/post/post/${id}`,
        config,
        ).then((Response)=>{setpostdata(Response.data.post)}).catch((e)=>{
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
                    Post Not Found
                </div>
            )
        }
        else{
            return(
                <div className='container'>
                   {postdata&&<Reel postdata={postdata}></Reel>}
                </div>
            )
        }
    }
}

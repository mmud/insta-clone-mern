import  Axios  from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import "./Reels.css"
import Hammer from 'hammerjs';
import Reel from '../components/Reel';
import { useNavigate } from "react-router-dom";

export default function Reels() {
      const Navigate = useNavigate();

        //getreels
        const [posts, setposts] = useState([])
        const [currnet, setcurrnet] = useState(0)
      const [num, setnum] = useState(1);
      const [loadposts, setloadposts] = useState(false)
      useEffect(() => {
        const config = {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };
        const asyncfun=async()=>{
          await Axios.get( 
          `http://localhost:3500/api/reel?num=${num}`,
          //`/api/reel?num=${num}`,
          config
          ).then((response)=>{ setTimeout(() => {
            setposts(response.data.posts)
            setloadposts(true);
          }, 10);}).catch(e=>{console.log(e)});
        }
        asyncfun();
      }, [])
    
      //scroll postes
      const [scrollPosition, setScrollPosition] = useState(0);
      const [maxscrollPosition, setmaxscrollPosition] = useState(0);
      const handleScroll = () => {
          const position = scrollreelx.current.style.top;
          setScrollPosition(position);
          const maxposition = cont.current.scrollHeight;
          setmaxscrollPosition(maxposition);
      };
    
      useEffect(() => {
          window.addEventListener('scroll', handleScroll, { passive: true });
    
          return () => {
              window.removeEventListener('scroll', handleScroll);
          };
      }, []);
    
      const [anothergetpost, setanothergetpost] = useState(false)
      const [nomoredata, setnomoredata] = useState(false)
      const scrollloading = useRef(null)
      const nomoredatatext = useRef(null)
      useEffect(() => {
        if(currnet >= posts.length/2 && !anothergetpost &&!nomoredata)
        {
          setanothergetpost(true);
          scrollloading.current.style.display="block";
          const nextnum = num+1;
          setnum(num+1)
            const config = {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            };
            const asyncfun=async()=>{
              await Axios.get( 
              `http://localhost:3500/api/reel?num=${nextnum}`,
              //`/api/post?num=${nextnum}`,
              config
              ).then((response)=>{ setTimeout(() => {
                console.log(response);
                setposts([...posts,...response.data.posts])
                if(!response.data.posts?.length > 0)
                {
                  setnomoredata(true)
                  nomoredatatext.current.style.display="block";
                }
                scrollloading.current.style.display="none";
                setanothergetpost(false);
              }, 10);}).catch(e=>{console.log(e)});
            }
            asyncfun();
        }
      }, [scrollPosition])

      const cont = useRef(null)
      const scrollreelx = useRef(null)


      const [uptrue, setuptrue] = useState(false)
      const [downtrue, setdowntrue] = useState(false)
      const reelsRef = useRef([]);

      useEffect(() => {
        var starty=0,movey=0;
        const tstart = e => {
            starty=e.touches[0].clientY;
        };

        const tmove = e => {
            movey=e.touches[0].clientY;
        };

        const tend = e => {
            if(starty+100<movey)
            {
                    console.log("down");
                    setdowntrue(true)
                    starty=0;
                    movey=0;
            }
            else if(starty-100>movey)
            {
                console.log("up");
                setuptrue(true)
                starty=0;
                movey=0;
            }
            else{
                starty=0;
                movey=0;
                return
            }
        };
        
       
        

        const element = cont.current;
    
        element.addEventListener('touchstart', tstart);
        element.addEventListener('touchmove', tmove);
        element.addEventListener('touchend', tend);
        
        return () => {
          element.removeEventListener('touchstart', tstart);
          element.removeEventListener('touchmove', tmove);
          element.removeEventListener('touchend', tend);
        };
      }, []);

      useEffect(() => {
        if(downtrue)
        {
            down();
            setdowntrue(false);
        }
      }, [downtrue])

      useEffect(() => {
        if(uptrue)
        {
            up();
            setuptrue(false);
        }
      }, [uptrue])

      useEffect(() => {
        scrollreelx.current.style.top=`-${cont.current.offsetHeight*(currnet)}px`
        console.log(scrollreelx)
        if(scrollreelx){

            for (let index = 0; index < scrollreelx.current?.children.length; index++) {
                scrollreelx.current?.children[index].children[0]?.pause()
            }

          
            scrollreelx.current?.children[currnet].children[0]?.play();
        }
      }, [currnet])
     const up=()=>{
        if(currnet < posts.length-1)
        setcurrnet(currnet+1);
     }
     const down=()=>{
        if(currnet > 0)
        setcurrnet(currnet-1);
     }
     const add=()=>{
      Navigate(`/uploadreel`)
      }
    //   useEffect(() => {
    //     console.log(currnet)
    //     if(up)
    //     {
    //         setup(false)
    //         
    //     }
    //     else if(down)
    //     {
    //         setdown(false)
    //         
    //     }
    //   }, [up,down])
    const addToRefs = el => {
        if (el && !reelsRef.current.includes(el)) {
            reelsRef.current.push(el);
        }
       };
      
  return (
    <div className='container reelcont' ref={cont}>
        <button onClick={up} className="up" style={{"zIndex":"2"}}><i className="fa-solid fa-arrow-down"></i></button>
        <button onClick={down} className="down" style={{"zIndex":"2"}}><i className="fa-solid fa-arrow-up"></i></button>
        <button onClick={add} className="add" style={{"zIndex":"2"}}><i class="fa-solid fa-plus"></i></button>
        <div className='scrollreel' ref={scrollreelx}>            
            {posts?.map((reel,i)=><Reel postdata={reel} ref={ addToRefs} />)}
            <div ref={scrollloading} style={{"display":"none","textAlign":"center","fontWeight":"bolder"}}>Loading...</div>
            <div ref={nomoredatatext} style={{"display":"none","textAlign":"center","fontWeight":"bolder"}}>No More Reels</div>
        </div>
    </div>
  )
}

import { useEffect,useState } from 'react';
import './App.css';
import {BrowserRouter , Route,Routes,Navigate } from "react-router-dom";
import Header from './components/Header.js';
import Profile from './screens/Profile';
import Register from './screens/Register';
import Login from './screens/Login';
import LoadingSpinner from './components/LoadingSpinner';
import Admin from './screens/Admin';
import Axios from "axios"
import Error404 from './screens/Error404';
import Landing from './screens/Landing';
import User from './screens/User';
import Home from './screens/Home';
import PostPage from './screens/PostPage';
import SocketClient from './components/SocketClient';
import Messenger from './screens/Messenger';
import Reeluploadvieos from './screens/Reeluploadvieos';
import ReelPage from './screens/ReelPage';
import Reels from './screens/Reels';

function App() {
  const [islogedin, setislogedin] = useState(false)
  const [loaded, setloaded] = useState(false)
  useEffect(() => {
    Axios.get( 
      //'/api/auth/isloggedin',
      'http://localhost:3500/api/auth/isloggedin',
      
      {headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }}
    ).then(response=>{
      if(response.data === "not authorized")
      {
        setislogedin(false);
        localStorage.setItem("token",null);
      }
      else if (response.data === "logedin")
      {
        setislogedin(true);
      }
      setloaded(true);
    }).catch(e=>{
        setislogedin(false);
        localStorage.setItem("token",null);
      setloaded(true);
    })
  }, [])

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


  return (
    <BrowserRouter>
      <Header/>
      {islogedin&&<SocketClient/>}
      {
        loaded?
      <Routes>
        <Route path="*" exact element={<Error404/>} />
        <Route path="/" exact element={islogedin?<Home/>:<Landing/>} />
        <Route path="/reels" exact element={islogedin?<Reels/>:<Navigate to="/login" replace={true}/>} />
        <Route path="/messages" exact element={islogedin?<Messenger/>:<Navigate to="/login" replace={true}/>} />
        <Route path="/messages/:id" exact element={islogedin?<Messenger/>:<Navigate to="/login" replace={true}/>} />
        <Route path="/uploadreel" exact element={islogedin?<Reeluploadvieos/>:<Navigate to="/login" replace={true}/>} />
        <Route path="/Error404" exact element={<Error404/>} />
        <Route path="/user/:id" exact element={<User/>} />
        <Route path="/post/:id" exact element={<PostPage/>} />
        <Route path="/reel/:id" exact element={<ReelPage/>} />
        <Route path="/profile" exact element={islogedin?<Profile/>:<Navigate to="/login" replace={true}/>}/>
        <Route path="/admin" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="admin"?<Admin/>:<Error404/>} />
        <Route path="/register" exact element={!islogedin?<Register/>:<Navigate to="/" replace={true}/>} />
        <Route path="/login" exact element={!islogedin?<Login/>:<Navigate to="/" replace={true}/>} />
      </Routes>
      :
      <LoadingSpinner/>
    }
    </BrowserRouter>
  );
}

export default App;

import { useEffect,useState } from 'react';
import './App.css';
import {BrowserRouter , Route,Routes,Navigate,useNavigate } from "react-router-dom";
import Header from './components/Header.js';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Register from './screens/Register';
import Login from './screens/Login';
import LoadingSpinner from './components/LoadingSpinner';
import Admin from './screens/Admin';
import Axios from "axios"
import Error404 from './screens/Error404';

function App() {
  const [islogedin, setislogedin] = useState(false)
  const [loaded, setloaded] = useState(false)
  useEffect(() => {
    Axios.get( 
      'http://localhost:3500/api/auth/isloggedin',
      {headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }}
    ).then(response=>{
      if(response.data == "not authorized")
      {
        setislogedin(false);
        localStorage.setItem("token",null);
      }
      else if (response.data == "logedin")
      {
        setislogedin(true);
      }
      setloaded(true);
    }).catch(e=>{
      if(e.response.data === "not authorized")
      {
        setislogedin(false);
        localStorage.setItem("token",null);
      }
      else if (e.response.data === "logedin")
      {
        setislogedin(true);
      }
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
      {
        loaded?
      <Routes>
        <Route path="*" exact element={<Error404/>} />
        <Route path="/" exact element={<Home/>} />
        <Route path="/Error404" exact element={<Error404/>} />
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

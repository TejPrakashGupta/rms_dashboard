import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';

import '../node_modules/font-awesome/css/font-awesome.min.css';

import '../styles/globals.css'
import '../styles/App.css'
import '../styles/Login.css'


import { ToastContainer, toast } from 'react-toastify';

import axios from 'axios';

const app = {};

app.baseURL = 'http://rms.softreader.in:5000/api'
// app.baseURL = 'http://localhost:5000/api'


var _token = '';
// if(typeof window !== 'undefined') 
// _token =  sessionStorage.getItem('rms_dashboard_token') 



app.toast = (msg,type='default')=> {
  const config = {autoClose:1500,position: toast.POSITION.BOTTOM_CENTER,hideProgressBar:true,type};
    if(typeof msg == 'string')
     return toast(msg, config);



     msg.map(m=>{
       toast(m,config)
     })

};


app.get = async (url,callback=function(){})=>{
  _token =  sessionStorage.getItem('rms_dashboard_token')
  let config = {
    headers: { 
      Authorization: 'Bearer '+_token,
    } 
  } 
  console.log("Token_3: ",sessionStorage.getItem('rms_dashboard_token'))
    var data = {};
    await axios.get(`${app.baseURL}${url}`,config)
      .then(res => {
        data = res.data;
        callback(null,data)
      }).catch(err=>{
        callback(err)
        data = err;
      });
      
      return data;
}

app.post = async (url,body,callback=function(){})=>{
  _token =  sessionStorage.getItem('rms_dashboard_token')
  let config = {
    headers: {
      Authorization: 'Bearer '+_token,
    }
  }
  console.log("Token_3_post: ",sessionStorage.getItem('rms_dashboard_token'))
    var data = {};
    await axios.post(`${app.baseURL}${url}`,body,config)
      .then(res => {
        data = res.data;
        callback(null,data)
      }).catch(err=>{
        callback(err)
        data = err;
      });

      return data;
}

app.put = async (url,body,callback=function(){})=>{
  _token =  sessionStorage.getItem('rms_dashboard_token')
  let config = {
    headers: {
      Authorization: 'Bearer '+_token,
    }
  }

    var data = {};
    await axios.put(`${app.baseURL}${url}`,body,config)
      .then(res => {
        data = res.data;
        callback(null,data)
      }).catch(err=>{
        callback(err)
        data = err;
      });

      return data;
}

app.delete = async (url,body,callback=function(){})=>{
  _token =  sessionStorage.getItem('rms_dashboard_token')
  let headers = {
      Authorization: 'Bearer '+_token,
    } 
    

    var data = {};
    await axios.delete(`${app.baseURL}${url}`, {data:body, headers})
      .then(res => {
        data = res.data;
        callback(null,data)
      }).catch(err=>{
        callback(err)
        data = err;
      });
      
      return data;
}

global.app = app;

function MyApp({ Component, pageProps }) {
  return (
  <>
  <Component {...pageProps} />
  <ToastContainer/>
  </>
)}

export default MyApp

import React from "react";
import { Spin,Row,Col } from 'antd';
import "./Login.css";

export const doLoginWithUrl = (dispatch)=>{
  const queryString = window.location.search;
  console.log("window.location.search: ",window.location.search)
  const urlParams = new URLSearchParams(queryString);
  const accessToken = urlParams.get("access_token");
  const expiresIn = urlParams.get("expires_in");
  const refreshToken = urlParams.get("refresh_token");

  if(accessToken){
    dispatch({type:"LOGIN",payload:{accessToken, refreshToken,expiresIn}});
    return true;
  }else{
    return false;
  }

}

export const loginWithoutUser = (dispatch)=>{
  console.log("login without user called")
  fetchWithTimeout(
    process.env.REACT_APP_BACKEND_LINK+"login/nouser",{timeout:10000}
  ).then((res) => res.json()).then(
    data=>{
      console.log("reahed server")
      dispatch({type:"DEFAULT_LOGIN",payload:data});
    }).catch(err=>{dispatch({type:"NETWORK_ERROR",payload:err})})
}

export const loadLogin = (dispatch)=>{
  const userLogin = localStorage.getItem('USER_LOGIN');
        if(userLogin){
            // const { accessToken, refreshToken,expiryTime} = JSON.parse(userLogin);
            dispatch({type:"LOAD_LOGIN",payload:JSON.parse(userLogin)})
            return true;
        }

        const defaultLogin = localStorage.getItem('DEFAULT_LOGIN');
        if(defaultLogin){
          // const { accessToken, refreshToken,expiryTime} = JSON.parse(userLogin);
          dispatch({type:"LOAD_LOGIN",payload:JSON.parse(defaultLogin)})
          return true;
        }

        return false;
}

export const prevPageInfoText = "prevPageInfo";
export const doLogin = (history,data,dispatch)=>{
  //remove so no conflict with new login
  doLogOut(dispatch);
  // const data = {pathname:history.pathname,se}
  localStorage.setItem(prevPageInfoText,JSON.stringify({history:history,data:data}))
  window.location.href = process.env.REACT_APP_BACKEND_LINK+"login/";
}

export const checkAPI = (dispatch)=>{
  fetchWithTimeout(
    process.env.REACT_APP_BACKEND_LINK,{timeout:10000}
  ).then((res) => console.log("got response from server: ",res)).catch(err=>{dispatch({type:"NETWORK_ERROR",payload:err})})
}

export const doLogOut = (dispatch)=>{
  dispatch({type:"LOGOUT"})
}

export const doRefresh = (dispatch, refreshToken)=>{

  fetchWithTimeout(
    process.env.REACT_APP_BACKEND_LINK+"login/refresh_token?" +
      new URLSearchParams({
        refresh_token: refreshToken,
      }),{timeout:10000}
  )
    .then((res) => res.json())
    .then((data) => {
      dispatch({type:"REFRESH",payload:data})
    }).catch(err=>dispatch({type:"NETWORK_ERROR",payload:err}))
}

//https://dmitripavlutin.com/timeout-fetch-request/
export async function fetchWithTimeout(resource, options) {
  const { timeout = 8000 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal  
  });
  clearTimeout(id);

  return response;
}

function Login({ loading }) {
  console.log("process.env.BACKEND_LINK: ",process.env.REACT_APP_BACKEND_LINK)
  const DisplayLogin = ()=>{
    return <div className="login">
    <img
      src="https://music-b26f.kxcdn.com/wp-content/uploads/2017/06/635963274692858859903160895_spotify-logo-horizontal-black.jpg"
      alt="Spotify logo"
    />
    <a href={process.env.REACT_APP_BACKEND_LINK+"login/"}>LOGIN WITH SPOTIFY</a>
  </div>
    
  }
  return (
    !loading ? <DisplayLogin />:( <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
      <Col><Spin size="large" /></Col>
    
  </Row>)
  );
}

export default Login;

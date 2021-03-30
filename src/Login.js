import React from "react";
import { Spin,Row,Col } from 'antd';
import "./Login.css";

function Login({ loading }) {

  const DisplayLogin = ()=>{
    return <div className="login">
    <img
      src="https://music-b26f.kxcdn.com/wp-content/uploads/2017/06/635963274692858859903160895_spotify-logo-horizontal-black.jpg"
      alt="Spotify logo"
    />
    <a href={"http://localhost:8080/login/"}>LOGIN WITH SPOTIFY</a>
  </div>
    
  }
  return (
    !loading ? <DisplayLogin />:( <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
      <Col><Spin size="large" /></Col>
    
  </Row>)
  );
}

export default Login;

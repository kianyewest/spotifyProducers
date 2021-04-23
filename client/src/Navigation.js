// import { Layout } from 'antd';
import React from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { IndexLinkContainer } from "react-router-bootstrap";
import SearchFunction from "./SearchFunction";
import { AuthContext } from "./Context/context";
// const { Header, Content, Footer } = Layout;
const Navigation = ({ Logout, spotify }) => {
  const { state, dispatch } = React.useContext(AuthContext);
  return (
    // <Header>
    //   <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
    //     <Menu.Item key="1"><Link to={{ pathname: `/` }}>Home</Link></Menu.Item>
    //     <Menu.Item key="2"><Link to={{ pathname: `/albums` }}>Albums</Link></Menu.Item>
    //    <Button onClick={()=>Logout()}>Partial Logout</Button>
    //       <SearchFunction spotify={spotify} size={300} />
        
    //   </Menu>
    // </Header>

      <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">Navbar</Navbar.Brand>
      <Nav className="mr-auto">
        <IndexLinkContainer to="/"><Nav.Link>Home</Nav.Link></IndexLinkContainer>
        <IndexLinkContainer to="/about"><Nav.Link>About</Nav.Link></IndexLinkContainer>
        <IndexLinkContainer to="/albums"><Nav.Link>Albums</Nav.Link></IndexLinkContainer>
        {/* debugging purposes */}
        <IndexLinkContainer to="/albums"><Nav.Link>{state.isAuthenticated ? "isAuthenticated" : "not authenticated" }</Nav.Link></IndexLinkContainer>
        <IndexLinkContainer to="/albums"><Nav.Link>{state.isUserAuthenticated ? "user auth" : "user not auth"}</Nav.Link></IndexLinkContainer>
        {/* End debugging */}
        <Button onClick={()=>Logout()}>Logout</Button>
      </Nav>
      <SearchFunction
                    spotify={spotify}
                    size={300}

                  />
    </Navbar>
  );
};

export default Navigation;

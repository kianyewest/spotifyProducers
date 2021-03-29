import React from 'react';
import { Button, Nav, Navbar } from 'react-bootstrap';
import { IndexLinkContainer } from 'react-router-bootstrap';
import SearchFunction from './SearchFunction';

const Navigation = ({Logout,spotify}) => {
  return (
    <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="#home">Navbar</Navbar.Brand>
    <Nav className="mr-auto">
      <IndexLinkContainer to="/"><Nav.Link>Home</Nav.Link></IndexLinkContainer>
      <IndexLinkContainer to="/about"><Nav.Link>About</Nav.Link></IndexLinkContainer>
      <IndexLinkContainer to="/albums"><Nav.Link>Albums</Nav.Link></IndexLinkContainer>
      

      <Button onClick={()=>Logout()}>Partial Logout</Button>
    </Nav>
    <SearchFunction
                  spotify={spotify}
                  size={300}
                  
                />
  </Navbar>
    
  );
};

export default Navigation;
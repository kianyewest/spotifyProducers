import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container,NavDropdown,Form,FormControl,Button } from 'react-bootstrap';
import {IndexLinkContainer} from 'react-router-bootstrap'
const Navigation = ({Logout}) => {
  return (
    <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="#home">Navbar</Navbar.Brand>
    <Nav className="mr-auto">
      <IndexLinkContainer to="/"><Nav.Link>Home</Nav.Link></IndexLinkContainer>
      <IndexLinkContainer to="/about"><Nav.Link>About</Nav.Link></IndexLinkContainer>
      <IndexLinkContainer to="/albums"><Nav.Link>Albums</Nav.Link></IndexLinkContainer>
      <IndexLinkContainer to="/search"><Nav.Link>Search</Nav.Link></IndexLinkContainer>
      

      <Button onClick={()=>Logout()}>Partial Logout</Button>
    </Nav>
    <Form inline>
      <FormControl type="text" placeholder="Search" className="mr-sm-2" />
      <Button variant="outline-info">Search</Button>
    </Form>
  </Navbar>
    
  );
};

export default Navigation;
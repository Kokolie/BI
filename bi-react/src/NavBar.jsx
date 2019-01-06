import React from 'react';
import './styles/NavBar.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Alert, Collapse, Col, Container, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, Row } from 'reactstrap';
import Img from 'react-image'
import axios from 'axios';
import Home from './Home.jsx'

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      loggedIn: false,
      loginExpired: false
    };
    this.timeout = {};
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  async componentDidMount() {
  }

  render() {
    return (
      <Container>
      <Router>
        <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">Business Intelligence</NavbarBrand>
          <NavbarToggler className="text-right nav-right" onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            {this.state.loggedIn && <Nav style={{width:"100%", marginRight:"30px"}} className="text-right">
              <NavItem>
                <Link className="nav-tab" to="/Home">Home</Link>
              </NavItem>
            </Nav> }
          </Collapse>          
        </Navbar>
        <Route exact path="/" component={Home} />
        </div>
      </Router>
      <div className="footer">
      <Container>
      <Row>
      <Col className="text-center">
        Back-end: API
      </Col>
      </Row>
      </Container>
      </div>
      </Container>

    );
  }
}

export default NavBar;

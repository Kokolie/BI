import React from 'react';
import './styles/NavBar.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Collapse, Col, Container, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, Row } from 'reactstrap';
import Home from './Home.jsx'
import Upload from './Upload.jsx'
import AlertList from './AlertList.jsx'

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: true,
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
            <Nav style={{width:"100%", marginRight:"30px"}} className="text-right">
              <NavItem>
                <Link className="nav-tab" to="/Alerts">Alerts</Link>
              </NavItem>  
              <NavItem>
                <Link className="nav-tab" to="/Export">Export</Link>
              </NavItem>
              <NavItem>
                <Link className="nav-tab" to="/Upload">Upload</Link>
              </NavItem>               
            </Nav>
          </Collapse>          
        </Navbar>
        <Route exact path="/" component={AlertList} />
        <Route exact path="/Alerts" component={AlertList} />
        <Route exact path="/Export" component={Home} />
        <Route exact path="/Upload" component={Upload} />
        </div>
      </Router>
      <div className="footer">
      <Container>
      <Row>
      <Col className="text-center">
        Back-end: http://localhost:3030
      </Col>
      </Row>
      </Container>
      </div>
      </Container>

    );
  }
}

export default NavBar;

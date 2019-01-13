import React from 'react';
import { Button, Card, CardBody, CardGroup, CardText, CardTitle } from 'reactstrap';
import './styles/Home.css';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeout: {},
      targetUser: 0,
      search: ""
    };
  }

  async componentDidMount() {

  }

  async componentWillUnmount() {
    clearTimeout(this.timeout);
    this.timeout = {};    
  }


  render() 
  {
  	return (
  	<div>
    <CardGroup>
    <Card>
    <CardBody>
    <CardTitle>Title</CardTitle>
    <CardText>
      Hello
      <Button>Generate Output</Button>
    </CardText>
    </CardBody>
    </Card>
    </CardGroup> 
    </div>)
  }
};

export default Home;
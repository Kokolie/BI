import React from 'react';
import { Card, CardBody, CardGroup, CardText, CardTitle } from 'reactstrap';
import axios from 'axios';

class AlertList extends React.Component {
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
    <CardTitle>Alerts</CardTitle>
    <CardText>  
      Alerts
    </CardText>
    </CardBody>
    </Card>
    </CardGroup> 
    </div>)
  }
};

export default AlertList;
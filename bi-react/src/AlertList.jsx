import React from 'react';
import { Card, CardBody, CardGroup, CardHeader, CardText, CardTitle, ListGroup, ListGroupItem, Table } from 'reactstrap';
import axios from 'axios';

function Alerts(props) {

  if(props.alerts.length === 0) {
    return(
          <ListGroup>
          <ListGroupItem key={"1"}>
          No Entries.
          </ListGroupItem>
          </ListGroup>);
  }
  const alerts = props.alerts;
  const listItems = alerts.map((line, index) =>
  <tr>
      <th>{JSON.stringify(line.timestamp).replace(/['"]+/g, '').replace(/[T]+/g, ' ')}</th>
      <td>{JSON.stringify(line.name).replace(/['"]+/g, '')}</td>
      <td>{JSON.stringify(line.avgjobkey)}</td>
      <td>{JSON.stringify(line.vehicleId)}</td>
      <td>({JSON.stringify(line.x)}, {JSON.stringify(line.y)})</td>
      <td>{JSON.stringify(line.direction)}</td>
      <td>{JSON.stringify(line.speed)}</td>
      <td>{line.blocking && String.fromCharCode(10004)} {!line.blocking && String.fromCharCode(10006)}</td>
      <td>{line.environmental && String.fromCharCode(10004)} {!line.environmental && String.fromCharCode(10006)}</td>
  </tr>
  );
  return (
    <Table>
    <thead>
    <tr>
    <th>Timestamp</th>
    <th>Alert</th>
    <th>AVGjobkey</th>    
    <th>Vehicle ID</th>
    <th>Location</th>
    <th>Direction</th>
    <th>Speed</th>
    <th>Blocked</th>
    <th>Environmental</th>
    </tr>
    </thead>
    <tbody>
    {listItems}
    </tbody>

    </Table>
  );
}

function custom_sort(a, b) {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
}

class AlertList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeout: {},
      alerts: [],
      success: true
    };
  }

  async componentDidMount() {

    this.updateInfo();
  }

  async componentWillUnmount() {
    clearTimeout(this.timeout);
    this.timeout = {};    
  }

  async updateInfo() {

    var that=this;

    await axios.get("http://localhost:3030/sequelise/alerts")
    .then(function(response) {
      //console.log(response)
      var alerts = [];
      for( const entry of response.data) {
        var alert = {};
        alert.timestamp = entry.timestamp;
        alert.avgjobkey = entry.avgjobkey;
        alert.name = entry.name;
        alert.vehicleId = entry.vehicleId;

        alert.x = entry.x;
        alert.y = entry.y;
        alert.speed = entry.speed;
        alert.direction = entry.direction;

        alert.blocking = entry.blocking;
        alert.environmental = entry.environmental;
        alerts.push(alert);
      }
      alerts.sort(custom_sort);
      that.setState({alerts: alerts});
    })
    .catch(function(error) {
      that.setState({success: false});
      console.error("The alert list module was unable to connect to the back-end");
    });
    if(!that.state.success) { return; }
    //console.log(that.state.alerts);
    //convert timestamp
}

  render() 
  {
  	return (
  	<div>
    <CardGroup>
    <Card>
    <CardHeader>
    <CardTitle>Alerts</CardTitle>
    </CardHeader>
    <CardBody>
    <CardText>  
    <Alerts alerts={this.state.alerts}/>
    </CardText>
    </CardBody>
    </Card>
    </CardGroup> 
    </div>)
  }
};

export default AlertList;
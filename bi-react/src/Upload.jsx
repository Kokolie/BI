import React from 'react';
import { Button, Card, CardBody, CardGroup, CardFooter, CardText, CardTitle, Form, Input } from 'reactstrap';
import axios from 'axios';
import './styles/Home.css';
import FileReader from 'filereader';

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      loaded: 0
    };
    this.handleUpload = this.handleUpload.bind(this);
    this.handleselectedFile = this.handleselectedFile.bind(this);
  }

  async componentDidMount() {

  }

  async componentWillUnmount() {
    clearTimeout(this.timeout);
  }
/*
  handleUpload = () => {
      const data = new FormData();
      data.append('file', this.state.selectedFile, this.state.selectedFile.name);
      console.log(data);
      axios
        .post("http://localhost:3030/readtxt", data, { 
          headers: {
            'Content-Type': 'application/json'
          },
          onUploadProgress: ProgressEvent => {
            this.setState({
              loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
            })
          },
        })
        .then(res => {
          console.log(res.statusText)
        })

  }
*/
  async handleUpload() {

    console.log(this.state.selectedFile);
    var reader = new FileReader();

    reader.onload = function(e) {
      var text = reader.result;
      console.log(text);
    }    
    console.log(reader.readAsText(this.state.selectedFile));
  }

  handleselectedFile = event => {
      this.setState({
        selectedFile: event.target.files[0],
        loaded: 0,
      })
    }

  render() 
  {
  	return (
  	<div>
    <Form>
    <CardGroup>
    <Card>
    <CardBody>
    <CardTitle>Upload a file</CardTitle>
    <CardText> 
      <Input type="file" name="" id="" onChange={this.handleselectedFile}/>
    </CardText>
    </CardBody>
    <CardFooter>
      <Button onClick={this.handleUpload}>Upload</Button>
      <div> {Math.round(this.state.loaded,2) } %</div>
    </CardFooter>
    </Card>
    </CardGroup> 
    </Form>
    </div>)
  }
};

export default Upload;
import React from 'react';
import { Button, Card, CardBody, CardGroup, CardFooter, CardText, CardTitle, Form, Input } from 'reactstrap';
import axios from 'axios';
import './styles/Home.css';
import FormData from 'form-data';

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      selectedFileXlsx: null,
      selectedFileXml: null,
      loaded: 0,
      loadedXlsx: 0,
      loadedXml: 0
    };
    this.handleUpload = this.handleUpload.bind(this);
    this.handleselectedFile = this.handleselectedFile.bind(this);
    this.handleUploadXlsx = this.handleUploadXlsx.bind(this);
    this.handleselectedFileXlsx = this.handleselectedFileXlsx.bind(this);
    this.handleUploadXml = this.handleUploadXml.bind(this);
    this.handleselectedFileXml = this.handleselectedFileXml.bind(this);
  }

  async componentDidMount() {

  }

  async componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  handleUpload = (e) => {
      const data = new FormData();
      data.append('uri', this.state.selectedFile, this.state.selectedFile.name);
      axios
        .post("http://localhost:3030/readtxt", data, { 
          headers: {
          'Content-Type': 'multipart/form-data'
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

  handleselectedFile = event => {
      this.setState({
        selectedFile: event.target.files[0],
        loaded: 0,
      })
    }

  handleUploadXlsx = (e) => {
      const data = new FormData();
      data.append('uri', this.state.selectedFile, this.state.selectedFile.name);
      axios
        .post("http://localhost:3030/readxlsx", data, { 
          headers: {
          'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: ProgressEvent => {
            this.setState({
              loadedXlsx: (ProgressEvent.loaded / ProgressEvent.total*100),
            })
          },
        })
        .then(res => {
          console.log(res.statusText)
        })

  }

  handleselectedFileXlsx = event => {
      this.setState({
        selectedFile: event.target.files[0],
        loadedXlsx: 0,
      })
    }

  handleUploadXml = (e) => {
      const data = new FormData();
      data.append('uri', this.state.selectedFile, this.state.selectedFile.name);
      axios
        .post("http://localhost:3030/readalert", data, { 
          headers: {
          'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: ProgressEvent => {
            this.setState({
              loadedXml: (ProgressEvent.loaded / ProgressEvent.total*100),
            })
          },
        })
        .then(res => {
          console.log(res.statusText)
        })

  }

  handleselectedFileXml = event => {
      this.setState({
        selectedFile: event.target.files[0],
        loadedXlsx: 0,
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
    <CardTitle>Upload a txt file</CardTitle>
    <CardText> 
      <Input type="file" name="file" id="" onChange={this.handleselectedFile}/>
    </CardText>
    </CardBody>
    <CardFooter>
      <Button onClick={this.handleUpload}>Upload</Button>
      <div> {Math.round(this.state.loaded,2) } %</div>
    </CardFooter>
    </Card>
    <Card>
    <CardBody>
    <CardTitle>Upload an xlsx file</CardTitle>
    <CardText> 
      <Input type="file" name="file" id="" onChange={this.handleselectedFileXlsx}/>
    </CardText>
    </CardBody>
    <CardFooter>
      <Button onClick={this.handleUploadXlsx}>Upload</Button>
      <div> {Math.round(this.state.loadedXlsx,2) } %</div>
    </CardFooter>
    </Card>
    <Card>
    <CardBody>
    <CardTitle>Upload an xml alert file</CardTitle>
    <CardText> 
      <Input type="file" name="file" id="" onChange={this.handleselectedFileXml}/>
    </CardText>
    </CardBody>
    <CardFooter>
      <Button onClick={this.handleUploadXml}>Upload</Button>
      <div> {Math.round(this.state.loadedXml,2) } %</div>
    </CardFooter>
    </Card>       
    </CardGroup> 
    </Form>
    </div>)
  }
};

export default Upload;
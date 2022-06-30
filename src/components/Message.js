import React from 'react';
import "./Message.scss";
import data from '../data/data.json';
//import config from '../config.json';
//import Smoothlify from '../Smoothlify.js';
import "font-awesome/css/font-awesome.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert';
import CloseButton from 'react-bootstrap/CloseButton';

export default class Message extends React.Component{
  constructor(props){
    super(props);
    //console.log(event);
    this.state = {
      "level": 0,
      "message": "",
      "visible": false
    }
    //let event = Smoothlify.findEvent(props[config.args.id]);
    data.messageCallback = (level, message) => {
      this.setState({
        "level":  level || 0,
        "message": message || "no text defined",
        "visible": true
      });
      if (this.timeout !== undefined)
        clearTimeout(this.timeout);
      this.timeout = setTimeout(()=>{
        this.setState({"visible": false});
      }, 3500);
    };
  }
  componentWillUnmount(){
    clearTimeout(this.timeout);
  }
  /* 
    level 1: Info
    level 2: Warning
    level 3: Critical Error
  */
  render(){
    let icon = "fa fa-info-circle";
    let variant = "success";
    switch(this.state.level){
      case 2:
        icon = "fa fa-info";
        variant = "warning";
        break;
      case 3:
        icon = "fa fa-exclamation-triangle";
        variant = "danger";
        break;
      default:
        break;
    }
    return (
      <Alert id="sly-message" show={this.state.visible} variant={variant} >
        <span className={'' + icon} style={{
          "fontSize": "40px",
        }}>
        </span> 
        { this.state.message }
        <CloseButton onClick={() => this.setState({"visible": false})} variant="outline-success">
        </CloseButton>
      </Alert>
    )
  }
}

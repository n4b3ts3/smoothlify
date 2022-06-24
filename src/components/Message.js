import React from 'react';
import "./Message.scss";
import data from '../data/data.json';
//import config from '../config.json';
//import Smoothlify from '../Smoothlify.js';
import "../static/css/fontawesome.css";

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
      console.log("Calling the fucking callback!! with message: " + message + " and level " + level);
      this.setState({
        "level":  level || 0,
        "message": message || "no text defined",
        "visible": true
      })
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
    let bg = "#4caf50"; 
    let icon = "fa fa-info-circle";
    switch(this.state.level){
      case 2:
        bg = "#ffea00";
        icon = "fa fa-info";
        break;
      case 3:
        bg = "#e53935";
        icon = "fa fa-exclamation-triangle";
        break;
      default:
        break;
    }
    let messageStyle = {
      "backgroundColor": bg,
      "display": this.state.visible?"flex": "none"
    }
    return (
      <div id="sly-message" style={
        messageStyle
      }>
        <span className={'' + icon} style={{
          "fontSize": "40px"
        }}></span> 
        <span>{this.state.message}</span>
        <span className="sly-msg-close" onClick={
          ()=>this.setState({"visible": false})
        }>X</span>
      </div>
    )
  }
}

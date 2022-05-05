import React from 'react';
//import data from '../data/data.json';
import config from '../config.json';
import Ajaxify from '../Ajaxify.js';

export default class Message extends React.Component{
  constructor(props){
    super(props);
    let event = Ajaxify.findEvent(props[config.args.id]);
    //console.log(event);
    this.state = {
      "level": 0,
      "message": "",
      "visible": false
    }
    event.messageCallback = ()=>{
      this.setState({
        "level": event.target.getAttribute(config.args.level) || 0,
        "message": event.target.getAttribute(config.args.message) || "no text defined",
        "visible": true
      })
      this.timeout = setTimeout(()=>{
        this.setState({"visible": false});
      }, 1500);
    };
  }
  componentWillUnmount(){
    clearTimeout(this.timeout);
  }
  render(){
    return (
      <div hidden={!this.state.visible}>
        <span>{this.state.level} </span> 
        <span>{this.state.message}</span>
      </div>
    )
  }
}

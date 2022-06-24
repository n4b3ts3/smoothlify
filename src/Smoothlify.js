import './App.css';
import data from "./data/data.json";
import config from "./config.json";
import Network from './core/network';

export default class Smoothlify {
  constructor(){
    this.network = new Network();
    this.targets = []
  }
  // Hoook an element with scroll position...
  hook(offset){
    document.body.onscroll =(event)=>{
      let target = this.targets.at(this.targets.length - 1);
      let scrollPosition = window.scrollY + window.screen.availHeight;
      if (scrollPosition + offset >= target.offsetTop - target.clientHeight) // Normalize the value
      {
        console.log("Element reached");
        // Do something here like retrieve new information from server
      }
    }
  }
  static find(id){
    return Smoothlify.findEvent(id)?.target;
  }
  // It has a problem with number 4 element :-) do tests with jest for a completly fix
  static findEvent(id){
    let pointer = 0;
    while(true){
      let temp = data.event.at((id - 1) + pointer);
      //console.log(temp?.id + " " + id);
      if(parseInt(temp?.id) === parseInt(id)){
        return temp;
      }else if(temp?.id < id){
        if (pointer < 0) return null;
        pointer++;
      }else if(temp?.id > id){
        if (pointer > 0) return null;
        pointer--;
      }else{
        return null;
      }
    }
  }


  process(id){
    let target = Smoothlify.find(parseInt(id));
    target.title = target.getAttribute(config.args.to) || "undefined";
    let targetType = target.nodeName.toLowerCase();

    let event = "click";
    let handler = async (e) => {
      e.preventDefault();
      if (e.target.getAttribute(config.args.disabled) === "true") return;
      e.target.setAttribute(config.args.disabled, true);
      let t = e.target.style.cursor;
      e.target.style.cursor = "wait";
      this.network.commit(
        e.target.getAttribute(config.args.id),
        ()=>{
          e.target.style.cursor = t;
          e.target.setAttribute(config.args.disabled, false);
      });
    };
    
    if(targetType === "input"){
      event = "input";
      target?.addEventListener(event, handler);
      event = "change";
      target?.addEventListener(event, handler);
    } else{
        event = "click";
        target?.addEventListener(event, handler);
    }
    this.targets.push(target);
  }
}

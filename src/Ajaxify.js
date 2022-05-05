import './App.css';
import data from "./data/data.json";
import config from "./config.json";
import Network from './core/network';

export default class Ajaxify {
  constructor(){
    this.network = new Network();
    this.targets = []
  }
  // Hoook an element with scroll position...
  hook(offset){
    document.body.onscroll =(event)=>{
      let target = this.targets.at(this.targets.length - 1);
      let scrollPosition = window.scrollY + window.screen.availHeight;
      //console.log(scrollPosition + " " + offset + " " + (target.offsetTop - parseInt(target.clientHeight)));
      //console.log(target);
      if (scrollPosition + offset >= target.offsetTop - target.clientHeight) // Normalize the value
      {
        console.log("Element reached");
        // Do something here like retrieve new information from server
      }
    }
  }
  static find(id){
    return Ajaxify.findEvent(id)?.target;
  }
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
    let target = Ajaxify.find(parseInt(id));
    target.title = target.getAttribute(config.args.to) || "undefined";
    target?.addEventListener("click", async (e) => {
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
    })
    this.targets.push(target);
  }
}

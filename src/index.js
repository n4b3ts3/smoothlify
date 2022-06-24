import './index.css';
import data from "./data/data.json";
import config from "./config.json";
import Smoothlify from './Smoothlify'
import ReactDOM from "react-dom/client";
import Message from "./components/Message.js";

var smoothlify = new Smoothlify();
for (let element of document.getElementsByClassName(config["name"])){
  if (element.getAttribute(config.args.debug)){
    console.log("Smoothlify is in: ".concat(element));
  }
  element.setAttribute(config.args.comment, null);
  element.setAttribute(config.args.id, parseInt(data.event.at(data.event.length - 1).id) + 1);
  let content = {}
  let content_target = element.getAttribute(config.args.content);
  if (content_target){
    for (let c of document.getElementsByClassName(content_target)){
      content[c.name || c.id ] = c.value || c.innerText;
    }
  }
  if (document.getElementById(config.message_id) === "undefined" || document.getElementById(config.message_id) === null){
    let notify_elem = element.getAttribute(config.args.msg_container); 
    let root = null;
    if (notify_elem){
      notify_elem = document.getElementById(notify_elem);
      root = ReactDOM.createRoot(notify_elem);
    }else{
      let container = document.createElement("div");
      document.getElementsByTagName("body")[0].appendChild(container);
      root = ReactDOM.createRoot(container);
    }
    // Show a message displaying the message given
    if (element.getAttribute(config.args.message))
      root.render(<Message sly-id={element.getAttribute(config.args.id)}/>);
  }else{
    if(element.getAttribute(config.args.debug))
      console.log("Only one message container is allowed...");
  }
  
  // Slaves are intended to be used when you want to dynamically update content
  let slaves = document.getElementsByClassName(element.getAttribute(config.args.slave));
  // Preparing data json
  data.messageCallback = ()=>{
    throw Error("Component not ready yet... this is possible just if the programmer did something wrong here... contact me at n4b3ts3@gmail.com")
  }
  data.event = data.event.concat({
    "id": element.getAttribute(config.args.id),
    "target": element,
    "url": element.getAttribute(config.args.to),
    "ref": document.getElementById(config.args.ref),
    "slaves": slaves,
    "method": element.getAttribute(config.args.method) || data.event[0].method,
    "content": content,
    "onSubmit": element.getAttribute(config.args.onSubmit) || data.event[0].onSubmit,
    "onAccept": element.getAttribute(config.args.onAccept) || data.event[0].onAccept,
    "onReject": element.getAttribute(config.args.onReject) || data.event[0].onReject,
    "onComplete": element.getAttribute(config.args.onComplete) || data.event[0].onComplete
  });
  data.csrf_header = element.getAttribute(config.args.csrf_header) || "X-CSRFToken";
  data.csrf = element.getAttribute(config.args.csrf) || data.csrf;

  smoothlify.process(element.getAttribute(config.args.id));
  // Mean of hooks targets
  let mean = 0;
  let hook_targets = document.getElementsByClassName(element.getAttribute(config.args.hook_the));
  if (hook_targets.length > 0){
    for (let target of hook_targets){
      mean += target.clientHeight;
    }
    mean = mean/hook_targets.length;

    smoothlify.hook((parseInt(element.getAttribute(config.args.hook_quant)) || 1)*mean);
  }
}

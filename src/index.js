import './index.css';
import data from "./data/data.json";
import config from "./config.json";
import Ajaxify from './Ajaxify'
import reportWebVitals from './reportWebVitals';
import ReactDOM from "react-dom/client";
import Message from "./components/Message.js";

var ajaxify = new Ajaxify();
for (let element of document.getElementsByClassName("ajaxify")){
  element.setAttribute(config.args.comment, null);
  element.setAttribute(config.args.id, parseInt(data.event.at(data.event.length - 1).id) + 1);
  let content = {}
  let content_target = element.getAttribute(config.args.content);
  //console.log(content_target);
  if (content_target){
    for (let c of document.getElementsByClassName(content_target)){
      content[c.name || c.id ] = c.value || c.innerText;
      //console.log(content);
    }
    //console.log(content);
  }
  let notify_elem = element.getAttribute(config.args.msg_container); 
  if (notify_elem){
    notify_elem = document.getElementById(notify_elem);
    let root = ReactDOM.createRoot(notify_elem);
    root.render(<Message axy-id={element.getAttribute(config.args.id)}/>);
  }

  data.event = data.event.concat({
    "id": element.getAttribute(config.args.id),
    "target": element,
    "url": element.getAttribute(config.args.to),
    "ref": document.getElementById(config.args.ref),
    "method": element.getAttribute(config.args.method) || data.event[0].method,
    "content": content,
    "onSubmit": element.getAttribute(config.args.onSubmit) || data.event[0].onSubmit,
    "onAccept": element.getAttribute(config.args.onAccept) || data.event[0].onAccept,
    "onReject": element.getAttribute(config.args.onReject) || data.event[0].onReject,
    "onComplete": element.getAttribute(config.args.onComplete) || data.event[0].onComplete
  });
  data.csrf_header = element.getAttribute(config.args.csrf_header) || "X-CSRFToken";
  data.csrf = element.getAttribute(config.args.csrf) || data.csrf;
 
  ajaxify.process(element.getAttribute(config.args.id));
  // Mean of hooks targets
  let mean = 0;
  let hook_targets = document.getElementsByClassName(element.getAttribute(config.args.hook_the));
  if (hook_targets.length > 0){
    for (let target of hook_targets){
      mean += target.clientHeight;
    }
    mean = mean/hook_targets.length;
  
    //console.log(mean);
    //console.log((parseInt(element.getAttribute(config.args.hook_quant)) || 1));
    ajaxify.hook((parseInt(element.getAttribute(config.args.hook_quant)) || 1)*mean);
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import './App.css';
import data from "./data/data.json";
import config from "./config.json";
import {network} from './core/network';
import loader from './media/loader.gif';
import SlyLanguage from './sly_language/index';
import ReactDOM from "react-dom/client";
import Message from "./components/Message.js";

var is_message_set = false;

/**
 * Smoothlify main class
 */
export class Smoothlify {

  constructor(){
    this.targets = [];
    this.hookOffset = 0;
    this.hookHeight = 0;
    this.hookROffset = 0;
    this.lastPosition = 0;
    this.skeleton = "";
    this.hookPosition = null;
    this.lastTriggerElement = null;
    this.hookEnabled = false;
    this.errorCounter = 0;
    this.stack = [];
    this.temp_loader = null;
    this.state = {
      "loading": false,
    };
  }

  setHookOffset(offset, height){
    this.hookOffset = offset;
    this.hookHeight = height;
    this.calcRealOffset(offset, height);
  }

  calcRealOffset(offset, height){
    this.hookROffset = offset * height;
  }

  increaseOffset(value){
    this.calcRealOffset((this.hookOffset + value), this.hookHeight);
  }

  getOffset(){
    return this.hookROffset;
  }
  
  end(){
    this.stack = [];
  }

  startHook(parent){
    let interval = parseInt(parent.getAttribute(config.args.hook_interval));
    if (isNaN(interval) || interval < 500)
      interval = 500;
    let intervalId = setInterval(()=>{
      if (this.stack.length !== 0){
        if (!this.hookEnabled){
          this.cleanupFunction(parent);
          clearInterval(intervalId);
          return;
        }
        let function_skel = this.stack.shift();
        function_skel.method.call(this, ...function_skel.args);
      }
    }, interval);
    return 
  }

  makeElement(parent, skeleton){
    // Build body
    let temp = document.createElement("div");
    let src_regex = new RegExp("src=('|\"){1}.*%[a-zA-Z0-9]+%.*('|\"){1}");
    let common_regex = new RegExp("%[a-zA-Z0-9]+%");
    while(skeleton.search(src_regex) >= 0){
      skeleton = skeleton.replace(src_regex, "src='image/not_given' alt='no data'")
    }
    while(skeleton.search(common_regex) >= 0){
      skeleton = skeleton.replace(common_regex, "no data");
    }
    temp.innerHTML = skeleton;
    temp.children[0].classList.toggle("sly-item", true);
    let element = temp.children[0];
    parent.appendChild(element);
    for (let sly of element.getElementsByClassName(config.name)){
      recompute(sly);
    }
  }

  cleanupFunction (parent, ){
    // remove loaders
    for (let loader of parent?.getElementsByClassName(config.sly_loader)){
      loader.remove();
    }
  }
  createElement(parent, value){
    let temp_skeleton = this.skeleton;
    for(let key of Object.keys(value)){
      let skel_search = "%" + key + "%";
      while(temp_skeleton.search(skel_search) >= 0)
        temp_skeleton = temp_skeleton.replace(skel_search, value[key]);
    }
    this.makeElement(parent, temp_skeleton);
    this.increaseOffset(parent.getAttribute(config.args.hook_offset) || 0);
    if (value["%signal%"] === "%.%"){
      this.hookEnabled = false;
    }
  }
  
  sendFunction(parent, url, exec_at_finally) {
    network.sendData(url, 
      parent.getAttribute(config.args.method) || "POST")
      .then(async (response, reject)=>{
        if (response.ok){
          try{
            await response.text().then((value)=>{
              try{
                value = JSON.parse(value);
                if ("%sly%" in Object.keys(value)){
                  let sly = new SlyLanguage(value["%sly%"]);
                  sly.run();
                  for (let snapshot of sly.snapshots()){
                    this.createElement(parent, snapshot);
                  }
                }else{
                  this.createElement(parent, value);
                }
              }catch(err){
                // In order to avoid an error loop
                this.errorCounter += 1;
                if (this.errorCounter > 3){
                  this.hookEnabled = false;
                }
              }
            })
          }catch(err){ /* ignored */ }
        }
        exec_at_finally();
        //this.cleanupFunction(parent);
    });
  }

  urlBuilder(parent){
    let start_at = parent.getAttribute(config.args.hook_start_at);
    let url = parent.getAttribute(config.args.to);
    if (!parent.getAttribute(config.args.hook_use_raw_url)){
      if (this.hookPosition !== null){
        this.hookPosition += 1;
      }
      else if (!start_at){
        this.hookPosition = 0;
      }else{
        this.hookPosition = parseInt(start_at);
      }
      if (parent.hasAttribute(config.args.hook_position_like_get)){
        if (url.indexOf("?") >= 0)
          url = url.concat("&");
        else
          url = url.concat("?");
        url = url.concat("sly-position=" + this.hookPosition);
      }else{
        url = url.concat(url[url.length - 1] !== "/"?"/":"", this.hookPosition);
        if(parent.getAttribute(config.args.hook_append_slash_url)){
          url += "/";
        }
      }
    }
    return url;
  }

  addLoaders(parent){
    if (!this.state["loading"]){
      this.temp_loader.remove();
      for (let i=0; i < parent.getAttribute(config.args.hook_quant); i++){
        let temp = document.createElement("div");
        let img_regex = new RegExp("<img .* src=('|\"){1}.*%[a-zA-Z0-9]+%.*('|\"){1}")
        let sk_temp = this.skeleton.replace(img_regex, "<img style='width:50px; aspect-ratio: 1;' src='" + loader +"' alt='loading image...'");
        while(sk_temp.search(img_regex) >= 0){
          sk_temp = sk_temp.replace(img_regex, "<img style='width:50px; aspect-ratio: 1;' src='" + loader +"' alt='loading image...'");
        }
        let common_regex = new RegExp("%[a-zA-Z0-9]+%");
        while(sk_temp.search(common_regex) >= 0){
          sk_temp = sk_temp.replace(common_regex, "#loading...");
        }
        temp.innerHTML = sk_temp;
        temp.children[0].classList.toggle(config.sly_loader);
        parent.appendChild(temp.children[0]);
      }
      parent.appendChild(this.temp_loader);
    }
  }

  // Hoook an element with scroll position...
  /* Lets say the user give us 
    <div> 
      <h2>%title%</h2>
      <img src="%img%"/>
      <div>%description%</div>
    </div> 
    The previous is going to be our skeleton so given that skeleton we are going to append 
    to the parent one children with all %bones% replaced by its respectives json values, for example
    {
      "title": "my title",
      "img": "https://super.image",
      "description": "my description",
    } 
  */
  async hook(parent){
    window.scrollTo({
      "top": 0,
      "behavior": "smooth"
    });
    this.hookEnabled = true;
    this.temp_loader = document.createElement("div");
    this.temp_loader.id = "sly-temp-loader";
    this.temp_loader.style.width = "100%";
    this.temp_loader.style.clear = "both";
    this.temp_loader.style.display = "flex";
    this.temp_loader.style.alignItems = "center";
    this.temp_loader.style.justifyContent = "center";
    this.temp_loader.innerHTML = "<img alt='loading...' src='" + 
      loader + "'></img>";
    parent.appendChild(this.temp_loader);
    this.startHook(parent);

    let exec_at_finally = (event,) => {
      this.temp_loader.remove();
      let temp_el = parent.children[parent.children.length - 1];
      if (!this.hookEnabled){
        this.cleanupFunction(parent);
        if (event)
          document.removeEventListener("scroll", event);
      }else{
        parent.appendChild(this.temp_loader);
      }
      if (temp_el)
        this.lastPosition =  temp_el.offsetTop - temp_el.clientHeight; // adjust last position according to 
      // resulting last element offset top to avoid a hook position which hangs the hook event

    };

    let prefetchAmount = parseInt(parent.getAttribute(config.args.hook_prefetch));
    if (!isNaN(prefetchAmount) && prefetchAmount > 0){
      for(let i=0; i < prefetchAmount; i++){
        this.skeleton = parent.getAttribute(config.args.hook_skeleton);
        let url = this.urlBuilder(parent);
        this.stack.push({
          method: this.sendFunction,
          args: [parent, url, exec_at_finally]
        });
      }
    }
    if (this.hookEnabled)
      document.addEventListener("scroll", (event)=>{
        let scrollPosition = window.scrollY + window.screen.availHeight;
        
        let parentOffsetTop = parent.children.length > 0 ? parent.children[parent.children.length - 1].offsetTop : parent.offsetTop;
        
        if (scrollPosition >= (parentOffsetTop - this.getOffset())
          && scrollPosition >= this.lastPosition) // Normalize the value
        {
          this.lastPosition = scrollPosition; // set preventive last position in order to avoid event loop
          if (!this.hookEnabled){
            return;
          }
          // Get the json response from backend
          /* Loader principle */
          this.skeleton = parent.getAttribute(config.args.hook_skeleton);
          // sends data and process received data if there is such...
          let url = this.urlBuilder(parent);
          
          this.stack.push({
            method: this.sendFunction,
            args: [parent, url, exec_at_finally.bind(this, ...[event])]
          });
        }
      })
  }

  static find(id){
    return Smoothlify.findEvent(id)?.target;
  }

  static findEvent(id){
    let pointer = 0;
    id = parseInt(id);
    while(true){
      let temp = data.event[id + pointer];
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

  process(target){
    if (!target || target.hasAttribute(config.args.hook)) return;
    target.title = target.getAttribute(config.args.to) || "undefined";
    let targetType = target.nodeName.toLowerCase();
    let event = "click";
    let handler = async (e) => {
      e.preventDefault();
      if (e.target.hasAttribute(config.args.disabled)) return;
      e.target.setAttribute(config.args.disabled, true);
      let t = e.target.style.cursor;
      e.target.style.cursor = "wait";
      network.commit(
        Smoothlify.findEvent(e.target.getAttribute(config.args.id)),
        ()=>{
          e.target.style.cursor = t;
          e.target.removeAttribute(config.args.disabled);
      });
    };
    
    if(targetType === "input"){
      event = "input";
      target?.addEventListener(event, handler);
      event = "change";
      target?.addEventListener(event, handler);
    } else {
        event = "click";
        target?.addEventListener(event, handler);
    }
    this.targets.push(target);
  }
}
export var smoothlify = new Smoothlify();

export function recompute(element){
  element.setAttribute(config.args.id, parseInt(data.event.at(data.event.length - 1).id) + 1);
  let content = {};
  let content_target = element.getAttribute(config.args.content);
  if (content_target){
    for (let c of document.getElementsByClassName(content_target)){
      content[c.name || c.id ] = c.value || c.innerText;
    }
  }
  if (!document.getElementById(config.message_container_id)){
    let notify_elem = element.getAttribute(config.args.msg_container); 
    let root = null;
    if (notify_elem){
      notify_elem = document.getElementById(notify_elem);
      root = ReactDOM.createRoot(notify_elem);
    }else{
      let msg_container = document.createElement("div");
      msg_container.id = config.message_container_id;
      document.getElementsByTagName("body")[0].appendChild(msg_container);
      root = ReactDOM.createRoot(msg_container);
    }
    // Show a message displaying the message given
    if ((element.getAttribute(config.args.message) && !is_message_set) || !is_message_set){
      root.render(<Message />);
      is_message_set = true;
    }
  }
  
  // Slaves are intended to be used when you want to dynamically update content
  let slaves = document.getElementsByClassName(element.getAttribute(config.args.slave));
  // Preparing data json
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
  smoothlify.process(element);
};
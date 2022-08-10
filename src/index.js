import './index.css';
import data from "./data/data.json";
import config from "./config.json";
import { smoothlify, recompute } from './Smoothlify.js'

data.messageCallback = () => {
  throw Error("Message component not ready yet... this is possible just if the programmer did something wrong here... contact me at n4b3ts3@gmail.com")
}

export var init = () => {
  for (let element of document.getElementsByClassName(config["name"])){
  //element.setAttribute(config.args.comment, null);
  if (!element.hasAttribute(config.args.hook)){
    recompute(element);
  }else{
    // Mean of hooks targets
    let mean = 0;
    let hook_targets = document.getElementsByClassName(element.getAttribute(config.args.hook_the));
    if (hook_targets && hook_targets.length > 0){
      for (let target of hook_targets){
        mean += target.clientHeight;
      }
      mean = mean/hook_targets.length;
    }
    smoothlify.setHookOffset(parseInt(element.getAttribute(config.args.hook_quant) || 0), mean);
    smoothlify.hook(element);
  }
  }
}
init();
import data from "../data/data.json";
//import config from "../config.json";
import Ajaxify from "../Ajaxify.js";
//import ReactDOM from "react-dom/client";

export default class Network{
    //constructor(){
      //console.log(data)
    //}
    
    async commit(id, onComplete){
      let headers = {};
      headers[data.csrf_header] = data.csrf;
      headers["Content-Type"] = data["Content-Type"];
      let event = Ajaxify.findEvent(id);
      if (!event) return onComplete();
      //console.log(event);
      // eslint-disable-next-line
      eval(event?.onSubmit)(event?.target);
      if (event?.messageCallback)
        event.messageCallback();
      //console.log(event.messageCallback);
      //console.log(event.content);
      return fetch(event?.url,{
            headers: headers,
            method: event.method,
            body: JSON.stringify(event.content),
            mode: "same-origin",
        }).then((response, reject)=>{
          if(response.ok){
            response.text().then((data)=>{
              // eslint-disable-next-line
              eval(event.onAccept)(event.target);
            });
          } else {
            // eslint-disable-next-line
            eval(event.onReject)(event.target);
            // TODO: Show error message 
          }
        })
        .catch((reason)=>{
          // eslint-disable-next-line
          eval(event.onReject)(event.target);
        }).finally(()=>{
          // eslint-disable-next-line
          eval(event.onComplete)(event);
          onComplete();
        }); 
    }
}

import data from "../data/data.json";
import config from "../config.json";
//import config from "../config.json";
import Smoothlify from "../Smoothlify";
//import ReactDOM from "react-dom/client";

export default class Network{
    isDict(obj) {
      if (typeof obj === "object" && obj !== null)
        return (
          Object.getPrototypeOf({}) === Object.getPrototypeOf(obj)
        );
      return false;
    }
    find(data, key){
      for (let k of Object.keys(data)){
        if (k === key){
          return data[k];
        }
        if (this.isDict(data[k])){
          return this.find(data[k], key);
        }
      }
    }

    async commit(id, onComplete){
      let headers = {};
      headers[data.csrf_header] = data.csrf;
      headers["Content-Type"] = data["Content-Type"];
      let event = Smoothlify.findEvent(id);
      if (!event) return onComplete();
      //console.log(event);
      // eslint-disable-next-line
      eval(event?.onSubmit)(event?.target);
      if (data.messageCallback)
        data.messageCallback(1, event.target.getAttribute(config.args.message_loading) || "Enviando datos al servidor, por favor espera una respuesta");
      
      return fetch(event?.url,{
            headers: headers,
            method: event.method,
            body: JSON.stringify(event.content),
            mode: "same-origin",
        }).then((response, reject)=>{
          if(response.ok){
            console.log("Who in the hell are you?!!" + data.messageCallback);
            if (data.messageCallback)
                data.messageCallback(1, event?.target?.getAttribute(config.args.message) || "Los datos se enviaron correctamente");
            // Get the response in json format others format are not allowed cause 
            response.json().then((data)=>{
              // Getting the on accept method
              // eslint-disable-next-line
              eval(event.onAccept)(event.target, data);
              // Getting slaves 
              for (let slave of event.slaves){
                slave.innerText = this.find(data, event.target.getAttribute(config.args.slave_cause));
              }
              // Getting targets 
              let targets = event.target.getAttribute(config.args.slave_targets);
              if (targets)
                targets = targets.split(" ");
              else
                targets = []
              for (let target of targets){
                for(let targetElement of document.getElementsByClassName(target)){
                  let operateFunction = targetElement.getAttribute(config.args.slave_operate);
                  let operation = null;
                  if (operateFunction){
                    // eslint-disable-next-line
                    operation = eval(operateFunction);
                    let args = targetElement.getAttribute(config.args.slave_listens).split(" ");
                    let argv = [];
                    for (let arg of args){
                      argv.push(this.find(data, arg));
                    }
                    operation = operation(argv);
                  }
                  if (operation !== null)
                    targetElement.innerText = operation;
                  else
                    targetElement.innerText = this.find(data, targetElement.getAttribute(config.args.slave_listen));
                }
              }
            });
          } else {
            if (event.onReject)
              // eslint-disable-next-line
              eval(event.onReject)(event.target);
            if (data.messageCallback)
              data.messageCallback(3, event.target.getAttribute(config.args.message_error) || "Algo malo ocurrio, no pudimos efectuar la peticion debidamente, sentimos las molestias ocasionadas")
            // TODO: Show error message 
          }
        })
        .catch((reason)=>{
          if (event.onReject)
            // eslint-disable-next-line
            eval(event.onReject)(event.target);
          if (data.messageCallback)
              data.messageCallback(3, event.target.getAttribute(config.args.message_error) || "Algo malo ocurrio, no pudimos efectuar la peticion debidamente, sentimos las molestias ocasionadas")
        }).finally(()=>{
          // eslint-disable-next-line
          eval(event.onComplete)(event);
          onComplete();
        }); 
    }
}

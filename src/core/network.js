import data from "../data/data.json";
import config from "../config.json";
//import config from "../config.json";
// import Smoothlify from "../Smoothlify";
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
    /**
     * Sends data to backend
     * @param url The url where it should post data (Required)
     * @param headers The HTTP headers for sending data
     * @param method The HTTP method for sending data
     * @param content The content of the data send it if undefined no data is send
     */
    sendData(url, method, content){
      let headers = {};
      if (method.toLowerCase() !== "get")
        headers[data.csrf_header] = data.csrf;
      headers["Content-Type"] = data["Content-Type"];
      headers['X-Requested-With'] = 'XMLHttpRequest';
      let init = {
        headers: headers,
        method: method,
        mode: "same-origin", //mode: "no-cors",//mode: "same-origin",
      }
      if(content)
        try{
          init["body"] = JSON.stringify(content);
        }catch{
          console.error("Cannot stringify content, no body will be sent but all other data were sent");
        }
      
      return fetch(url, init); 
    }

    async commit(event, onComplete){
      if (!event) return onComplete();
      // eslint-disable-next-line
      eval(event.onSubmit)(event.target);
      if (data.messageCallback)
        data.messageCallback(1, event.target.getAttribute(config.args.message_loading) || "Enviando datos al servidor, por favor espera una respuesta");
      return this.sendData(
        event.url,
        event.method,
        event.content ? JSON.stringify(event.content): undefined
      ).then((response, reject)=>{
        if(response.ok){
          if (data.messageCallback)
              data.messageCallback(1, event.target?.getAttribute(config.args.message) || "Los datos se enviaron correctamente");
          // Get the response in json format others format are not allowed cause 
          try{
            response.json().then((data)=>{
              // Getting the on accept method
              if (event.onAccept)
                // eslint-disable-next-line
                eval(event.onAccept)(event.target, data);
              if (event.slaves)
                // Getting slaves 
                for (let slave of event.slaves){
                  slave.innerText = this.find(data, event.target?.getAttribute(config.args.slave_cause));
                }
              // Getting targets 
              let targets = event.target?.getAttribute(config.args.slave_targets) || false;
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
              return data;
            }).catch((error)=>{
              return error;
            });
          }catch(TypeError){
            console.error("The received data is not in json format... Smoothlify doesnt support not json responses...")
            return null;
          }
        }else{
          reject();
        }
      })
      .catch((reason)=>{
        if (event.onReject)
          // eslint-disable-next-line
          eval(event.onReject)(event.target);
        if (data.messageCallback)
            data.messageCallback(3, event.target.getAttribute(config.args.message_error) || "Algo malo ocurrio, no pudimos efectuar la peticion debidamente, sentimos las molestias ocasionadas")
        return null;
      }).finally(()=>{
        if (event.onComplete)
          // eslint-disable-next-line
          eval(event.onComplete)(event.target);
        if (onComplete)
          onComplete();
      })
    }
}

export var network = new Network();

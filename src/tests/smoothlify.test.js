import {render, screen, act} from '@testing-library/react';
import Smoothlify from '../Smoothlify';
import data from '../data/data.json';

import '../index.css';
import config from "../config.json";
import ReactDOM from "react-dom/client";
import Message from "../components/Message.js";
import TestComponent  from "./component.test";

test("test find by id", () => {
    for (let i=1; i <= 30; i++){
        let element = document.createElement("div");
        element.id = "element-no".concat(i)
        data.event.push({
            "id": i,
            "target": element,
            "url": "",
            "ref": "",
            "method": "POST",
            "content": {
            },
            "slaves": [],
            "messageCallback": null,
            "onSubmit": "(element)=>{console.log('Submit')}",
            "onAccept": "(element)=>{console.log('Accept')}",
            "onReject": "(element)=>{console.log('Reject')}",
            "onComplete": "(element)=>{console.log('Complete')}"
        });
    }
    let event = Smoothlify.findEvent(1);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(2);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(3);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(4);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(5);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(6);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(7);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(8);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(9);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(10);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(11);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(12);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(13);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(14);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(15);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(16);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(17);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(18);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(19);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(20);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(21);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(22);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(23);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(24);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(25);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(26);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(27);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(28);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(29);
    console.log(event.target.id);
    expect(event).toBeDefined();
    event = Smoothlify.findEvent(30);
    console.log(event.target.id);
    expect(event).toBeDefined();
});

test("test rendering only one message container", () => {
    let result = render(<TestComponent/>);
    let t = result.container.getElementsByClassName("smoothlify");
    expect(t.length).toBeGreaterThan(0); // test we are using smoothlify
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
        if (!document.getElementById(config.message_id)){
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
            // Test update here...
            if (element.getAttribute(config.args.message))
                act(()=>root.render(<Message sly-id={element.getAttribute(config.args.id)}/>));
        }else{
            if(element.getAttribute(config.args.debug))
                console.log("Only one message container is allowed...");
        }
        
        // Slaves are intended to be used when you want to dynamically update content
        let slaves = document.getElementsByClassName(element.getAttribute(config.args.slave));
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
    const messageContainers = document.getElementById("sly-message");
    expect(messageContainers).toBeTruthy();
    const closeBtnOnly1 = document.getElementsByClassName("sly-msg-close");
    expect(closeBtnOnly1.length).toBe(1);
    expect(document.getElementsByTagName("body")[0].children.length).toBe(2);
});


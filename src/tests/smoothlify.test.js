import {render, screen, act} from '@testing-library/react';
import {Smoothlify} from '../Smoothlify.js';
import data from '../data/data.json';

import '../index.css';
import { init } from '../index.js';
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
    for (let i=0; i < 30; i++){
        let event = Smoothlify.findEvent(i);
        expect(event).toBeDefined();
    }
});



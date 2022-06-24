import { render } from "@testing-library/react";
import React from "react";
import Message from "../components/Message";

export default class TestComponent extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
        <>
            <div className="smoothlify" sly-debug="true" sly-msg="Se ha anadido producto N al carrito"/>
            <button className="smoothlify" sly-debug="true" sly-msg="Se ha anadido producto N al carrito" sly-to="http://localhost:8000/cart/add/0/" sly-csrf="" >asd</button>
            <a className="smoothlify" sly-debug="true" sly-to="http://localhost:8000/cart/add/0/" sly-csrf="">asd</a>
            <div id="elementId"></div>
        </>
        )
    }
}

test("it renders", ()=>{
    let result = render(<TestComponent />);
    expect(result).toBeTruthy();
})
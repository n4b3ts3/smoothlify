import { render, screen } from '@testing-library/react';
import SlyLanguage from '../sly_language/';

test("Sly language builtins", async ()=>{
    let json = {
        "%sly%": "\n\
        namespace my_api_key # enclose your script in a namespace by using an api_key\n\
        from 127.0.0.1 import test.intercloud. as ic using HTTP.GET with { '_port': 8000, 'index': 'sly-position' }\
         # import resources from http://localhost:8000/test/intercloud/\n\
        # Comment alone in the dark\n\
        for data in ic.niter # fetch until 404 or 500\n\
            snapshot(data) # returns to the interpreter a snapshot with given data\n\
        "
    }
    let sly = new SlyLanguage(json["%sly%"]);
    await sly.run();
    expect(sly).toBeTruthy();
  });
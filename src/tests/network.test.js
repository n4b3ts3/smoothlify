import { render, screen } from '@testing-library/react';
import {network} from '../core/network';
// import {Smoothlify} from '../Smoothlify';
/*
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
*/

test("isDict it works", ()=>{
  let type = network.isDict({
    "key1": "value1",
  });
  expect(type).toBeTruthy();
});

test("isDict works with other types?", ()=>{
  let type = network.isDict("Hola");
  expect(type).toBeFalsy();
  type = network.isDict(["Hola", "asd"]);
  expect(type).toBeFalsy();
  type = network.isDict(1);
  expect(type).toBeFalsy();
  type = network.isDict(undefined);
  expect(type).toBeFalsy();
  type = network.isDict(null);
  expect(type).toBeFalsy();
})

test("find it works", ()=>{
  let findResponse = network.find({
    "data": {
      "other": "something",
      "another": {
        "key1": "value1"
      }
    }
  }, "key1");
  expect(findResponse).toBe("value1");
});

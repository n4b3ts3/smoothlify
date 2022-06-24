import { render, screen } from '@testing-library/react';
import Network from '../core/network';
import Smoothlify from '../Smoothlify';
/*
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
*/
test("isDict it works", ()=>{
  let type = new Network().isDict({
    "key1": "value1",
  });
  expect(type).toBeTruthy();
});
test("isDict works with other types?", ()=>{
  let type = new Network().isDict("Hola");
  expect(type).toBeFalsy();
  type = new Network().isDict(["Hola", "asd"]);
  expect(type).toBeFalsy();
  type = new Network().isDict(1);
  expect(type).toBeFalsy();
  type = new Network().isDict(undefined);
  expect(type).toBeFalsy();
  type = new Network().isDict(null);
  expect(type).toBeFalsy();
})

test("find it works", ()=>{
  let findResponse = new Network().find({
    "data": {
      "other": "something",
      "another": {
        "key1": "value1"
      }
    }
  }, "key1");
  expect(findResponse).toBe("value1");
});

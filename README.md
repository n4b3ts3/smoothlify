[![StandWithUkraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md)
[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://vshymanskyy.github.io/StandWithUkraine/)

# DISCLAIMER
This script doesnt use ajax for anything, it was made using React...

# ABOUT
The objetive of this package is to provide an easy way for interact with the backend and request new information without reloading
the website

# USAGE
## Critical configuration
As was previously mentioned <b>smoothlify</b> pretends to provide an easier way to communicate with backend in scenarios where we need to fetch some data to update the GUI, because of that we will need to provide <b>smoothlify</b> with the next arguments:
* class="smoothlify" // In order to find all elements that will use this module
* sly-to // Where does the posts requests are directed to
* sly-csrf // This needs only to be provided once during the app
for communicate with backend using Cross Site Request Forgery tokens

## How to use
Lets say we have a div container as follows:
```html
<div class="smoothlify"
  sly-to="https://mybackend.com"
  sly-csrf="{{csrf_token}}"
>
</div>
```
In the previous example we defined a div container which on click send a request to an url in the backend using post, some of you may wonder why we do not need to declare the header's name of the csrf token... Well, thing is that for django framework the above configuration is enough, for others frameworks please add the <i>sly-csrf-name</i> 
## Cascade download 
Download progressively information from backend to update the GUI on a smoothly way...
For the previous mentioned behavoiur <b>smoothlify</b> provides a subset of tools all of its starts with <i>sly-hook</i> word and indicate the point of hooking the GUI, the meaning of this is that when the scroll reach that position it will trigger a POST request or GET depending on the configuration, asking for data to the backend.
## Attributes
* sly-hook-the // Indicates that this element will be used as the hook counter element.
* sly-hook-quant // Indicate how many elements are going to be ignored

### Notes:
A hook counter element is an element or a group of elements which are utilized for counting how many items will be ignored before triggering the hook action. For example lets say we have a group of 20 elements (cards) each one of 20px height, so you say you want to ignore 5 elements then here the hook counter element is the unit meaning that the group is 20, and the hook 1, so it represents 1/20 units.
## How to use
First create an element let's say:
```html
<div sly-comment="(add all criticals attributes plus those you want to add extra)" 
  sly-hook-the="elementClass"
  sly-hook-quant="2">
</div>
```
#### Note: We used here the attribute <i>sly-comment</i>, that IS NOT a real comment so adding so much of those comments can slow down the app, please use HTML comments instead... 

In the example above we had selected <i>elementClass</i> as the <b>hook counter element (hce)</b> and also set the quantity of elements before triggering to 2, so the behaviour will be as follows:

1. The user scroll the page
2. Once the user reach the element with class <b><i>smoothlify</i></b> and attribute <b>sly-hook-the</b> it will going to trigger the event if <b>sly-hook-quant</b> is equal to <b><i>1</i></b> meaning that no offset is set, but if instead the <b>sly-hook-quant</b> is higher  than 1 then the offset of the trigger event is calculated as follow : 
    ```js
    // Assume slyElement is the element with class set to smoothlify
    let hooked = slyElement.getAttribute("sly-hook-the")
    let hookedElements = document.getElementsByClassName(hooked);
    // a mean calculation is made here, omitted for rezume
    let offset = meanHeight * slyElement.getAttribute("sly-hook-quant")
    ```
## Slave component
This allows you to make one component content dependent of what the server is sending back.
```html
<div class="slave">
  <!--This container is a slave container meaning that is innerText is going to be updated automatically -->
</div>
<div class="smoothlify" 
  sly-to="https://server.com/api" 
  sly-slave="slave"
  sly-slave-targets="class1 class2 class3"
  sly-cause="data">
</div>
<div class="class1" sly-listen="api_data">
</div>
<div class="class2" sly-listen="api_data">
</div>
<div class="class3" sly-listen="api_data">
</div>
```
When data is fetched:
 ```js
 let slaves = document.getElementsByClassName(target.getAttribute("sly-slave"));
 for (let slave of slaves){
   slave.innerText = response.json()[target.getAttribute("sly-cause")]
 }
```
Another way of using slaves is:
```html
<div
  class="slave-target-class"
  sly-slave-listens="quantity price"
  sly-slave-operate="(a, b)=>{
      return a*b;
  }"
>
</div>
```
## Extra configurations
Attributes listed here arent required but can help you in order to some things...

* sly-use-content // A class name that is linked to each element in the website which must have declared at least 1 name or 1 id for function correctly, the name will be the key in the request json body and the value or innerText will be the value 
* sly-method // The request method to be used (EXPERIMENTAL YET)
* sly-disabled // Make this button useless
* sly-msg-cont // A container id for displaying a message on the website when some action is performed, for example adding an element to a shop cart
* sly-msg-loading // The message to be shown when the onclick event is trigger but not data has been yet received
* sly-msg // The message to be shown when the onclick event is trigger and data is successfully received, if sly-msg-cont is not set the use body as parent
* sly-msg-error // The message to be received when an error ocurred in the backend processing
* sly-lvl // The level of importance of the message (EXPERIMENTAL YET)
* sly-ctr // NOT IMPLEMENTED YET
* sly-type // NOT IMPLEMENTED YET
* sly-icon // NOT IMPLEMENTED YET
* sly-alert // NOT IMPLEMENTED YET
* sly-on-submit // Triggered when the button is clicked
* sly-on-accept // Triggered if the backend returns 200
* sly-on-reject // Triggered if the backend doesnt returns 200
* sly-on-complete // Triggered always after the response
* sly-lang // NOT IMPLEMENTED YET

# Author
This script was made by Esteban Chacon Martin
# Grammar
Any grammaticar error in this readme or in any part of the code, please open an issue pointing to the error... And thanks for helping me to improve my english skills :)
# License
GNU PUBLIC LICENSE https://www.gnu.org/licenses/gpl-3.0.en.html

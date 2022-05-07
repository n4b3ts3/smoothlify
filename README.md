[![StandWithUkraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md)
[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://vshymanskyy.github.io/StandWithUkraine/)
# DISCLAIMER
This script doesnt use ajax for anything, it was made using React...

# ABOUT
The objetive of this package is to provide an easy way for interact with the backend and request new information without reloading
the website

# USAGE
## Critical configuration
As was previously mentioned <b>ajaxify</b> pretends to provide an easier way to communicate with backend in scenarios where we need to fetch some data to update the GUI, because of that we will need to provide <b>ajaxify</b> with the next arguments:
*class="ajaxify" // In order to find all elements that will use this module
*axy-to // Where does the posts requests are directed to
*axy-csrf // This needs only to be provided once during the app
for communicate with backend using Cross Site Request Forgery tokens

## How to use
Lets say we have a div container as follows:
```html
<div class="ajaxify"
  axy-to="https://mybackend.com"
  axy-csrf="{{csrf_token}}"
>
</div>
```
In the previous example we defined a div container which on click send a request to an url in the backend using post, some of you may wonder why we do not need to declare the header's name of the csrf token... Well thing is that for django framework the above configuration is enough, for others frameworks please add the <i>axy-csrf-name</i> 
## Cascade download 
Download progressively information from backend to update the GUI on a smoothly way...
For the previous mentioned behavoiur <b>ajaxify</b> provides a subset of tools all of its starts with <i>axy-hook</i> word and indicate the point of hooking the GUI, the meaning of this is that when the scroll reach that position it will trigger a POST request or GET depending on the configuration, asking for data to the backend.
## Attributes
* axy-hook-the // Indicates that this element will be used as the hook counter element.
* axy-hook-quant // Indicate how many elements are going to be ignored

### Notes:
A hook counter element is an element or a group of elements which are utilized for counting how many items will be ignored before triggering the hook action. For example lets say we have a group of 20 elements (cards) each one of 20px height, so you say you want to ignore 5 elements then here the hook counter element is the unit meaning that the group is 20, and the hook 1, so it represents 1/20 units.
## How to use
First create an element let's say:
```html
<div axy-comment="(add all criticals attributes plus those you want to add extra)" 
  axy-hook-the="elementClass"
  axy-hook-quant="2">
</div>
```
#### Note: We used here the attribute <i>axy-comment</i>, that IS NOT a real comment so adding so much of those comments can slow down the app, please use HTML comments instead... 

## Extra configurations
Attributes listed here arent required but can help you in order to some things...

* axy-use-content // A class name that is linked to each element in the website which must have declared at least 1 name or 1 id for function correctly, the name will be the key in the request json body and the value or innerText will be the value 
* axy-method // The request method to be used (EXPERIMENTAL YET)
* axy-disabled // Make this button useless
* axy-msg-cont // A container id for displaying a message on the website when some action is performed, for example adding an element to a shop cart
* axy-msg // The message to be shown when the onclick event is trigger, useless without axy-msg-cont
* axy-lvl // The level of importance of the message (EXPERIMENTAL YET)
* axy-ctr // NOT IMPLEMENTED YET
* axy-type // NOT IMPLEMENTED YET
* axy-icon // NOT IMPLEMENTED YET
* axy-alert // NOT IMPLEMENTED YET
* axy-on-submit // Triggered when the button is clicked
* axy-on-accept // Triggered if the backend returns 200
* axy-on-reject // Triggered if the backend doesnt returns 200
* axy-on-complete // Triggered always after the response
* axy-lang // NOT IMPLEMENTED YET

# Author
This script was made by Esteban Chacon Martin
# Grammar
Any grammaticar error in this readme or in any part of the code, please open an issue pointing to the error... And thanks for helping me to improve my english skills :)
# License
GNU PUBLIC LICENSE https://www.gnu.org/licenses/gpl-3.0.en.html

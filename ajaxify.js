
// List of constants data
const notify_div_name = "godjango-alert";
const ajaxify_adds = "ajaxify-add";
const ajaxify_csrf = "ajaxify-csrf";
const ajaxify_ref_to = "ajaxify-ref-to";
const ajaxify_to = "ajaxify-url";
const ajaxify_message = "ajaxify-message";
const ajaxify_level = "ajaxify-level";
const ajaxify_container = "ajaxify-container";
const ajaxify_container_type = "ajaxify-container-type";
const godjango_alert_icon = "godjango-alert-icon";

// Data 
const languages = {
    "en": {
        "not_error": "Oops something went wrong, please try again later.",
    },
    "es": {
        "not_error": "Ups algo malo ha ocurrido por favor intentelo más tarde.",
    }
}
const godjango_alert = document.getElementById(notify_div_name);
var ajaxify = {
    csrf: "",
}
// Ajaxify
for (let element of document.getElementsByClassName(ajaxify_adds)){
    if (element.getAttribute(ajaxify_csrf) !== undefined &&
        element.getAttribute(ajaxify_csrf) !== null &&
        ajaxify.csrf !== element.getAttribute(ajaxify_csrf))
        ajaxify.csrf = element.getAttribute(ajaxify_csrf)
    element.style.cursor = "pointer";
    element.addEventListener("click", (event)=>{
        let unlocker = lockAjaxify(element);
        let content = {};
        let ajaxcontent = element.getAttribute("ajaxify-content");
        if( ajaxcontent !== null &&
            ajaxcontent !== undefined){
            ajaxcontent = ajaxcontent.split(" ");
            for (let cont of ajaxcontent){
                for(let el of document.getElementsByClassName(cont)){
                    content[el.id] = el.value;
                }
            }
        }
        content = JSON.stringify(content);
        let headers = {};
        headers["X-CSRFToken"] = element.getAttribute(ajaxify_csrf) || ajaxify.csrf;
        headers["Content-Type"] = 'application/json';
        let refContent = getRefValue(element.getAttribute(ajaxify_ref_to));
        fetch(element.getAttribute(ajaxify_to).concat(
            refContent ? refContent + "/" : ""
        ), {
            method: "post",
            body: content,
            headers: headers,
            mode: "same-origin"
        }).then((response, reject)=>{
            if(response.ok){
                showMessage(element.getAttribute(ajaxify_message))(element.getAttribute(ajaxify_level));
                response.text().then((data)=>{
                    try{
                        data = JSON.parse(data);
                        for(let container of document.getElementsByClassName(ajaxify_container)){
                            container.innerText = data[container.getAttribute(ajaxify_container_type)]
                        }
                        for(let observer of document.getElementsByClassName("ajaxify-observer")){
                            eval(observer.getAttribute("ajaxify-on-reach"))(
                                observer, 
                                data[observer.getAttribute("ajaxify-eval")],
                                element
                                )
                        }
                    }catch(error){
                        console.error(error);
                    }
                    eval(element.getAttribute("ajaxify-on-done") || "() => {}")();
                });
            } else {
                //alert("Something were wrong");
                showMessage(languages["es"]["not_error"])(2);
            }
        })
        .catch((reason)=>{
            //alert("Rejected");
            showMessage(languages["es"]["not_error"])(2);
        }).finally(()=>{
            unlocker();
        });
    });
}
function lockAjaxify(element){
    element.style.opacity = "0.5";
    element.style.pointerEvents =  "none";
    element.style.cssText = "cursor: wait;";
    return () => {
        element.style.opacity = "1";
        element.style.cssText = "cursor: pointer; pointer-events: all;";
    }
}
function showMessage(message){
    godjango_alert.lastChild.textContent = message;
    return (level)=>{
        if(level !== undefined) updateLevel(level);
        godjango_alert.hidden = false;
        return setTimeout(()=>{
            godjango_alert.hidden = true;
        }, 3 * 1000);
    }
}
function updateLevel(newLevel){
    let elIcon = document.getElementById(godjango_alert_icon);
    switch(newLevel){
        case 1:
            godjango_alert.className = "alert alert-warning";
            elIcon.className = "fa fa-warning";
            break;
        case 2:
            godjango_alert.className = "alert alert-danger";
            elIcon.className = "fa fa-exclamation-triangle";
            break;
        default:
            godjango_alert.className = "alert alert-info";
            elIcon.className = "fa fa-info-circle";
            break;
    }
}
function getFromRef(refId, attr){
    return document.getElementById(refId)?.getAttribute(attr);
}
function getRefValue(refId){
    return document.getElementById(refId)?.value || false;
}
function hookTo(fromId, with_value, toId){
    document.getElementById(toId).innerText = document.getElementById(toId).innerText.charAt(0) + 
        parseFloat(document.getElementById(fromId).value) * parseFloat(with_value);
}

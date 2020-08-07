// console.log("The URL of this page is: " + window.location.href)
var currentUrl = window.location.href;
// console.log(currentUrl);
if (currentUrl === 'http://localhost:3000/') {
    var username = document.getElementById("username").innerHTML;
    var img=document.getElementById('img_url').innerHTML;
    var id=document.getElementById('_id').innerHTML;
    chrome.storage.local.set({username,img,id});
    chrome.runtime.sendMessage(
        { payload: 'Change to main_popup.html',id });
};
if (currentUrl==='http://localhost:3000/users/logout?'){
    chrome.storage.local.clear();
    chrome.runtime.sendMessage(
        { payload: 'Change to popup.html: logged out' });
};

// var socket;

// if (currentUrl.includes("http://localhost:3000/communication/video")){
//     chrome.storage.local.get('socket',(res)=>{
//         console.log(res);
//         assign_socket(res.socket);
//     });
// };

// function assign_socket(result) {
//     socket = result;
//     console.log(socket);
//     var script = document.createElement("script");
//     script.innerHTML = `var socket = ${JSON.stringify(socket)}; console.log('from content script --> ',socket.id); socket_function(socket);`;
//     // script.innerHTML = `var socket = ${JSON.stringify(socket)};`;
//     document.head.appendChild(script);
// };

var id;

if (currentUrl.includes("http://localhost:3000/communication/video")){
    chrome.storage.local.get('id',(res)=>{
        console.log('id 1 --> ',res.id);
        assign_socket(res.id);
    });
};

function assign_socket(result) {
    id = result;
    console.log('id 2 --> ',id);
    var script = document.createElement("script");
    script.innerHTML = `var id = ${JSON.stringify(id)}; socket_function(id);`;
    // script.innerHTML = `var socket = ${JSON.stringify(socket)};`;
    document.head.appendChild(script);
};


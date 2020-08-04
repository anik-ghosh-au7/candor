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

var socket;

if (currentUrl==="http://localhost:3000/friend/getallfriends"){
    chrome.storage.local.get('socket',(res)=>{
        console.log(res);
        assign_socket(res);
    });
};

function assign_socket(result) {
    socket = result;
    console.log(socket);
    var script = document.createElement("script");
    script.innerHTML = `var socket = ${JSON.stringify(socket)}; socket_function(socket);`;
    document.head.appendChild(script);
};


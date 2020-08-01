// console.log("The URL of this page is: " + window.location.href)
var currentUrl = window.location.href;
// console.log(currentUrl);
if (currentUrl === 'http://localhost:3000/') {
    var username = document.getElementById("username").innerHTML;
    var img=document.getElementById('img_url').innerHTML;
    chrome.storage.local.set({username,img});
    chrome.runtime.sendMessage(
        { payload: 'Change to main_popup.html' });
};
if (currentUrl==='http://localhost:3000/users/logout?'){
    chrome.storage.local.clear();
    chrome.runtime.sendMessage(
        { payload: 'Change to popup.html: logged out' });
};

// function loadScript(url)
// {
//     var head = document.head;
//     var script = document.createElement('script');
//     script.type = 'text/javascript';
//     script.src = url;

//     head.appendChild(script);
//     // cb = () => {
//     //     // var socket = io('http://localhost');
//     //     // socket.on('connect', function(){console.log('client connected')});
//     //     // // socket.on('event', function(data){});
//     //     // // socket.on('disconnect', function(){});
//     //     // socket.on("hello",function(data){
//     //     // console.log(data.text);
//     //     // chrome.runtime.sendMessage({msg:"socket",text:data.text},function(response){});
//     //     // // socket.emit('hey',{text:"howdy!!!"});

//     //     console.log('running cb');
//     //     var socket = io.connect('http://localhost:3000');
//     //     socket.on("hello",function(data){
//     //     console.log(data.text);
//     //     chrome.runtime.sendMessage({msg:"socket",text:data.text},function(response){});
//     //     });
//     //     socket.emit('video');
//     // }
// }

// loadScript('https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js');

// // var socket = io.connect('http://localhost:3000');
// // socket.on("hello",function(data){
// //     console.log(data.text);
// //     chrome.runtime.sendMessage({msg:"socket",text:data.text},function(response){});
// // });

// var socket = io.connect('http://localhost:3000');
// socket.on("hello",function(data){
// console.log(data.text);
// chrome.runtime.sendMessage({msg:"socket",text:data.text},function(response){});
// });
// socket.emit('video');




function loadScript(url, cb)
{
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = false;
    head.appendChild(script);
    script.onload = function () {console.log('1 --> ', io);}
    console.log('running main');
    cb();
}

loadScript('https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js', socket_connect);

function socket_connect() {
    console.log('2 --> ', io);
    console.log('running cb')
    var socket = io.connect('http://localhost:3000');
    socket.on("hello",function(data){
    console.log(data.text);
    chrome.runtime.sendMessage({msg:"socket",text:data.text},function(response){});
    });
    socket.emit('video');
}
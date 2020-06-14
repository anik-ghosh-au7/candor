// console.log("The URL of this page is: " + window.location.href)
var currentUrl = window.location.href;
// console.log(currentUrl);
if (currentUrl === 'http://localhost:3000/') {
    var username = document.getElementById("username").innerHTML;
    chrome.storage.local.set({username});
}

chrome.storage.local.get('username',(result)=>{console.log(result)});
if (currentUrl==='http://localhost:3000/users/logout?'){
    // console.log("Logout route");
    chrome.storage.local.clear();
}

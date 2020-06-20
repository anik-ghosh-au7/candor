// console.log("The URL of this page is: " + window.location.href)
var currentUrl = window.location.href;
// console.log(currentUrl);
if (currentUrl === 'http://localhost:3000/') {
    var username = document.getElementById("username").innerHTML;
    chrome.storage.local.set({username});
    chrome.runtime.sendMessage(
        { payload: 'Change to main_popup.html' });
};

if (currentUrl==='http://localhost:3000/users/logout?'){
    chrome.storage.local.clear();
    chrome.runtime.sendMessage(
        { payload: 'Change to popup.html: logged out' });
};


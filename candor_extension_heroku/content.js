// console.log("The URL of this page is: " + window.location.href)
var currentUrl = window.location.href;
// console.log(currentUrl);
if (currentUrl === 'https://candor-app.herokuapp.com/') {
    var username = document.getElementById("username").innerHTML;
    var img=document.getElementById('img_url').innerHTML;
    chrome.storage.local.set({username,img});
    chrome.runtime.sendMessage(
        { payload: 'Change to main_popup.html' });
};
if (currentUrl==='https://candor-app.herokuapp.com/users/logout?'){
    chrome.storage.local.clear();
    chrome.runtime.sendMessage(
        { payload: 'Change to popup.html: logged out' });
};


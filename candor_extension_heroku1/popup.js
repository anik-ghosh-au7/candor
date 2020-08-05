chrome.storage.local.get('username', (result) => {
    if (result && result.username) {
        document.getElementById("username").innerHTML = "Hello " + result.username;
    } else {
        document.getElementById("username").innerHTML = 'Hello Guest!';
    }

});
window.onload = () => {
    document.getElementById("exampleInputEmail1").focus();
};

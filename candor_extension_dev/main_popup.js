chrome.storage.local.get('username', (result) => {
        document.getElementById("username").innerHTML = "Hello " + result.username;
});

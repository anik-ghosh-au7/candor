chrome.runtime.onMessage.addListener((request,sender,response) => {
    if (request.payload === 'Change to main_popup.html') {
        chrome.browserAction.setPopup({
            popup: "main_popup.html"
        });
    };

    if (request.payload === 'Change to popup.html: logged out') {
        chrome.browserAction.setPopup({
            popup: "popup.html"
        });
    };

    if (request.payload === 'Give active tab') {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            var activeTab = tabs[0];
            response(activeTab.url);
        });
        return true;
    };

    if(request.msg==="socket"){
        console.log("receive from socket server: "+request.text);
    };
});

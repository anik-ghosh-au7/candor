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
            console.log(activeTab.url);
            // chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
            console.log(response);
            response(activeTab.url);
        });
        return true;
    }
});

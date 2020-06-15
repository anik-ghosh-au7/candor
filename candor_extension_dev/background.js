chrome.runtime.onMessage.addListener(request => {
    if (request.payload === 'Change to main_popup.html') {
        chrome.browserAction.setPopup({
            popup:"main_popup.html"
        });
    };

    if (request.payload === 'Change to popup.html: logged out') {
        chrome.browserAction.setPopup({
            popup:"popup.html"
        });
    };
});
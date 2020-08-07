chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (request.payload === 'Change to main_popup.html') {
        chrome.browserAction.setPopup({
            popup: "main_popup.html"
        });
        setVideoConfig(request.id);
    }
    ;

    if (request.payload === 'Change to popup.html: logged out') {
        chrome.browserAction.setPopup({
            popup: "popup.html"
        });
        disconnect_socket_io();
    }
    ;

    if (request.payload === 'Give active tab') {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            var activeTab = tabs[0];
            response(activeTab.url);
        });
        return true;
    }
    ;

});
// console.log(io);
// io.connect('http://localhost:3000');
let socket;
function setVideoConfig(id) {
    socket = io.connect('http://localhost:3000', {transports: ['polling']});
    // chrome.storage.local.set({socket});
    chrome.storage.local.set({id});
    socket.emit('user_id_for_receiving', id);

    // socket.on(`vcall_${id}`, data => {
    //     console.log('caller',data.caller,'receiverID',id);
    //     chrome.tabs.create({
    //         url: chrome.runtime.getURL(`dialog.html?caller=${data.caller}&caller_img=${data.caller_img}`),
    //         active: false
    //     }, function (tab) {
    //         // After the tab has been created, open a window to inject the tab
    //         chrome.windows.create({
    //             tabId: tab.id,
    //             type: 'popup',
    //             focused: true,
    //             width:500,
    //             height:750,
    //             // incognito, top, left, ...
    //         });
    //     });
    //     socket.emit('Ringing',{receiver:'received'})
    // });

    socket.on(`video_call`, data => {
        console.log('caller',data.caller,'receiverID',id);
        chrome.tabs.create({
            url: chrome.runtime.getURL(`dialog.html?caller=${data.caller}&caller_img=${data.caller_img}`),
            active: false
        }, function (tab) {
            // After the tab has been created, open a window to inject the tab
            chrome.windows.create({
                tabId: tab.id,
                type: 'popup',
                focused: true,
                width:500,
                height:750,
                // incognito, top, left, ...
            });
        });
        socket.emit('Ringing',{receiver:'received'})
    });
}

function disconnect_socket_io() {
    socket.disconnect()
}


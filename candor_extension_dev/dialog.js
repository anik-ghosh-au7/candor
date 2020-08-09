window.onload=()=>{
    // chrome.storage.local.get('socket',(socket)=> {
    //      console.log(socket)
    // });
    let url = window.location.href;
    let caller = new URL(url).searchParams.get("caller");
    let caller_img = new URL(url).searchParams.get("caller_img");
    console.log(caller);
    document.getElementById('profile_img').src=caller_img;
    document.getElementById('caller_name').innerText = 'You are receiving a call from ' + caller;
    document.getElementById('accept').onclick="window.open('http://localhost:3000/communication/video?friend_username=king&caller=true')"
    document.getElementById('reject').onclick=()=>{
    }
    chrome.send
};

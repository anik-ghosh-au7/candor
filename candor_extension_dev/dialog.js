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
    document.getElementById('reject').onclick=()=>{}
    function Ringtone(n) {
        if (n >= 10) return
        if ('speechSynthesis' in window) {
            var msg = new SpeechSynthesisUtterance();
            msg.voiceURI = 'native';
            // var caller = 'Anik';
            msg.volume = 2;
            msg.rate = 0.7;
            msg.pitch = 2;
            msg.text = `You are getting a call from ${caller}`;
            msg.lang = 'en';
            window.speechSynthesis.speak(msg);
            msg.onend = setTimeout(() => {
                Ringtone(++n);
                }, 5000);
        }else{
            var sound      = document.createElement('audio');
            sound.id       = 'audio-player';
            sound.controls = 'controls';
            sound.src      = 'ringtone.mp3';
            sound.type     = 'audio/mpeg';
            document.getElementById('ringtone').appendChild(sound);
            sound.play();
        }
    };
    Ringtone(0);
};

let username;
let form_data, friend_form_data;
chrome.storage.local.get('username', (result) => {
    document.getElementById("username").innerHTML = "Hello " + result.username;
    username = result.username;
});
chrome.storage.local.get('img', (result) => {
    if (result.img) {
        document.getElementById('profile_img').src = result.img;
    } else {
        document.getElementById('profile_img').src = "images/default-profile-picture1.jpg";
    }

});
var curr_url;
var server_url = "http://localhost:3000/post/";
chrome.runtime.sendMessage(
    {payload: 'Give active tab'}, (data) => {
        curr_url = data;
        let domain = url_domain(curr_url);
        if (domain === 'localhost') {
            var actual_url = new URL(curr_url).searchParams.get("current_url");
            curr_url = actual_url;
        }

        if (curr_url !== null && curr_url !== "null") {
            document.getElementById('context_url').innerText = curr_url;
            document.querySelector("input[name=context]").value = curr_url;
            update_links();
            get_data();
        } else {
            disableFunctions()
        }
        document.querySelector("input[name=user]").value = username;
    }
);
function disableFunctions() {
    document.getElementById('context_url').innerHTML = "We don't serve at this site.";
    document.querySelector("input[name=context]").value="https://github.com/anik-ghosh-au7/candor/blob/master/README.md";
};

const get_data = () => {
    let http_req = new XMLHttpRequest();
    http_req.open("GET", server_url + `getdata/?current_url=${encodeURIComponent(curr_url)}`, true);
    http_req.send();
    http_req.onload = () => {
        update_data(JSON.parse(http_req.response));
    }
};


function update_links() {
    document.getElementById("question").addEventListener("click", myFunction('question'));
    document.getElementById("related").addEventListener("click", myFunction('related'));
    document.getElementById("admin").addEventListener("click", myFunction('admin'));
    document.getElementById("others").addEventListener("click", myFunction('others'));
};

function update_data(data) {
    document.getElementById("question_data").innerHTML = data.question;
    document.getElementById("related_data").innerHTML = data.related;
    document.getElementById("admin_data").innerHTML = data.admin;
    document.getElementById("others_data").innerHTML = data.others;

    if (data.fav) {
        let star_icon = document.getElementById('star_element');
        star_icon.classList.remove('far');
        star_icon.classList.add('fas');
    }
};


function myFunction(context_type) {
    return () => {

        var hitUrl = `http://localhost:3000/post/render?current_url=${encodeURIComponent(curr_url)}&category=${context_type}&page=1`;
        window.open(hitUrl, '_blank');
    };
};

function url_domain(data) {
    var a = document.createElement('a');
    a.href = data;
    return a.hostname;
};

window.onload = () => {
    let chat_icon = document.getElementById("chat_element");
    chat_icon.addEventListener("click", chatFunction());

    let share_icon = document.getElementById("share_element");
    share_icon.addEventListener("click", shareFunction());

    let star_icon = document.getElementById("star_element");
    star_icon.addEventListener("click", favFunction());

    let friend_icon = document.getElementById("friend_element");
    friend_icon.addEventListener("click", friendFunction());
    closeNewDialog.addEventListener("click", closeNewDialogBox());
    friend_form_data = document.getElementById('form_friends');
    friend_form_data.addEventListener("submit", function (event) {
        event.preventDefault();
        selfClose();
    });

    let favList_icon = document.getElementById("list_element");
    favList_icon.addEventListener("click", getfavFunction());

    let openMsg = document.getElementById('msg_element');
    openMsg.addEventListener("click", openMsgPage());

    let closeDialog = document.getElementById('closeDialog');
    closeDialog.addEventListener("click", closeDialogBox());
    form_data = document.getElementById('form_submit');
    form_data.addEventListener("submit", function (event) {
        event.preventDefault();
        closeSelf();
    });
};

function getfavFunction() {
    return () => {
        let getFavUrl = `http://localhost:3000/users/favourites`;
        window.open(getFavUrl, '_blank');
    };
};

function chatFunction() {
    return () => {
        let chatUrl;
        if(curr_url){
            chatUrl = `http://localhost:3000/chat?current_url=${encodeURIComponent(curr_url)}`;
        }else{
            chatUrl = `http://localhost:3000/chat?current_url=${encodeURIComponent("Candor")}`;
        };
        window.open(chatUrl, '_blank');
    };
};

function favFunction() {
    return () => {
        let body = {
            "current_url": curr_url
        };
        console.log('curr_url', curr_url);
        console.log("body_url", body);
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", 'http://localhost:3000/post/addfav', true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(body));
        xhttp.onload = () => {
            console.log(xhttp.responseText);
            let star_icon = document.getElementById('star_element');
            if (xhttp.responseText === 'added to favourites!!!') {
                star_icon.classList.remove('far');
                star_icon.classList.add('fas');
            } else {
                star_icon.classList.remove('fas');
                star_icon.classList.add('far');
            }
        }
    };
};

function shareFunction() {
    return () => {
        document.getElementById("myDialog").showModal();
    };
};

function friendFunction() {
    return () => {
        document.getElementById("newDialog").showModal();
    };
};

function closeNewDialogBox() {
    return () => {
        document.getElementById('newDialog').close();
        document.getElementById('friend_username').value = '';
        document.getElementById('friend_status').innerText = '';
    }
}

function closeDialogBox() {
    return () => {
        document.getElementById('myDialog').close();
        document.getElementById('share_username').value = '';
        document.getElementById('comments').value = '';
        document.getElementById('shared_status').innerText = '';
    }
};

function openMsgPage() {
    return () => {
        let msgUrl = `http://localhost:3000/messages/getmsg`;
        window.open(msgUrl, '_blank');
    };
}

function closeSelf() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", 'http://localhost:3000/messages', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    let formData = new FormData(form_data);
    let send_data = {};
    for (var [key, value] of formData.entries()) {
        send_data[key] = value;
    }
    xhttp.send(JSON.stringify(send_data));
    xhttp.onload = () => {
        if (xhttp.responseText === 'Message sent') {
            document.getElementById('share_username').value = '';
            document.getElementById('comments').value = '';
        }
        // document.getElementById('myDialog').close();
        document.getElementById('shared_status').innerText = xhttp.responseText;
    };
};

function selfClose() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", 'http://localhost:3000/friend/friendrequest', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    let formData = new FormData(friend_form_data);
    let send_data = {};
    for (var [key, value] of formData.entries()) {
        send_data[key] = value;
    }
    console.log(send_data);
    xhttp.send(JSON.stringify(send_data));
    xhttp.onload = () => {
        if (xhttp.responseText === 'Friend request sent') {
            document.getElementById('friend_username').value = '';
        }
        document.getElementById('friend_status').innerText = xhttp.responseText;
    };
};

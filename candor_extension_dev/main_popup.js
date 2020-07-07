let username;
chrome.storage.local.get('username', (result) => {
    document.getElementById("username").innerHTML = "Hello " + result.username;
    username = result.username;
});
chrome.storage.local.get('img',(result)=>{
    if(result.img){
        document.getElementById('profile_img').src=result.img;
    }else{
        document.getElementById('profile_img').src="images/default-profile-picture1.jpg";
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
            actual_url = decodeURIComponent(actual_url);
            curr_url = actual_url;
        }

        if (curr_url!="null") {
            document.getElementById('context_url').innerHTML = curr_url;
            document.querySelector("input[name=context]").value = curr_url;
            document.querySelector("input[name=user]").value = username;
            update_links();
            get_data();
        }else{
            document.getElementById('context_url').innerHTML= "We don't serve at this site."
        }

    }
);

const get_data = () => {
    let http_req = new XMLHttpRequest();
    http_req.open("GET", server_url + `getdata/?current_url=${curr_url}`, true);
    http_req.send();
    http_req.onload = () => {
        update_data(JSON.parse(http_req.response));
    }
}


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
    let closeDialog = document.getElementById('closeDialog');
    closeDialog.addEventListener("click", closeDialogBox());
    let form_submit= document.getElementById('form_submit');
    form_submit.onsubmit=closeSelf(form_submit);
};
function chatFunction() {
    return () => {
        let chatUrl = `http://localhost:3000/chat?current_url=${encodeURIComponent(curr_url)}`;
        window.open(chatUrl, '_blank');
    };
};
function shareFunction() {
    return () => {
        document.getElementById("myDialog").showModal();
    };
};
function closeDialogBox() {
    return () => {
     document.getElementById('myDialog').close();
    }
};
function closeSelf () {
    document.getElementById('form_submit').submit();
     document.getElementById('myDialog').close();
  }

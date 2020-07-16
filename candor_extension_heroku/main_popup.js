let username;
let form_data;
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
var server_url = "https://candor-app.herokuapp.com/post/";
chrome.runtime.sendMessage(
    {payload: 'Give active tab'}, (data) => {
        curr_url = data;
        let domain = url_domain(curr_url);
        if (domain === 'candor-app.herokuapp.com') {
            var actual_url = new URL(curr_url).searchParams.get("current_url");
            actual_url = decodeURIComponent(actual_url);
            curr_url = actual_url;
        }

        if (curr_url!= null) {
            document.getElementById('context_url').innerText= curr_url;
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
    http_req.open("GET", server_url + `getdata/?current_url=${encodeURIComponent(curr_url)}`, true);
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

    if (data.fav){
        let star_icon = document.getElementById('star_element');
        star_icon.classList.remove('far');
        star_icon.classList.add('fas');
    }
};


function myFunction(context_type) {
    return () => {
        var hitUrl = `https://candor-app.herokuapp.com/post/render?current_url=${encodeURIComponent(curr_url)}&category=${context_type}&page=1`;
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

    let favList_icon = document.getElementById("list_element");
    favList_icon.addEventListener("click", getfavFunction());

    let openMsg = document.getElementById('msg_element');
    openMsg.addEventListener("click", openMsgPage());

    let closeDialog = document.getElementById('closeDialog');
    closeDialog.addEventListener("click", closeDialogBox());
    form_data= document.getElementById('form_submit');
    form_data.addEventListener( "submit", function ( event ) {
        event.preventDefault();
        closeSelf();
      } );
};
function getfavFunction() {
    return () => {
        let getFavUrl = `https://candor-app.herokuapp.com/users/favourites`;
        window.open(getFavUrl, '_blank');
    };
};

function chatFunction() {
    return () => {
        let chatUrl = `https://candor-app.herokuapp.com/chat?current_url=${encodeURIComponent(curr_url)}`;
        window.open(chatUrl, '_blank');
    };
};

function favFunction() {
    return () => {
        let body = {
            "current_url": curr_url
        };
        console.log('curr_url', curr_url);
        console.log("body_url",body);
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", 'https://candor-app.herokuapp.com/post/addfav', true);
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
function closeDialogBox() {
    return () => {
     document.getElementById('myDialog').close();
     document.getElementById('share_username').value = '';
     document.getElementById('comments').value = '';
     document.getElementById('shared_status').innerText = '';
    }
};


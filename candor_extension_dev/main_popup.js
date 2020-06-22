chrome.storage.local.get('username', (result) => {
    document.getElementById("username").innerHTML = "Hello " + result.username;
});
var curr_url;
var server_url = "http://localhost:3000/post/";
chrome.runtime.sendMessage(
    {payload: 'Give active tab'}, (data) => {
        curr_url = data;
        let domain = url_domain(curr_url);
        if (domain === 'localhost') {
            var actual_url=new URL(curr_url).searchParams.get("current_url");
            actual_url=decodeURIComponent(actual_url);
            curr_url=actual_url;
        }


        document.getElementById('context_url').innerHTML = curr_url

        update_links();
        get_data();
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
}

chrome.storage.local.get('username', (result) => {
    document.getElementById("username").innerHTML = "Hello " + result.username;
});
var curr_url;
var server_url = "http://localhost:3000/post/";
chrome.runtime.sendMessage(
    {payload: 'Give active tab'}, (data) => {
        curr_url = data;
        // console.log("Mission completee", curr_url);
        update_links();
    }
);


function update_links() {
    document.getElementById("question").addEventListener("click", myFunction('question'));
    document.getElementById("related").addEventListener("click", myFunction('related'));
    document.getElementById("admin").addEventListener("click", myFunction('admin'));
    document.getElementById("others").addEventListener("click", myFunction('others'));
};


function myFunction(type) {
    return () => {
        var http = new XMLHttpRequest();
        http.open("GET", server_url + '?url=' + curr_url + '&category=' + type, true);
        // http.onreadystatechange = function() {
        //     console.log(http.readyState);
        //     console.log(http.status);
        //     if(http.readyState == 4 && http.status == 200) {
        //         console.log(http.response);
        //     }
        // };
        http.send();
        
    };
};

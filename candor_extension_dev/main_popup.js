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


// function myFunction(type) {
//     return () => {
//         var http = new XMLHttpRequest();
//         var params = {
//             url: curr_url,
//             category: type
//         }
//         http.open("POST", server_url, true);
//         http.setRequestHeader('Content-Type', 'application/json');
//         http.send(JSON.stringify(params));
//         http.onload = () => {
//             console.log(http.responseText);
//          };
//     };
// };

function myFunction(type) {
    return () => {
        var x = document.getElementById("post_form");
        var createform = document.createElement('form');
        createform.setAttribute("id", "url_form");
        createform.setAttribute("action", "http://localhost:3000/post/");
        createform.setAttribute("method", "post");
        createform.setAttribute("target", "_blank");
        var context_element = document.createElement('input');
        context_element.setAttribute("type", "text");
        context_element.setAttribute("name", "context");
        context_element.setAttribute("value", type);
        var url_element = document.createElement('input');
        url_element.setAttribute("type", "text");
        url_element.setAttribute("name", "current_url");
        url_element.setAttribute("value", curr_url);
        x.appendChild(createform);
        createform.append(context_element);
        createform.append(url_element);
        document.forms['url_form'].submit();
    };
};

chrome.storage.local.get('username', (result) => {
    document.getElementById("username").innerHTML = "Hello " + result.username;
});
var curr_url;
var server_url="http://localhost:3000/post/";
chrome.runtime.sendMessage(
    {payload: 'Give active tab'}, (data) => {
        curr_url = data;
        // console.log("Mission completee", curr_url);
        update_route()
    });
function update_route(){
    document.getElementById("question").setAttribute('href','');
    document.getElementById("related").setAttribute('href','');
    document.getElementById("admin").setAttribute('href','');
    document.getElementById("others").setAttribute('href','');
}


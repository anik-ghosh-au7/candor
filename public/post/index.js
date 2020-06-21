console.log("hi");
window.onload = () => {
    let like_btns = document.getElementsByName('like_button');
    let context_url = document.getElementById('context_url').innerHTML;
    var i;
    console.log(like_btns.length);
    for (i = 0; i < like_btns.length; i++) {
        like_btns[i].onclick = like_click(i);

        function like_click(j) {
            return () => {
                console.log(like_btns[j].id);
                let xhttp = new XMLHttpRequest();
                xhttp.open("GET", `http://localhost:3000/post/like/?post_id=${like_btns[j].id}&current_url=${encodeURIComponent(context_url)}`, true);
                xhttp.send();
                xhttp.onload = () => {
                    console.log(xhttp.responseText);
                    if(xhttp.responseText==='liked'){
                        like_btns[j].className+=' btn-info';
                    }else{
                        like_btns[j].className='btn';
                    }
                }
            }
        }
    }
    var obj={'key':document.getElementById('for_likes').innerHTML};
    console.log(obj);
    console.log(eval([ob]));

}

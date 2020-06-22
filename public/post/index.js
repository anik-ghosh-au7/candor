window.onload = () => {
    let like_btns = document.getElementsByName('like_button');
    let context_url = document.getElementById('context_url').innerHTML;
    var i;
    for (i = 0; i < like_btns.length; i++) {
        like_btns[i].onclick = like_click(i);

        function like_click(j) {
            return () => {
                let xhttp = new XMLHttpRequest();
                xhttp.open("GET", `http://localhost:3000/post/like/?post_id=${like_btns[j].id}&current_url=${encodeURIComponent(context_url)}`, true);
                xhttp.send();
                xhttp.onload = () => {
                    console.log(xhttp.responseText);
                    if(xhttp.responseText==='liked'){
                        console.log(like_btns[j].innerText.split(' '));
                        like_btns[j].className+=' btn-info';
                        like_btns[j].innerHTML='Liked '+(parseInt(like_btns[j].innerText.split(" ")[1])+1)
                    }else{
                        console.log(like_btns[j].innerText.split(' '));
                        like_btns[j].className='btn';
                        like_btns[j].innerHTML='Like '+(parseInt(like_btns[j].innerText.split(" ")[1])-1)
                    }
                }
            }
        }
    }

}

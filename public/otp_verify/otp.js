window.onload = () => {
    let btn = document.getElementById('otp_button');
    let server_url = 'http://localhost:3000/users/request_otp';
    btn.onclick = () => {
        let email = document.getElementById("email").value;
        let xhttp = new XMLHttpRequest();
        var body = {
            email: email
        }
        xhttp.open("POST", server_url, true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(body));
        xhttp.onload = () => {
            document.getElementById('otp_sent').innerHTML = xhttp.responseText;
            console.log(xhttp.responseText);
        };
    };
    let submit_otp = document.getElementById('submit_otp');
    submit_otp.onclick = () => {
        let submit_otp_url = 'http://localhost:3000/users/submit_otp';
        let email = document.getElementById("email").value;
        let otp = document.getElementById('otp_input').value;
        let xhttp = new XMLHttpRequest();
        xhttp.open("GET", submit_otp_url + `/?otp=${otp}&email=${email}`, true);
        xhttp.send();
        xhttp.onload = () => {
            document.getElementById('otp_sent').innerHTML = xhttp.responseText;
            console.log(xhttp.responseText);
        }
    }
}


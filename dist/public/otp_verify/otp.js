"use strict";

window.onload = function () {
  document.getElementById("username").focus();
  var btn = document.getElementById('otp_button');
  var server_url = location.protocol + '//' + location.host + '/users/request_otp';

  btn.onclick = function () {
    var email = document.getElementById("email").value;
    var xhttp = new XMLHttpRequest();
    var body = {
      email: email
    };
    console.log("sending");
    xhttp.open("POST", server_url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(body));

    xhttp.onload = function () {
      document.getElementById('otp_sent').innerHTML = xhttp.responseText;
    };
  };

  var submit_otp = document.getElementById('submit_otp');

  submit_otp.onclick = function () {
    var submit_otp_url = location.protocol + '//' + location.host + '/users/submit_otp';
    var email = document.getElementById("email").value;
    var otp = document.getElementById('otp_input').value;
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", submit_otp_url + "/?otp=".concat(otp, "&email=").concat(email), true);
    xhttp.send();

    xhttp.onload = function () {
      document.getElementById('otp_verify').innerHTML = xhttp.responseText;
    };
  };
};
//# sourceMappingURL=otp.js.map
console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
    console.log(e.data.text());
    let data = eval('('+e.data.text()+')');
    console.log(data, typeof(data));
      console.log("Push Recieved...");
      self.registration.showNotification(data.title, {
        body: data.msg_body,
        icon: "/images/icon.png"
      });
    });
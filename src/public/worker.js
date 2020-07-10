console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
console.log(e.data.text());
  console.log("Push Recieved...");
  self.registration.showNotification(e.data.text(), {
    body: "Notified by Candor!",
    icon: "/images/icon.png"
  });
});
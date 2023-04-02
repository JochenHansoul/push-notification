// this will show the notification
self.addEventListener("push", function (e) {
    const data = e.data.json();
    e.waitUntil(self.registration.showNotification(data.title, {
        body: "Body of the notification 2",
        icon: "./assets/images/icons8-globe-24.png"
    }));
});

// this will show the notification
self.addEventListener("push", function (e) {
    const data = e.data.json();
    e.waitUntil(self.registration.showNotification(data.title, {
        body: data.options.body,
        icon: data.options.icon
    }));
});

const webpush = require("web-push");
const express = require("express");
const bodyParser = require("body-parser");

const port = 5000;
const app = express();

// VAPID keys should be generated only once.
const vapidKeys = {
	publicKey: "BEnOCKUAbcQFBfs3YmWr7HtJBPCGlkWYMjlSZVxI83UliaB8PqEuF6UhE6jUDs0qKBcBHLs1-QrLePhLMY-chus",
	privateKey: "UIV6Y8bQ2qp7cSW5ffw1x_bDYLES4XfQJ7LZTrxW29E"
}

/*****************************/
/* configuring webpush *******/
/*****************************/
webpush.setVapidDetails(
    "mailto:test@test.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

/*****************************/
/* configuring express server */
/*****************************/

app.use(express.static(__dirname + "/public")); // serve static assets in dir "public"
app.use(express.static(__dirname + "/public/js")); // serve static assets in dir "public/js"
app.use(bodyParser.json()); // extracts the entire body portion of an incoming request stream and exposes it on req.body.

/*****************************/
/* creating request handlers */
/*****************************/

app.post("/subscribe", function (req, res) {
    const pushSubscription = req.body;
    const payload = JSON.stringify({ title: "The title of the push notification" }); // The title of the notification

    webpush
        .sendNotification(pushSubscription, payload) // sending notification
        .catch(error => console.error(error));

    res.status(201).json({ message: "success" });
});


/*****************************/
/* running express server ****/
/*****************************/

app.listen(port, () => console.log("Server started on port " + port));

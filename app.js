const webpush = require("web-push");
const express = require("express");
const bodyParser = require("body-parser");

/*****************************/
/* constants *****************/
/*****************************/

const port = 5000;
const app = express();

// notificatio objects contain the data for the notifications
const notificationObject = {
    title: "Hello, Notifications!",
    options: {
        body: "The body of the notification",
        icon: "./assets/images/icons8-globe-24.png"
    }
};

const welcomeNotificationObject = {
    title: "Welcome!",
    options: {
        body: "You have succesfully subscribed to the push service.",
        icon: "./assets/images/icons8-globe-24.png"
    }
};

// VAPID keys should be generated only once.
const vapidKeys = {
	publicKey: "BEnOCKUAbcQFBfs3YmWr7HtJBPCGlkWYMjlSZVxI83UliaB8PqEuF6UhE6jUDs0qKBcBHLs1-QrLePhLMY-chus",
	privateKey: "UIV6Y8bQ2qp7cSW5ffw1x_bDYLES4XfQJ7LZTrxW29E"
}

// hard coded client subscription (change when setting up a new subscription)
const subscription = {
  endpoint: 'https://updates.push.services.mozilla.com/wpush/v2/gAAAAABkNTf5I-kruxoD6WUQ8WPr1U4VK5eoAx9qfuitfrYSQqvf75IS9t5mS30dSfd7fPMEPykeJ_jr4zntvoaMduuLLfQUY5kJY4Kfo7PaxP8Kbp2ArNMs6i30atnRRO1W_LG0flFNi2fHiBeaqe-eORRRv1krlcC8n1JPyXrU-SbG0kMjKK0',
  expirationTime: null,
  keys: {
    auth: 'q0ixnS64D2lNuycfV76mTg',
    p256dh: 'BAV_8q17XYma4bd4ECxaVTgFTKzdk0nUKTp7ryxXhgqLis-z7yroag1uHRUNIWpYg7OqKNnTo7UJNdhZ3oetGSU'
  }
};

/*****************************/
/* functions *****************/
/*****************************/

const sendNotification = function (subscriptions, notification = notificationObject) {
    const endpoint = subscription.endpoint;
    const id = endpoint.substr((endpoint.length - 8), endpoint.length);
    webpush.sendNotification(
        subscription,
        JSON.stringify(notification))
        .then(function (result) {
             console.log(`Endpoint ID: ${id}`, `Result: ${result.statusCode}`)
        })
        .catch(error => console.error(error));
};

/*****************************/
/* configuring webpush *******/
/*****************************/

// Customize how the push service should attempt to deliver the push message.
// And provide authentication information.
webpush.setVapidDetails(
    "mailto:test@test.com", /* vapid subject */
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

/*****************************/
/* configuring express server */
/*****************************/

app.use(express.static(__dirname + "/public")); // serve static assets in dir "public"
app.use(express.static(__dirname + "/public/css")); // serve static assets in dir "public/css"
app.use(express.static(__dirname + "/public/js")); // serve static assets in dir "public/js"
app.use(bodyParser.json()); // extracts the entire body portion of an incoming request stream and exposes it on req.body.

/*****************************/
/* creating request handlers */
/*****************************/

app.post("/subscribe", function (req, res) {
    const subscription = req.body;

    // use this to get the subscription
    console.log("subscription: ", subscription);

    sendNotification(subscription, welcomeNotificationObject);
    res.status(201).json({ message: "success" });
});

/*****************************/
/* running express server ****/
/*****************************/

app.listen(port, () => console.log("Server started on port " + port));


// sends a notification to the client after 8 seconds
// this function only works after the user has subscribed of course
/*setTimeout(function() {
    sendNotification(subscription);
}, 10000);*/

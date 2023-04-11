/*******************/
/* constants *******/
/*******************/

const publicVapidKey = "BEnOCKUAbcQFBfs3YmWr7HtJBPCGlkWYMjlSZVxI83UliaB8PqEuF6UhE6jUDs0qKBcBHLs1-QrLePhLMY-chus";

const subscribeButton = document.getElementById("subscribe");
const unsubscribeButton = document.getElementById("unsubscribe");
const outputElement = document.querySelector("p[name=result]");

/*******************/
/* functions *******/
/*******************/

const getSubscription = async function () {
    // register service worker
    const register = await navigator.serviceWorker
        .register("./service-worker.js", { scope: "/" });

    // register push
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicVapidKey
    });
    return subscription;
};

const removeSubscriptions = function () {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
        registrations.forEach(registration => registration.unregister());
    });
    outputElement.innerText = "You have successfully unsubscribed. When you resubscribe the subscription needs to be changed in the back-end as it's hard coded.";
};

const sendSubscription = async function () {
    // checking for service worker
    if ("serviceWorker" in navigator) {
        const subscription = await getSubscription();
        // uncomment to get the subscription
        //console.log("subscription: ", subscription);

        // send push
        const result = await fetch("/subscribe", {
            method: "POST",
            body: JSON.stringify(subscription),
            headers: {
                "Content-Type": "application/json"
            }
        });

        // feedback for user
        outputElement.innerText = (result.status === 201)
            ? "You have successfully subscribed. You should now see a notification."
            : "An error occured. Status: " + result.status;
    } else {
        outputElement.innerText = "Push Manager is not supporter";
    }
};

/*******************/
/* main ************/
/*******************/


subscribeButton.addEventListener("click", () => sendSubscription());

unsubscribeButton.addEventListener("click", () => removeSubscriptions());

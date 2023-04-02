const publicVapidKey = "BEnOCKUAbcQFBfs3YmWr7HtJBPCGlkWYMjlSZVxI83UliaB8PqEuF6UhE6jUDs0qKBcBHLs1-QrLePhLMY-chus";

const sendSubscription = async function () {
    // checking for service worker
    if ("serviceWorker" in navigator) {
        // register service worker
        const register = await navigator.serviceWorker
            .register("./service-worker.js", { scope: "/" });

        if (register.installing) {
            console.log("installing serviceworker");
        } else if (register.active) {
            console.log("serviceworker is active");
        } else if (register.waiting) {
            console.log("serviceworker is waiting");
        }

        // register push
        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: publicVapidKey
        });

        // send push
        await fetch("/subscribe", {
            method: "POST",
            body: JSON.stringify(subscription),
            headers: {
                "Content-Type": "application/json"
            },
        });
    } else {
        console.log("Push Manager is not supporter");
    }
}

sendSubscription().catch(error => console.error(error));

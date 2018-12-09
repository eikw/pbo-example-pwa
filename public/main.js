let swReg = false;
let isSubscribed = null;
let subscription = null;

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function initSw() {
    if (navigator.serviceWorker && 'PushManager' in window) {
        navigator.serviceWorker.
            register('./sw.js').then(function (registration) {
                console.log('Service Worker registered');
                swReg = registration;
                initPush();
            });
    } else {
        console.warn('Push not supported');
    }
}

function initPush() {
    swReg.pushManager.getSubscription()
        .then(function (subscription) {
            isSubscribed = !(subscription === null);
            update()
        })
}

// init Pages
function initPlanPage() {
    const link = document.getElementById('back');

    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('id');

    link.href = `index.html?query=${urlParams.get('query')}`;

    if (myParam) {
        getPlan(myParam);
    }
}

function initIndexPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');

    if (query) {
        document.getElementById('query').value = query;
        search(query)
    }
}

// Handle Push
function subscribe() {
    if (!isSubscribed) {
        subscribeUser();
    }
}

function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array('BAmAlnkU7ilFrZhprnHz7UbcjtmdCTZY-anNC6Pj5psuu9ez4jAxKwgJWwND7rJjHpNqyc4GcK6OP-Z371-iGgU');
    swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
        .then(function (subscription) {
            console.log('User is subscribed.');

            isSubscribed = true;

            update();
        })
        .catch(function (err) {
            console.log('Failed to subscribe the user: ', err);
            update();
        });
}

function update() {
    const btn = document.getElementById('push');
    btn.disabled = isSubscribed;
}

// Helper methods
function getPlan(id) {
    const table = document.getElementById('resultTable');
    table.innerHTML = '';

    fetch(`http://localhost:8080/api/plan/${id}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            if (!myJson.error) {
                myJson.forEach(element => {
                    const trNode = document.createElement('tr');
                    const tdNode = document.createElement('td');
                    const content = document.createTextNode(
                        `
                                Linie: ${element.line} / 
                                Richtung: ${element.direction} /
                                Abfahrt: ${format(element.scheduledTime)}
                                `
                    );
                    const button = document.createElement('button');
                    button.innerHTML = 'Abfahrt Benachrichtigung';
                    button.onclick = function () {

                    };

                    tdNode.appendChild(content);
                    trNode.appendChild(tdNode);
                    table.appendChild(trNode);
                });
            }
        });
}

function search(searchQuery) {
    const table = document.getElementById('resultTable');
    table.innerHTML = '';

    fetch(`http://localhost:8080/api/search/${searchQuery}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            if (!myJson.error) {
                myJson.forEach(element => {
                    const trNode = document.createElement('tr');
                    const tdNode = document.createElement('td');
                    const content = document.createTextNode(`${element.name} - ${element.city}`);
                    const btnNode = document.createElement('a');
                    btnNode.innerHTML = 'plan';
                    btnNode.href = `plan.html?id=${element.id}&query=${searchQuery}`;

                    tdNode.appendChild(content);
                    tdNode.appendChild(btnNode);
                    trNode.appendChild(tdNode);
                    table.appendChild(trNode);
                });
            }
        })
}

function format(string) {
    return moment(string).format('HH:mm');
}

function formatDelay(string) {
    return moment(string).format('mm');
}

function keypress(event) {
    if (event.keyCode == 13) {
        link();
    }
}

function link() {
    window.location.replace(`index.html?query=${document.getElementById('query').value}`);
}

function initSw() {
    if (navigator.serviceWorker) {
        navigator.serviceWorker.
            register('./sw.js').then(function (registration) {
                console.log('Service Worker registered');
            });
    } else {
        console.warn('Service Worker not supported');
    }
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

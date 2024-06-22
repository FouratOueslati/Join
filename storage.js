const BASE_URL_USER_DATA = "https://join-gruppenarbeit-7a79e-default-rtdb.europe-west1.firebasedatabase.app/";

let addTaskClicked = false;

// lädt all user Data, wird grundsätzlich nur zum einloggen benötigt.
async function loadUserData(path = "") {
    let response = await fetch(BASE_URL_USER_DATA + path + ".json");
    return await response.json();
}


// Funktion die den eingeloggten user UID und die Daten die darunter gespeichert sind in dem local Storage speichert. Diese UID wird später um User spezifische Daten zu loaden.
async function setLoggedInUser(uid) {
    const response = await fetch(`${BASE_URL_USER_DATA}/users/${uid}.json`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const userData = await response.json();
    localStorage.setItem('uid', uid);
    localStorage.setItem('data', JSON.stringify(userData));
}


//  Funktion die den geloggten User vom local Storage holt.
function getLoggedInUser() {
    return localStorage.getItem('uid');
}


// lädt die Data abhängig vom User ( je nach UID), wird benötigt um die Kontakte und die Tasks die der User gespeichert hat, zu loaden.
async function loadSpecificUserDataFromLocalStorage() {
    let uid = getLoggedInUser();
    const response = await fetch(`${BASE_URL_USER_DATA}/users/${uid}.json`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const userData = await response.json();
    return userData;
}


async function updateUserData(uid, userData) {
    const response = await fetch($`{BASE_URL_USER_DATA}/users/${uid}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
}


// dient zum updaten der userData
async function updateUserData(uid, userData) {
    const response = await fetch(`${BASE_URL_USER_DATA}/users/${uid}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
}

async function updateUserContacts(uid, contacts) {
    const response = await fetch(`${BASE_URL_USER_DATA}/users/${uid}/contacs.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contacts)
    });
}

async function deleteUserData(uid, i) {
    let response = await fetch(`${BASE_URL_USER_DATA}/users/${uid}/contacts/${i}.json`, {
        method: 'DELETE',
    });
    return responseToJson = await response.json();
}

// die Funktion wird erst beim ausloggen benötigt, um die UID des ausgeloggten User aus dem local Storage zu löschen
function clearLoggedInUser() {
    localStorage.removeItem('uid');
}

function addTask() {
    addTaskClicked = true;
    console.log("Task add button clicked");
}

async function addTaskAndCreateContact() {
    // Daten laden
    let userData = await loadSpecificUserDataFromLocalStorage();
    let uid = localStorage.getItem('uid');

    // Prüfen, welcher Button geklickt wurde
    let addTaskButtonClicked = document.getElementById('addTaskButton').clicked;
    let newContactButtonClicked = document.getElementById('newContactButton').clicked;

    if (addTaskButtonClicked) {
        // Daten für die Aufgabe
        let taskTitle = document.getElementById('taskTitle').value;
        let taskDescription = document.getElementById('taskDescription').value;
        let date = document.getElementById('date').value;
        let lastClickedButton = localStorage.getItem('lastClickedButton');
        let selectedCategory = localStorage.getItem('selectedCategory');
        let contacts = JSON.parse(localStorage.getItem('contacts'));
        let subtasks = JSON.parse(localStorage.getItem('subtasks'));

        let task = { 
            name: taskTitle, 
            description: taskDescription, 
            date: date, 
            category: selectedCategory, 
            contacts: contacts, 
            subtasks: subtasks 
        };

        // Post-Anfrage für die Aufgabe
        post('/users/' + uid + '/tasks', task)
            .then(function(taskResponse) {
                console.log('Task added:', taskResponse);

                if (lastClickedButton === 'urgentButton') {
                    userData.urgentTasks = userData.urgentTasks || [];
                    userData.urgentTasks.push(task);
                } else if (lastClickedButton === 'mediumButton') {
                    userData.mediumTasks = userData.mediumTasks || [];
                    userData.mediumTasks.push(task);
                } else if (lastClickedButton === 'lowButton') {
                    userData.lowTasks = userData.lowTasks || [];
                    userData.lowTasks.push(task);
                }

                return updateUserData(uid, userData);
            })
            .then(function() {
                console.log('User data updated');
            })
            .catch(function(error) {
                console.error('Error posting task:', error);
            });

    } else if (newContactButtonClicked) {
        // Daten für den Kontakt
        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let number = document.getElementById('number').value;
        let color = getRandomColor();

        let contact = { 
            name: name,
            email: email, 
            number: number, 
            backgroundcolor: color 
        };

        // Post-Anfrage für den Kontakt
        post('/users/' + uid + '/contacts', contact)
            .then(function(contactResponse) {
                console.log('Contact posted:', contactResponse);

                checkExistingInitials();
                displayInitialsFilter();
                displayInitialsAndContacts();
                closeDialog();
            })
            .catch(function(error) {
                console.error('Error posting contact:', error);
            });
    }
}

function post(path = "", data = {}) {
    const BASE_URL = "https://join-gruppenarbeit-7a79e-default-rtdb.europe-west1.firebasedatabase.app/";
    return fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

// Event-Listener für die Buttons hinzufügen
document.getElementById('addTaskButton').addEventListener('click', function() {
    document.getElementById('addTaskButton').clicked = true;
    addTaskAndCreateContact();
});

document.getElementById('newContactButton').addEventListener('click', function() {
    document.getElementById('newContactButton').clicked = true;
    addTaskAndCreateContact();
});

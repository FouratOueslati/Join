const BASE_URL_USER_DATA = "https://join-gruppenarbeit-7a79e-default-rtdb.europe-west1.firebasedatabase.app/";


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

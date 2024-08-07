const BASE_URL_USER_DATA = "https://join-211-default-rtdb.europe-west1.firebasedatabase.app/";


/**
 * This function load usar data from URL
 * 
 * @param {string} path 
 * @returns {object}
 */
async function loadUserData(path = "") {
    let response = await fetch(BASE_URL_USER_DATA + path + ".json");
    return await response.json();
}


/**
 * This function load user date and save in the local storage
 * 
 * @param {string} uid 
 */
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


async function setLoggedInGuest(email, password) {
    localStorage.removeItem('uid');
    localStorage.removeItem('data');
    let data = await loadUserData("users");
    let users = Object.entries(data);
    let foundUser = users.find(([uid, u]) => u.email === email && u.password === password);
    let userUID = foundUser[0];
    await setLoggedInUser(userUID);
}


/**
 * This function recall the id of a user from the loacal storage
 * 
 * @returns {string}
 */
function getLoggedInUser() {
    return localStorage.getItem('uid');
}


/**
 * This function load the specific user data of the logged in user from the local storage
 * 
 * @returns {object}
 */
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

/**
 * This function load the tasks of an user width low category
 * 
 * @returns {object}
 */
async function getLowTasks() {
    const response = await fetch(`${BASE_URL_USER_DATA}/users/${uid}/lowTasks.json`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const lowTasks = await response.json();
    console.log(lowTasks)
    return lowTasks;
}

/**
 * This function load the tasks of an user width medium category
 * 
 * @returns {object}
 */
async function getMediumTasks() {
    const response = await fetch(`${BASE_URL_USER_DATA}/users/${uid}/mediumTasks.json`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const mediumTasks = await response.json();
    console.log(mediumTasks)
    return mediumTasks;
}

/**
 * This function load the tasks of an user width urgent category
 * 
 * @returns {object}
 */
async function getUrgentTasks() {
    const response = await fetch(`${BASE_URL_USER_DATA}/users/${uid}/urgentTasks.json`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const urgentTasks = await response.json();
    console.log(urgentTasks)
    return urgentTasks;
}


/**
 * This function update the user datas at the external storage
 * 
 * @param {string} uid 
 * @param {object} userData 
 */
async function updateUserData(uid, userData) {
    await fetch(`${BASE_URL_USER_DATA}/users/${uid}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
}


/**
 * This function update the user contacts at the external storage
 * 
 * @param {string} uid 
 * @param {object} contacts 
 */
async function updateUserContacts(uid, contacts) {
    await fetch(`${BASE_URL_USER_DATA}/users/${uid}/contacs.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contacts)
    });
}

/**
 * This function delete the user contacts at the external storage
 * 
 * @param {string} uid 
 * @param {object} contactId 
 * @returns {object}
 */
async function deleteUserContact(uid, contactId) {
    const response = await fetch(`${BASE_URL_USER_DATA}/users/${uid}/contacts/${contactId}.json`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

/**
 * This function delete the user tasks at the external storage
 * 
 * @param {string} uid 
 * @param {object} taskId 
 * @returns {object}
 */
async function deleteUserTask(uid, taskId) {
    const response = await fetch(`${BASE_URL_USER_DATA}/users/${uid}/tasks/${taskId}.json`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

/**
 * This function edit the contacts of an user
 * 
 * @param {string} path 
 * @param {object} data 
 * @returns {object}
 */
function postContacts(path = "", data = {}) {
    return fetch(BASE_URL_USER_DATA + path + ".json", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    })
}


/**
 * This function delete the datas of the logged in user at the local storage and logged out the user
 */
function clearLoggedInUser() {
    localStorage.removeItem('uid');
}


/**
 * This function edit the tasks of an user
 * 
 * @param {string} path 
 * @param {object} data 
 * @returns {object}
 */
function postTask(path = "", data = {}) {
    return fetch(BASE_URL_USER_DATA + path + ".json", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    })
}

/**
 * This function load the tasks of an user from the local storage
 * 
 * @returns {object}
 */
async function loadAllTasksFromStorage() {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let tasks = userData.tasks;
    return tasks;
}
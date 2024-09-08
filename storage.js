const BASE_URL_USER_DATA = "https://join-1e4bf-default-rtdb.europe-west1.firebasedatabase.app/";


/**
 * This function load user data from URL
 * 
 * @param {string} path 
 * @returns {object}
 */
async function loadUserData(path = "users") {
    let response = await fetch(BASE_URL_USER_DATA + path + ".json");
    return await response.json();
}


/**
 * This function saves the user data in external storage
 * 
 * @param {string} path 
 * @param {object} data 
 * @returns {object}
 */
async function postUser(path, data) {
    let response = await fetch(`${BASE_URL_USER_DATA}/${path}.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    let responseToJson = await response.json();
    return responseToJson;
}


/**
 * This function load userdata, check the datas and if the user exist
 * it save the datas in local storage and put the status to logged in
 * 
 * @param {string} email 
 * @param {string} password 
 */
async function setLoggedInGuest(email, password) {
    let data = await loadUserData("users");
    let users = Object.entries(data);
    let foundUser = users.find(([uid, u]) => u.email === email && u.password === password);
    let userUID = foundUser[0];
    localStorage.setItem('loggedInGuest', JSON.stringify({ email: email, password: password }));
    await setLoggedInUser(userUID);
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
    return userData;
}


/**
 * This function get the datas of the signed up user from external storage
 * 
 * @param {string} uid 
 * @returns 
 */
async function setSignedUpUser(uid) {
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
 * This function recall the id of a user from the loacal storage
 * 
 * @returns {string}
 */
function getLoggedInUser() {
    return localStorage.getItem('uid');
}


/**
 * This function loads the specific user data of the logged in user from the local storage
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
 * This function loads the tasks of an user width low category
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
 * This function loads the tasks of an user width medium category
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
 * This function loads the tasks of an user width urgent category
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
 * This function updates the user datas at the external storage
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
 * This function updates the user contacts at the external storage
 * 
 * @param {string} uid 
 * @param {object} contacts 
 */
async function updateUserContacts(uid, contacts) {
    await fetch(`${BASE_URL_USER_DATA}/users/${uid}/contacts.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contacts)
    });
}


/**
 * This function updates the tasks of the user at the external storage
 * 
 * @param {string} uid 
 * @param {string} toBeEditedTaskId 
 * @param {object} task 
 */
async function updateUserTasks(uid, toBeEditedTaskId, task) {
    await fetch(`${BASE_URL_USER_DATA}/users/${uid}/tasks/${toBeEditedTaskId}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });
}


/**
 * This function deletes the user contacts at the external storage
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
 * This function deletes the removed user contact from tasks
 * 
 * @param {string} uid 
 * @param {number} taskKey 
 * @param {number} k 
 * @returns 
 */
async function deleteUserContactInTask(uid, task, singleContactInTask) {
    const response = await fetch(`${BASE_URL_USER_DATA}/users/${uid}/tasks/${task}/contacts/${singleContactInTask}.json`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}


/**
 * This function deletes the user tasks at the external storage
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
 * This function edits the contacts of an user
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
 * This function deletes the datas of the logged in user at the local storage and logged out the user
 */
function clearLoggedInUser() {
    localStorage.removeItem('uid');
}


/**
 * This function edits the tasks of an user
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
 * This function loads the tasks of an user from the local storage
 * 
 * @returns {object}
 */
async function loadAllTasksFromStorage() {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let tasks = userData.tasks;
    return tasks;
}
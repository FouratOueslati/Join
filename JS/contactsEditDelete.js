/**
 * This function display the contacts in mobile view under a screenwidth of 900px
 * 
 * @param {number} i 
 */
function openContactMobile(i) {
    let screenWidth = window.innerWidth;
    if (screenWidth < 900) {
        let contactBigContainer = document.getElementById('contactBigContainer');
        let contactsContainer = document.getElementById('contactsContainer');
        let contactHeadline = document.getElementById('contactHeadline');
        let arrowContact = document.getElementById('arrowContact');
        let btnEditContacts = document.getElementById('btnEditContacts');
        contactBigContainer.style.display = 'block';
        contactsContainer.classList.add('d-none');
        contactHeadline.style.display = 'block';
        arrowContact.style.display = 'block';
        btnEditContacts.classList.remove('d-none');
    }
}


/**
 * This function hide the mobile fiew of the contacts
 */
function closeContactMobile() {
    let contactBigContainer = document.getElementById('contactBigContainer');
    let contactsContainer = document.getElementById('contactsContainer');
    let contactHeadline = document.getElementById('contactHeadline');
    let arrowContact = document.getElementById('arrowContact');
    contactBigContainer.style.display = 'none';
    contactsContainer.classList.remove('d-none');
    contactHeadline.style.display = 'none';
    arrowContact.style.display = 'none';
}


/**
 * This function open a menu to edit contacts in the mobile view
 */
function openEditSmallMenu() {
    let editDeleteMenuBox = document.getElementById('editDeleteMenuBox');
    editDeleteMenuBox.classList.remove('d-none');
}


/**
 * This function save the changes of the editet contact
 * 
 * @param {string} contactId 
 */
async function saveEditContact(contactId) {
    const isNameValid = validateName(`editName${contactId}`, `nameMessage${contactId}`);
    const isEmailValid = validateEmail(`editEmail${contactId}`, `emailMessage${contactId}`);
    const isNumberValid = validateNumber(`editNumber${contactId}`, `numberMessage${contactId}`);
    if (isNameValid && isEmailValid && isNumberValid) {
        let userData = await loadSpecificUserDataFromLocalStorage();
        const editedName = document.getElementById(`editName${contactId}`).value;
        const editedEmail = document.getElementById(`editEmail${contactId}`).value;
        const editedPhone = document.getElementById(`editNumber${contactId}`).value;
        const background = userData.contacts[contactId]['backgroundcolor'];
        userData.contacts[contactId] = {
            name: editedName, email: editedEmail, number: editedPhone, backgroundcolor: background
        };
        await updateUserData(uid, userData);
        await loadDataAfterChanges();
        document.getElementById('dialogNewEditContact').classList.add('d-none');
        closeDialog();
        location.reload();
    } else {
        console.log("Validation failed. Please correct the inputs.");
    }
}



/**
 * This function create and save an new contact
 * 
 * @param {number} i 
 */
async function createNewContact() {
    // Validating using static IDs for new contact creation and passing the message element IDs
    let isNameValid = validateName('name', 'nameCorrectIncorrect');
    let isEmailValid = validateEmail('email', 'emailCorrectIncorrect');
    let isNumberValid = validateNumber('number', 'numberCorrectIncorrect');

    if (isNameValid && isEmailValid && isNumberValid) {
        let uid = localStorage.getItem('uid');
        let name = document.getElementById('name').value.trim();
        let email = document.getElementById('email').value.trim();
        let number = document.getElementById('number').value.trim();
        let color = getRandomColor();
        let contact = { name: name, email: email, number: number, backgroundcolor: color };

        await postContacts('/users/' + uid + '/contacts', contact);
        await loadDataAfterChanges();
        closeDialog();
        openSuccessfullInfo();
        document.getElementById('contactInfos').innerHTML = '';
    }
}



function validateName(id, messageId) {
    let nameField = document.getElementById(id);
    let nameMessage = document.getElementById(messageId);
    let name = nameField ? nameField.value.trim() : '';

    if (!nameField || !/^\w+(\s+\w+){1,}$/.test(name)) {
        if (nameField) nameField.style.borderColor = 'red';  
        if (nameMessage) {
            nameMessage.textContent = '-Input Name surname';
            nameMessage.style.color = 'red';
        }
        return false;
    } else {
        nameField.style.borderColor = 'green';  
        if (nameMessage) {
            nameMessage.textContent = '';
            nameMessage.style.color = 'green';
        }
        return true;
    }
}

function validateEmail(id, messageId) {
    let emailField = document.getElementById(id);
    let emailMessage = document.getElementById(messageId);
    let email = emailField ? emailField.value.trim() : '';

    if (!emailField || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (emailField) emailField.style.borderColor = 'red';  
        if (emailMessage) {
            emailMessage.textContent = 'Input email: exampel@mail.com';
            emailMessage.style.color = 'red';
        }
        return false;
    } else {
        emailField.style.borderColor = 'green';  
        if (emailMessage) {
            emailMessage.textContent = '';
            emailMessage.style.color = 'green';
        }
        return true;
    }
}

function validateNumber(id, messageId) {
    let numberField = document.getElementById(id);
    let numberMessage = document.getElementById(messageId);
    let number = numberField ? numberField.value.trim() : '';

    if (!numberField || !/^\d{7,15}$/.test(number)) {
        if (numberField) numberField.style.borderColor = 'red';  
        if (numberMessage) {
            numberMessage.textContent = 'Incorrect number. It should be 7-15 digits.';
            numberMessage.style.color = 'red';
        }
        return false;
    } else {
        numberField.style.borderColor = 'green';  
        if (numberMessage) {
            numberMessage.textContent = '';
            numberMessage.style.color = 'green';
        }
        return true;
    }
}








/**
 * This function show the information that the user save a new contact
 */
function openSuccessfullInfo() {
    let successBox = document.getElementById('successBox');
    let successMessage = document.getElementById('successMessage');
    successBox.classList.remove('d-none');
    setTimeout(() => {
        successMessage.style.transform = "translateY(0%)";
    }, 2000);
    setTimeout(() => {
        successBox.classList.add('d-none');
    }, 2000);
}


/**
 * This function show the information that the user has deleted a contact
 */
function openSuccessfullDeleteInfo() {
    let successDeleteBox = document.getElementById('successDeleteBox');
    let successDeleteMessage = document.getElementById('successDeleteMessage');
    successDeleteBox.classList.remove('d-none');
    setTimeout(() => {
        successDeleteMessage.style.transform = "translateY(0%)";
    }, 2000);
    setTimeout(() => {
        successDeleteBox.classList.add('d-none');
    }, 2000);
}


/**
 * This function delete an existing contact
 * 
 * @param {string} contactId 
 */
async function deleteContact(contactId) {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let contacts = userData.contacts;
    const keys = Object.keys(contacts);
    for (let i = 0; i < keys.length; i++) {
        let contact = keys[i]
        if (contact === contactId) {
            delete userData.contacts[contactId];
            deleteContactInTask(contact);
        }
    }
    await deleteUserContact(uid, contactId);
    openSuccessfullDeleteInfo();
    await loadDataAfterChanges();
    closeDialog();
    document.getElementById('contactInfos').innerHTML = '';
}


/**
 * deletes the contact in all Tasks in desktop view
 */
async function deleteContactInTask(contact) {
    let userData = await loadSpecificUserDataFromLocalStorage();
    deleteContactFromTasks(userData, contact)
}


/**
 * This function delete contacts in  mobile view
 */
async function deleteContactMobileView() {
    let email = document.getElementById('emailOfContact').innerHTML;
    await deleteContactDataAndUpdateUI(email);
}


/**
 * This function checks whether the contact exist and deletes it from the user data
 * 
 * @param {string} email 
 */
async function deleteContactDataAndUpdateUI(email) {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let ToBeDeletedContactId = findContactIdByEmailToDelete(userData.contacts, email);
    if (ToBeDeletedContactId) {
        await deleteContactFromTasks(userData, ToBeDeletedContactId);
        await removeContactFromUserData(userData, ToBeDeletedContactId);
        await loadDataAfterChanges();
        closeDialog();
        openSuccessfullDeleteInfo();
        closeContactMobile();
        document.getElementById('contactInfos').innerHTML = '';
    }
}


/**
 * This function deletes the contact from the tasks
 * 
 * @param {object} userData 
 * @param {number} ToBeDeletedContactId 
 */
async function deleteContactFromTasks(userData, ToBeDeletedContactId) {
    let tasks = userData.tasks;
    let taskKeys = Object.keys(tasks);
    let AllContactsInTask = userData.contacts;
    for (let j = 0; j < taskKeys.length; j++) {
        const taskId = taskKeys[j];
        let task = tasks[taskId];
        if (!task.contacts) {
            continue; 
        }
        const contactsInTaskObj = task.contacts;
        let contactsInTask = Object.values(contactsInTaskObj);
        const contacts = contactsInTask.filter(singleContactInTask =>
            AllContactsInTask[ToBeDeletedContactId] && AllContactsInTask[ToBeDeletedContactId].name !== singleContactInTask.name
        );
        task.contacts = contacts;
        await updateUserTasks(uid, taskId, task);
    }
}

/**
 * This function deletes the removed contact from the user data
 * 
 * @param {object} userData 
 * @param {number} ToBeDeletedContactId 
 */
async function removeContactFromUserData(userData, ToBeDeletedContactId) {
    delete userData.contacts[ToBeDeletedContactId];
    await deleteUserContact(uid, ToBeDeletedContactId);
}


/**
 * This function get the informations to delete contacts width the fuction deleteContactMobileView()
 * 
 * @param {object} contacts 
 * @param {string} email 
 * @returns {string}
 */
function findContactIdByEmailToDelete(contacts, email) {
    const keys = Object.keys(contacts);
    for (let i = 0; i < keys.length; i++) {
        let contactId = keys[i];
        let contact = contacts[contactId];
        if (contact.email === email) {
            return contactId;
        }
    }
}


/**
 * This function get the data of a contact to edit them
 * 
 * @param {number} i 
 */
async function getEditContact(i) {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let contacts = userData.contacts;
    const keys = Object.keys(contacts);
    let contactId = keys[i];
    let currentContact = contacts[contactId];
    let name = currentContact.name;
    let email = currentContact.email;
    let number = currentContact.number;
    let backgroundcolor = currentContact.backgroundcolor;
    onloadFunc(contactId, name, email, number, backgroundcolor, currentContact, uid, userData);
}


/**
 * This function get the entered datas to save and update them
 * 
 * @param {string} contactId 
 * @param {string} name 
 * @param {string} email 
 * @param {number} number 
 * @param {string} backgroundcolor 
 * @param {string} currentContact 
 * @param {string} uid 
 * @param {object} userData 
 */
async function onloadFunc(contactId, name, email, number, backgroundcolor, currentContact, uid, userData) {
    let editname = document.getElementById(`editName${contactId}`).value;
    let editemail = document.getElementById(`editEmail${contactId}`).value;
    let editnumber = document.getElementById(`editNumber${contactId}`).value;
    currentContact.name = editname;
    currentContact.email = editemail;
    currentContact.number = editnumber;
    await updateUserData(uid, userData);
}


/**
 * This function show the menu to edit or delete a contact
 * 
 * @param {number} i 
 */
function showEditDeleteMenuBox(contactId) {
    let editDeleteMenuBox = document.getElementById('editDeleteMenuBox');
    editDeleteMenuBox.innerHTML = getEditDeleteMenuBoxHtml(contactId); 
}

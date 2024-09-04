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
    let userData = await loadSpecificUserDataFromLocalStorage();
    const editedName = document.getElementById(`editName${contactId}`).value;
    const editedEmail = document.getElementById(`editEmail${contactId}`).value;
    const editedPhone = document.getElementById(`editNumber${contactId}`).value;
    const background = userData.contacts[contactId]['backgroundcolor']
    userData.contacts[contactId] = {
        name: editedName, email: editedEmail, number: editedPhone, backgroundcolor: background
    };
    await updateUserData(uid, userData);
    await loadDataAfterChanges();
    document.getElementById('dialogNewEditContact').classList.add('d-none');
    closeDialog();
    location.reload();
}


/**
 * This function create and save an new contact
 * 
 * @param {number} i 
 */
async function createNewContact() {
    let uid = localStorage.getItem('uid');
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let number = document.getElementById('number').value;
    let color = getRandomColor();
    let contact = { name: name, email: email, number: number, backgroundcolor: color };
    await postContacts('/users/' + uid + '/contacts', contact)
    await loadDataAfterChanges();
    closeDialog();
    openSuccessfullInfo();
    document.getElementById('contactInfos').innerHTML = '';
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
    const keys = Object.keys(contacts);
    for (let i = 0; i < keys.length; i++) {
        let contact = keys[i]
        if (contact === contactId) {
            userData.contacts.splice(contactId, 1);
            deleteContactInTask(contact);
        }
    }
    await deleteUserContact(uid, contactId);
    openSuccessfullDeleteInfo();
    await loadDataAfterChanges();
    closeDialog();
    document.getElementById('contactInfos').innerHTML = '';
}


/*async function deleteContactInTask(contact) {
    debugger
    let uid = localStorage.getItem('uid');
    let userData = await loadSpecificUserDataFromLocalStorage()
    let tasks = userData.tasks;
    for (let j = 0; j < tasks.length; j++) {
        const task = tasks[j];
        const contactsInTask = task.contacts;
        for (let k = 0; k < contactsInTask.length; k++) {
            const singleContactInTask = contactsInTask[k];
            console.log(singleContactInTask)
            if (contact.name === singleContactInTask.name) {
                task.contacts.splice(singleContactInTask, 1);
            }
        }
    }
    await deleteUserContactInTask(uid, task, singleContactInTask)
}*/

/**
 * This function delete contacts in the mobile view
 */
async function deleteContactMobileView() {
    let email = document.getElementById('emailOfContact').innerHTML;
    let userData = await loadSpecificUserDataFromLocalStorage();
    let ToBeDeletedContactId = findContactIdByEmailToDelete(userData.contacts, email);
    if (ToBeDeletedContactId) {
        delete userData.contacts[ToBeDeletedContactId];
        await deleteUserContact(uid, ToBeDeletedContactId);
        await loadDataAfterChanges();
        closeDialog();
        openSuccessfullDeleteInfo();
        closeContactMobile();
        document.getElementById('contactInfos').innerHTML = '';
    }
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
    editDeleteMenuBox.innerHTML += getEditDeleteMenuBoxHtml(contactId);
}


function getContactsContainerHtml(i, firstLetterOfName, firstLetterOfLastName, firstName, lastName, email) {
    return `
        <div id="contactData${i}" class="contact-data" onclick="openContact(${i}), openContactMobile(${i})">
            <div id="contactsInitials${i}" class="shorts-name">${firstLetterOfName}${firstLetterOfLastName}</div>
            <div>
                <div id="contact-name${i}" class="contact-name">${firstName} ${lastName}</div>
                <div id="contact-email${i}" class="contact-email">${email}</div>
            </div>
        </div>
    `;
}


function displayInitialsFilterHtml(j, displayedLetter) {
    return `
        <div class="initial-box">
            <div id="initialLetter${j}" class="initial-letter">${displayedLetter}</div>
            <div class="separator"></div>
        </div>
        <div id="contactsContainer${j}">
        </div>
    `
}


function getContactInfosHtml(firstLetterOfName, firstLetterOfSurname, name, email, number, i, contactId) {
    return `
        <div>
            <div class="edit-delete-contact">
                    <div id="contactsInitialsBig${i}" class="shorts-name-big">${firstLetterOfName}${firstLetterOfSurname}</div>
                <div class="full-name">
                    <div id="nameOfContact">${name}</div>
                    <div class="edit-delete-box">
                            <img onclick="openEditContact(${i})" src="./img/edit_contacts.png">
                            <img onclick="deleteContact('${contactId}')" src="./img/delete_contact.png">
                    </div>
                </div>
            </div>
         <div class="contact-information">Contact Information</div>
            <div class="email-phone-box">
                <div class="email-phone-headline">Email</div>
                <div id="emailOfContact" class="email-phone join">${email}</div>
                <div class="email-phone-headline">Phone</div>
                <div id="numberOfContact" class="email-phone">${number}</div>
            </div>
        </div>
    `;
}


function getAddNewContactHtml() {
    return `
        <div onclick="doNotClose(event)" id="addNewContact" class="add-new-contact">
            <div class="add-contact-left">
                <div>
                    <img src="./img/Capa 3.png">
                    <div class="add-new-contact-headline">Add contact</div>
                    <div class="text-contact">Tasks are better width a team!</div>
                    <div class="blue-seperator-contact"></div>
                </div>
            </div>
            <div class="add-contact-right">
                <div class="close-add-contact">
                    <img src="./img/close.png" onclick="closeDialog()">
                </div>
                <div class="contact-box-right">
                    <img src="./img/Group 13.png" class="contact-img">
                    <div class="data-box">
                        <form onsubmit="createNewContact(); return false;" class="add-contact-data">
                                <input id="name" placeholder="Name" type="text" required class="name-input">
                                <input id="email" placeholder="Email" type="email" required class="email-input email-input-edit">
                                <input id="number" placeholder="Phone" type="tel" pattern="[0-9]*" required class="phone-input">
                          <div class="close-create-button">
                                <button type="button" class="color-white-button wht-btn-edit" onclick="closeDialog(event)">
                                <div class="button-txt-img">
                                Cancel
                                <img src="./addTaskImg/close.svg" class="close-svg" alt="Close">
                          </div>
                            </button>
                           <button type="submit" class="color-blue-button">
                            <div class="button-txt-img">
                             Create Contact
                              <img src="./addTaskImg/check.svg" class="check-svg" alt="Check">
                           </div>
                             </button>
                              </div>
                          </form>
                        <div id="newColor" class="shorts-name d-none"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}


function getEditContactHtml(firstLetterOfName, firstLetterOfLastName, name, email, number, backgroundcolor, contactId) {
    return `
        <div onclick="doNotClose(event)" id="editNewContact" class="add-new-contact">
            <div class="add-contact-left">
                <div>
                    <img src="./img/Capa 3.png">
                    <div class="add-new-contact-headline">Edit contact</div>
                    <div class="blue-seperator-contact"></div>
                </div>
            </div>
            <div class="add-contact-right">
                <div class="close-add-contact">
                    <img src="./img/close.png" onclick="closeDialog()">
                </div>
                <div class="contact-box-right">
                    <div id="edit-contactsInitialsBig${contactId}" class="edit-img">${firstLetterOfName}${firstLetterOfLastName}</div>
                    <form onsubmit="saveEditContact('${contactId}'); return false" class="data-box">
                        <div class="add-contact-data">
                            <input id="editName${contactId}" placeholder="Name" type="text" required class="name-input" value="${name}">
                            <input id="editEmail${contactId}" placeholder="Email" type="email" required class="email-input email-input-edit" value="${email}">
                            <input id="editNumber${contactId}" placeholder="Phone" type="tel" pattern="[0-9]*" required class="phone-input" value="${number}">
                        </div>
                        <div class="close-create-button">
                            <button type="button" onclick="deleteContact('${contactId}')" class="color-white-button delete-btn">
                                <div class="button-txt-img">Delete</div>
                            </button>
                            <button type="submit" class="color-blue-button">
                                <div class="button-txt-img">Save<img src="./addTaskImg/check.svg" class="check-svg"></div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>`;
}


function getEditContactHtmlMobileView(name, email, number, contactId) {
    return `
        <div onclick="doNotClose(event)" id="editNewContact" class="add-new-contact">
            <div class="add-contact-left">
                <div>
                    <img src="./img/Capa 3.png">
                    <div class="add-new-contact-headline">Edit contact</div>
                    <div class="blue-seperator-contact"></div>
                </div>
            </div>
            <div class="add-contact-right">
                <div class="close-add-contact">
                    <img src="./img/close.png" onclick="closeDialog()">
                </div>
                <div class="contact-box-right">
                    <div id="edit-contactsInitialsBig'${contactId}'" class="edit-img"></div>
                    <div class="data-box">
                        <div class="add-contact-data">
                            <input id="editName${contactId}" placeholder="Name" type="text" required class="name-input" value="${name}">
                            <input id="editEmail${contactId}" placeholder="Email" type="email" required class="email-input email-input-edit" value="${email}">
                            <input id="editNumber${contactId}" placeholder="Phone" type="text" required class="phone-input" value="${number}">
                        </div>
                        <div class="close-create-button">
                            <button onclick="deleteContact('${contactId}')" class="color-white-button delete-btn">
                                <div class="button-txt-img">Delete</div>
                            </button>
                            <button onclick="saveEditContact('${contactId}')" class="color-blue-button">
                                <div class="button-txt-img">Save<img src="./addTaskImg/check.svg" class="check-svg"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}


function getEditDeleteMenuBoxHtml(contactId) {
    return `
    <button onclick="editOpenedContactInMobileView()"><img src="./img/edit_contacts.png"></button>
    <button onclick="deleteContactMobileView(${contactId})"><img src="./img/delete_contact.png"></button>
    `
}
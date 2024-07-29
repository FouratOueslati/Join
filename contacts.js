let alphabet = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
]
let displayedLetters = [];
let contacts = [];
let uid = localStorage.getItem('uid');


async function init() {
    includeHTML();
    await loadUserData();
    await checkExistingInitials();
    displayInitialsFilter();
    await displayInitialsAndContacts();
    showLoggedUserInitials();
}


async function loadDataAfterChanges() {
    await loadUserData();
    await checkExistingInitials();
    displayInitialsFilter();
    await displayInitialsAndContacts();
}


/**
 * This function check the initials of the user and save them in the array
 */
async function checkExistingInitials() {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let contacts = userData.contacts;
    displayedLetters = [];
    if (contacts) {
        const keys = Object.keys(contacts);
        for (let i = 0; i < alphabet.length; i++) {
            let letter = alphabet[i];
            for (let j = 0; j < keys.length; j++) {
                let contactId = keys[j];
                let firstLetter = contacts[contactId]["name"].charAt(0);
                if (letter === firstLetter && displayedLetters.indexOf(letter) === -1) {
                    displayedLetters.push(firstLetter);
                }
            }
        }
    }
}


/**
 * This function create the first letters matching to the initials of an user
 */
function displayInitialsFilter() {
    let filteredContactContainer = document.getElementById('filteredContactsContainer');
    filteredContactContainer.innerHTML = '';
    for (let j = 0; j < displayedLetters.length; j++) {
        let displayedLetter = displayedLetters[j];
        filteredContactContainer.innerHTML += `
        <div class="initial-box">
            <div id="initialLetter${j}" class="initial-letter">${displayedLetter}</div>
            <div class="separator"></div>
        </div>
        <div id="contactsContainer${j}">
        </div>
        `;
    }
}


/**
 * This function shows all existing contacts
 */
async function displayInitialsAndContacts() {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let contacts = userData.contacts;
    for (let j = 0; j < displayedLetters.length; j++) {
        for (let j = 0; j < displayedLetters.length; j++) {
            let contactInitial = document.getElementById(`initialLetter${j}`);
            let contactsContainer = document.getElementById(`contactsContainer${j}`);
            contactsContainer.innerHTML = '';
            displayContactsByInitial(contacts, contactInitial, contactsContainer);
        }
    }
}

// wird eins drüber aufgerufen dass die obere Funktion funktioniert
function displayContactsByInitial(contacts, contactInitial, contactsContainer) {
    const keys = Object.keys(contacts);
    for (let i = 0; i < keys.length; i++) {
        let contactId = keys[i];
        let contact = contacts[contactId];
        let name = contact.name;
        let email = contact.email;
        let color = contact.backgroundcolor;
        let spaceIndex = name.indexOf(' ');
        let firstName = name.split(' ')[0];
        let lastName = name.split(' ')[1] || '';
        let firstLetterOfName = name.charAt(0);
        let firstLetterOfLastName = name.charAt(spaceIndex + 1);
        if (contactInitial.innerHTML === firstLetterOfName) {
            contactsContainer.innerHTML += getContactsContainerHtml(i, firstLetterOfName, firstLetterOfLastName, firstName, lastName, email);
            showColorForContact(i, color);
        }
    }
}


/**
 * This function shows the color for the contact
 * 
 * @param {string} i 
 * @param {string} color 
 */
function showColorForContact(i, color) {
    let contactInitial = document.getElementById(`contactsInitials${i}`);
    contactInitial.style.backgroundColor = color;
}


/**
 * This function load specific user datas, extracted and return the contact id
 * 
 * @param {string} contactId 
 * @returns {string}
 */
async function findIndexOf(contactId) {
    let userData = await loadSpecificUserDataFromLocalStorage();
    const keys = Object.keys(userData.contacts);
    return keys.indexOf(contactId);
}


// öffnet das Kontakt
async function openContact(i) {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let contacts = userData.contacts;
    const keys = Object.keys(contacts);
    let contactId = keys[i];
    let contact = contacts[contactId];
    let firstLetterOfName = document.getElementById(`contactsInitials${i}`).innerHTML.charAt(0);
    let firstLetterOfSurname = document.getElementById(`contactsInitials${i}`).innerHTML.charAt(1);
    let name = contact.name;
    let email = contact.email;
    let number = contact.number;
    let color = contact.backgroundcolor;
    let contactInfos = document.getElementById('contactInfos');
    contactInfos.innerHTML = '';
    contactInfos.innerHTML += getContactInfosHtml(firstLetterOfName, firstLetterOfSurname, name, email, number, i, contactId);
    showColorForBigContact(i, color);
    openContactChangeBgColor(i);
}


/**
 * This function check if an contact exists to change the background
 * 
 * @param {string} i 
 */
function openContactChangeBgColor(i) {
    let contactData = document.getElementById(`contactData${i}`);
    if (contactData) {
        changeBgColor(contactData);
    }
}


/**
 * This function change the background color of a selected contact
 * 
 * @param {string} contactData 
 */
function changeBgColor(contactData) {
    let allcontacts = document.querySelectorAll('.bg-contact-container');
    allcontacts.forEach(contact => {
        contact.classList.remove('bg-contact-container');
    });
    contactData.classList.add('bg-contact-container');
}


/**
 * This function show the random color for the selected contact
 * 
 * 
 * @param {string} i 
 * @param {string} color 
 */
function showColorForBigContact(i, color) {
    let contactInitialBig = document.getElementById(`contactsInitialsBig${i}`);
    contactInitialBig.style.backgroundColor = color;
    let contactData = document.getElementById(`contactData${i}`);
    contactData.classList.add('selected-contact-data');
}


/**
 * This function generate a random color
 * 
 * @returns {string}
 */
function getRandomColor() {
    let newColor = document.getElementById('newColor');
    let symbols = "89ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += symbols[Math.floor(Math.random() * symbols.length)];
    }
    newColor.style.backgroundColor = color;
    return color;
}


/**
 * This function open a new window to add a new contact
 */
function openAddNewContact() {
    let test = document.getElementById('dialogNewEditContact');
    test.innerHTML = getAddNewContactHtml();
    document.getElementById('dialogNewEditContact').classList.remove('d-none');
    let addNewContact = document.getElementById('addNewContact');
    addNewContact.style.transform = "translateX(113%)";
    setTimeout(() => {
        addNewContact.style.transform = "translateX(0)";
    }, 50);
    getRandomColor();
}


/**
 * This function close the window for add a new contact
 */
function closeDialog() {
    document.getElementById('dialogNewEditContact').classList.add('d-none');
}

// öffnet das Fentser um Kontakte zu editieren
async function openEditContact(i) {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let contacts = userData.contacts; // Extrahiert die Kontakte aus den geladenen Daten
    const keys = Object.keys(contacts); // Holt die Schlüssel des contacts-Objekts
    let contactId = keys[i]; // Wählt die Kontakt-ID basierend auf dem Index i
    let contact = contacts[contactId]; // Wählt den Kontakt basierend auf der Kontakt-ID aus
    let { name, email, number, backgroundcolor } = contact || {};
    let dialogEditContact = document.getElementById('dialogNewEditContact');
    let spaceIndex = name.indexOf(' ');
    let firstLetterOfName = name.charAt(0);
    let firstLetterOfLastName = spaceIndex !== -1 ? name.charAt(spaceIndex + 1) : ''; // Stellt sicher, dass das Leerzeichen gefunden wurde
    dialogEditContact.innerHTML = getEditContactHtml(firstLetterOfName, firstLetterOfLastName, name, email, number, backgroundcolor, contactId);
    document.getElementById('dialogNewEditContact').classList.remove('d-none');
    let editContact = document.getElementById('editNewContact');
    let contactInitialBig = document.getElementById(`edit-contactsInitialsBig${contactId}`);
    contactInitialBig.style.backgroundColor = backgroundcolor;
    editContact.style.transform = "translateX(113%)";
    setTimeout(() => {
        editContact.style.transform = "translateX(0)";
    }, 50);
    await loadDataAfterChanges();
}


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


function openEditSmallMenu() {
    let editDeleteMenuBox = document.getElementById('editDeleteMenuBox');
    editDeleteMenuBox.classList.remove('d-none');
}


/**
 * This function save the changes of the editet contact
 * 
 * @param {*} contactId 
 */
async function saveEditContact(contactId) {
    let userData = await loadSpecificUserDataFromLocalStorage();
    const editedName = document.getElementById(`editName${contactId}`).value;
    const editedEmail = document.getElementById(`editEmail${contactId}`).value;
    const editedPhone = document.getElementById(`editNumber${contactId}`).value;
    const background = userData.contacts[contactId]['backgroundcolor']
    userData.contacts[contactId] = {
        name: editedName,
        email: editedEmail,
        number: editedPhone,
        backgroundcolor: background
    };
    await updateUserData(uid, userData);
    await loadDataAfterChanges();
    document.getElementById('dialogNewEditContact').classList.add('d-none');
    closeDialog();
}


/**
 * This function create and save an new contact
 * 
 * @param {*} i 
 */
async function createNewContact(i) {
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
    postContacts('/users/' + uid + '/contacts', contact)
    await loadDataAfterChanges();
    closeDialog();
    openEditContact(i);
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
        if (contact === contactId)
            userData.contacts.splice(contactId, 1);
        console.log(contact) // Remove the contact at index i
    }
    contactInfos.innerHTML = '';
    await deleteUserContact(uid, contactId);
    await loadDataAfterChanges();
}


/**
 * This function get the data of a contact to edit them
 * 
 * @param {string} i 
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
 * @param {string} number 
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
 * @param {*} i 
 */

function showEditDeleteMenuBox(i) {
    let editDeleteMenuBox = document.getElementById('editDeleteMenuBox');
    editDeleteMenuBox.innerHTML += getEditDeleteMenuBoxHtml(i);
}

function getEditDeleteMenuBoxHtml(i) {
    return `
    <button onclick="openEditContact('${i}')"><img src="./img/edit_contacts.png"></button>
    <button onclick="deleteContact()"><img src="./img/delete_contact.png"></button>
    `
}

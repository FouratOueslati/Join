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
        filteredContactContainer.innerHTML += displayInitialsFilterHtml(j, displayedLetter);
    }
}


/**
 * This function shows all existing contacts
 */
async function displayInitialsAndContacts() {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let contacts = userData.contacts;
    let ownDatas = userData;
    for (let j = 0; j < displayedLetters.length; j++) {
        for (let j = 0; j < displayedLetters.length; j++) {
            let contactInitial = document.getElementById(`initialLetter${j}`);
            let contactsContainer = document.getElementById(`contactsContainer${j}`);
            contactsContainer.innerHTML = '';
            displayContactsByInitial(contacts, contactInitial, contactsContainer, ownDatas);
        }
    }
}


// async function displayOwnDatas() {
//     let ownDatas = await loadSpecificUserDataFromLocalStorage();
//     let name = ownDatas.name;
//     let email = ownDatas.email;
//     let [firstName, lastName = ''] = name.split(' ');
//     let firstLetterOfName = firstName.charAt(0);
//     let firstLetterOfLastName = lastName.charAt(0);
//     let contactsContainer = document.getElementById('contactsContainer');
//     contactsContainer.innerHTML += getContactsContainerHtml(firstLetterOfName, firstLetterOfLastName, firstName, lastName, email);
// }


/**
 * This function sorted the contacts by firstname
 * 
 * @param {object} contacts 
 * @param {string} contactInitial 
 * @param {HTMLElement} contactsContainer 
 */
function displayContactsByInitial(contacts, contactInitial, contactsContainer) {
    Object.keys(contacts).forEach((contactId, i) => {
        let { name, email, backgroundcolor: color } = contacts[contactId];
        let [firstName, lastName = ''] = name.split(' ');
        let firstLetterOfName = name.charAt(0);
        let firstLetterOfLastName = lastName.charAt(0);
        if (contactInitial.innerHTML === firstLetterOfName) {
            contactsContainer.innerHTML += getContactsContainerHtml(i, firstLetterOfName, firstLetterOfLastName, firstName, lastName, email);
            showColorForContact(i, color);
        }
    });
}


/**
 * This function shows the color for the contact
 * 
 * @param {number} i 
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


/**
 * This function loads the contacts with all the informations and displays them
 * 
 * @param {number} i 
 */
async function openContact(i) {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let contacts = userData.contacts;
    let contactId = Object.keys(contacts)[i];
    let { name, email, number, backgroundcolor: color } = contacts[contactId];
    let initialsElement = document.getElementById(`contactsInitials${i}`).innerHTML;
    let [firstLetterOfName, firstLetterOfSurname] = initialsElement.split('');
    let contactInfos = document.getElementById('contactInfos');
    contactInfos.innerHTML = getContactInfosHtml(firstLetterOfName, firstLetterOfSurname, name, email, number, i, contactId);
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
 * This function displays the random color for the selected contact
 * 
 * 
 * @param {number} i 
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
    let ownBackgroundColor;
    let newColor = document.getElementById('newColor');
    let symbols = "789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += symbols[Math.floor(Math.random() * symbols.length)];
    }
    if (newColor) {
        newColor.style.backgroundColor = color;
        return color;
    } else {
        ownBackgroundColor = color;
        return ownBackgroundColor;
    }
}


/**
 * This function open a new window to add a new contact
 */
function openAddNewContact() {
    let dialogEditContact = document.getElementById('dialogNewEditContact');
    dialogEditContact.innerHTML = getAddNewContactHtml();
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
    document.getElementById('editDeleteMenuBox').classList.add('d-none');
}


/**
 * This funcion loads all the informations of an contact to edit it
 * 
 * @param {number} i 
 */
async function openEditContact(i) {
    debugger
    let { contacts } = await loadSpecificUserDataFromLocalStorage();
    let contactId = Object.keys(contacts)[i];
    let { name, email, number, backgroundcolor } = contacts[contactId] || {};
    let dialogEditContact = document.getElementById('dialogNewEditContact');
    let [firstLetterOfName, firstLetterOfLastName] = name ? [name.charAt(0), name.split(' ')[1] || ''] : ['', ''];
    dialogEditContact.innerHTML = getEditContactHtml(firstLetterOfName, firstLetterOfLastName, name, email, number, backgroundcolor, contactId);
    dialogEditContact.classList.remove('d-none');
    let contactInitialBig = document.getElementById(`edit-contactsInitialsBig${contactId}`);
    contactInitialBig.style.backgroundColor = backgroundcolor;
    contactInitialBig.innerHTML = `${firstLetterOfName}${firstLetterOfLastName.charAt(0)}`;
    setTimeout(() => {
        document.getElementById('editNewContact').style.transform = "translateX(0)";
    }, 50);
    await loadDataAfterChanges();
}


/**
 * This function open a menu to edit contacts
 */
async function editOpenedContactInMobileView() {
    const dialogEditContact = document.getElementById('dialogNewEditContact');
    const email = document.getElementById('emailOfContact').innerHTML;
    let userData = await loadSpecificUserDataFromLocalStorage();
    let ToBeEditedContactId = findContactIdByEmailToEdit(userData.contacts, email);
    if (ToBeEditedContactId) {
        dialogEditContact.innerHTML = getEditContactHtmlMobileView(
            document.getElementById('nameOfContact').innerHTML, email,
            document.getElementById('numberOfContact').innerHTML, ToBeEditedContactId
        );
        dialogEditContact.classList.remove('d-none');
        setTimeout(() => editContact.style.transform = "translateY(0%)", 50);
        await loadDataAfterChanges();
    }
}


/**
 * This function get the informations to edit contacts width the fuction editOpenedContactInMobileView()
 * 
 * @param {object} contacts 
 * @param {string} email 
 * @returns {object}
 */
function findContactIdByEmailToEdit(contacts, email) {
    const keys = Object.keys(contacts);
    for (let i = 0; i < keys.length; i++) {
        const contactId = keys[i];
        if (contacts[contactId].email === email) return contactId;
    }
}
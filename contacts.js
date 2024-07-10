let letters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
]
let displayedLetters = [];
let contacts = [];
let uid = localStorage.getItem('uid');

/**
 * This function load other functions
 */
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


// schaut ob die Initialien der Namen im Array Letters vorhanden sind
async function checkExistingInitials() {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let contacts = userData.contacts;
    displayedLetters = [];
    const keys = Object.keys(contacts);
    for (let i = 0; i < letters.length; i++) {
        let letter = letters[i];
        for (let j = 0; j < keys.length; j++) {
            let contactId = keys[j];
            let firstLetter = contacts[contactId]["name"].charAt(0);
            if (letter === firstLetter && displayedLetters.indexOf(letter) === -1) {
                displayedLetters.push(firstLetter);
            }
        }
    }
}

// generiert den Filter für die Kontakte, je nachdem welche Initialien vorhanden sind
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
 * @param {*} i 
 * @param {*} color 
 */
function showColorForContact(i, color) {
    let contactInitial = document.getElementById(`contactsInitials${i}`);
    contactInitial.style.backgroundColor = color;
}


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
    contactInfos.innerHTML += getContactInfosHtml(firstLetterOfName, firstLetterOfSurname, name, email, number, i);
    showColorForBigContact(i, color);
    openContactChangeBgColor(i);
}


function openContactChangeBgColor(i) {
    let contactData = document.getElementById(`contactData${i}`);
    if (contactData) {
        contactData.addEventListener("click", changeBgColor);
        function changeBgColor() {
            let allContacts = document.querySelectorAll('.bg-contact-container');
            allContacts.forEach(contact => {
                contact.classList.remove('bg-contact-container');
            });
            contactData.classList.add('bg-contact-container');
        }
    }
}


// generiert die Farbe und zeigt sie an
function showColorForBigContact(i, color) {
    let contactInitialBig = document.getElementById(`contactsInitialsBig${i}`);
    contactInitialBig.style.backgroundColor = color;
    let contactData = document.getElementById(`contactData${i}`);
    contactData.classList.add('selected-contact-data');
}

// generiert eine random Farbe
function getRandomColor() {
    let newColor = document.getElementById('newColor');
    let symbols, color;
    symbols = "0123456789ABCDEF";
    color = "#";
    let limitedSymbols = symbols.slice(0, 12);
    for (let i = 0; i < 6; i++) {
        color += limitedSymbols[Math.floor(Math.random() * limitedSymbols.length)];
    }
    newColor.style.backgroundColor = color;
    return color;
}

// öffnet das Window um ein neues Kontakt zu erstellen
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


function animateAddNewContact() {
    const screenWidth = window.innerWidth;
    const addNewContact = document.querySelector('.add-new-contact');
    if (screenWidth < 900) {
        addNewContact.style.transform = "translateY(100%)";
        addNewContact.classList.remove('d-none');
        setTimeout(() => {
            addNewContact.style.transform = "translateY(0)";
        }, 50);
    } else {
        addNewContact.style.transform = "translateX(113%)";
        addNewContact.classList.remove('d-none');
        setTimeout(() => {
            addNewContact.style.transform = "translateX(0)";
        }, 50);
    }
}


window.addEventListener('resize', animateAddNewContact);


// schließt das Window für add new contact
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
        contactBigContainer.style.display = 'block';
        contactsContainer.classList.add('d-none');
        contactHeadline.style.display = 'block';
        arrowContact.style.display = 'block';
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


// speichert die Änderungen der Kontakte
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

// erstellt eine neues Kontakt
async function createNewContact() {
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
}

// löscht ein Kontakt
async function deleteContact(contactId) {
    const keys = Object.keys(contacts);
    for (let i = 0; i < keys.length; i++) {
        let contact = keys[i]
        if (contact === contactId)
            userData.contacts.splice(contactId, 1);
        console.log(contact) // Remove the contact at index i
    }
    await deleteUserContact(uid, contactId);
    await loadDataAfterChanges();
}

// holt das Kontakt zu editieren
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

// wird eins drüber aufgerufen
async function onloadFunc(contactId, name, email, number, backgroundcolor, currentContact, uid, userData) {
    let editname = document.getElementById(`editName${contactId}`).value;
    let editemail = document.getElementById(`editEmail${contactId}`).value;
    let editnumber = document.getElementById(`editNumber${contactId}`).value;
    currentContact.name = editname;
    currentContact.email = editemail;
    currentContact.number = editnumber;
    await updateUserData(uid, userData);
}
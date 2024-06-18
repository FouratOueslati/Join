let letters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
]


let displayedLetters = [];


async function init() {
    includeHTML();
    loadUserData();
    checkExistingInitials();
    displayInitialsFilter();
    displayInitialsAndContacts();
}



async function checkExistingInitials() {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let contacts = userData.contacts;
    for (let i = 0; i < letters.length; i++) {
        for (let j = 0; j < contacts.length; j++) {
            let letter = letters[i];
            let firstLetter = contacts[j]["name"].charAt(0);
            if (letter === firstLetter && displayedLetters.indexOf(letter) === -1) {
                displayedLetters.push(firstLetter);
            }
        }
    }
}


async function displayInitialsFilter() {
    await loadSpecificUserDataFromLocalStorage();
    let filteredContactContainer = document.getElementById('filteredContactsContainer');
    filteredContactContainer.innerHTML = '';
    for (let i = 0; i < displayedLetters.length; i++) {
        let displayedLetter = displayedLetters[i];
        filteredContactContainer.innerHTML += `
        <div>
            <div id="initialLetter${i}" class="initial-letter">${displayedLetter}</div>
            <div class="separator"></div>
        </div>
        <div id="contactsContainer${i}">
        </div>
        `;
    }
}


async function displayInitialsAndContacts() {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let contacts = userData.contacts;
    for (let j = 0; j < displayedLetters.length; j++) {
        let contactInitial = document.getElementById(`initialLetter${j}`);
        let contactsContainer = document.getElementById(`contactsContainer${j}`);
        for (let i = 0; i < contacts.length; i++) {
            let name = contacts[i]["name"];
            let email = contacts[i]["email"];
            let color = contacts[i]["backgroundcolor"];
            let spaceIndex = name.indexOf(' ');
            let firstName = name.split(' ')[0];
            let lastName = name.split(' ')[1];
            let firstLetterOfName = name.charAt(0);
            let firstLetterOfLastName = name.charAt(spaceIndex + 1);
            if (contactInitial.innerHTML === firstLetterOfName) {
                contactsContainer.innerHTML += getContactsContainerHtml(i, firstLetterOfName, firstLetterOfLastName, firstName, lastName, email);
                showColorForContact(i, color);
            }
        }
    }
}

function showColorForContact(i, color) {
    let contactInitial = document.getElementById(`contactsInitials${i}`);
    contactInitial.style.backgroundColor = color;
}


function getContactsContainerHtml(i, firstLetterOfName, firstLetterOfLastName, firstName, lastName, email) {
    return `
    <div id="contactData${i}" class="contact-data" onclick="openContact(${i})">
        <div id="contactsInitials${i}" class="shorts-name">${firstLetterOfName}${firstLetterOfLastName}</div>
        <div>
            <div id="contact-name${i}" class="contact-name">${firstName} ${lastName}</div>
            <div id="contact-email${i}" class="contact-email">${email}</div>
        </div>
    </div>
    `;
}

async function openContact(i) {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let contacts = userData.contacts;
    let contactData = document.getElementById(`contactData${i}`);
    let firstLetterOfName = contactData.querySelector('.shorts-name').textContent.charAt(0);
    let firstLetterOfSurname = contactData.querySelector('.shorts-name').textContent.charAt(1);
    let name = contactData.querySelector('.contact-name').textContent;
    let email = contactData.querySelector('.contact-email').textContent;
    let phonenumber = contacts[i]["number"];
    let color = contacts[i]["backgroundcolor"];
    let contactInfos = document.getElementById('contactInfos');
    contactInfos.innerHTML = '';
    contactInfos.innerHTML += getContactInfosHtml(firstLetterOfName, firstLetterOfSurname, name, email, phonenumber, i);
    showColorForBigContact(i, color);
}


function showColorForBigContact(i, color) {
    let contactInitialBig = document.getElementById(`contactsInitialsBig${i}`);
    contactInitialBig.style.backgroundColor = color;
    let contactData = document.getElementById(`contactData${i}`);
    contactData.classList.add('selected-contact-data');
}


function getContactInfosHtml(firstLetterOfName, firstLetterOfSurname, name, surname, phonenumber, i) {
    return `
    <div>
        <div class="edit-delete-contact">
            <div id="contactsInitialsBig${i}" class="shorts-name-big">${firstLetterOfName}${firstLetterOfSurname}</div>
            <div class="full-name">${name}
                <div class="edit-delete-box">
                    <img onclick="openEditContact(${i})" src="./img/edit_contacts.png">
                    <img onclick="deleteContact(${i})" src="./img/delete_contact.png">
                </div>
            </div>
        </div>
        <div class="contact-information">Contact Information</div>
        <div class="email-phone-box">
            <div class="email-phone-headline">Email</div>
            <div class="email-phone join">${surname}</div>
            <div class="email-phone-headline">Phone</div>
            <div class="email-phone">${phonenumber}</div>
        </div>
    </div>
    `;
}


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


function openAddNewContact() {
    let test = document.getElementById('dialogNewEditContact');
    test.innerHTML = getAddNewContactHtml();
    document.getElementById('dialogNewEditContact').classList.remove('d-none');
    let addNewContact = document.getElementById('addNewContact');
    addNewContact.style.transform = "translateX(113%)";
    setTimeout(() => {
        addNewContact.style.transform = "translateX(0)";
    }, 50);
    openContact();
    getRandomColor();
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
                        <div>
                            <div class="add-contact-data">
                                <input id="name" placeholder="Name" type="text" required class="name-input">
                                <input id="email" placeholder="Email" type="email" required class="email-input">
                                <input id="phone" placeholder="Phone" type="text" required class="phone-input">
                            </div>
                            <div class="close-create-button">
                                <button class="color-white-button" onclick="closeDialog(event)">
                                    <div class="button-txt-img">Cancel<img src="./addTaskImg/close.svg" class="close-svg"></div>
                                </button>
                                <button class="color-blue-button">
                                    <div onclick="createNewContact()" class="button-txt-img">Create Contact <img src="./addTaskImg/check.svg"
                                            class="check-svg">
                                    </div>
                                </button>
                                <div id="newColor" class="shorts-name d-none"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    `;
}


function closeDialog() {
    document.getElementById('dialogNewEditContact').classList.add('d-none');
    document.getElementById('contactInfos').classList.add('d-none');
    document.getElementById('dialogEditContact').classList.add('d-none');
}


function doNotClose(event) {
    event.stopPropagation();
}


async function openEditContact(i) {
    debugger
    let userData = await loadSpecificUserDataFromLocalStorage();
    let contacts = userData.contacts;
    let dialogEditContact = document.getElementById('dialogNewEditContact');
    dialogEditContact.innerHTML = getEditContactHtml();
    dialogEditContact.classList.remove('d-none');
    let editContact = document.getElementById('editNewContact');
    editContact.style.transform = "translateX(113%)";
    setTimeout(() => {
        editContact.style.transform = "translateX(0)";
    }, 50);
    let name = document.getElementById('name-input');
    let email = document.getElementById('email-input');
    let number = document.getElementById('phone-input');
    name.value = contacts[i]['name'];
    email.value = contacts[i]['email'];
    number.value = contacts[i]['number'];
}


function getEditContactHtml() {
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
                    <img src="./img/Group 13.png" class="contact-img">
                    <div>
                        <div class="add-contact-data">
                            <input id="name-input" placeholder="Name" type="text" required class="name-input">
                                <input id="email-input" placeholder="Email" type="email" required class="email-input">
                                <input id="phone-input" placeholder="Phone" type="text" required class="phone-input">
                        </div>
                        <div class="close-create-button">
                            <button class="color-white-button" onclick="closeDialog(event)">
                                <div class="button-txt-img">Delete</div>
                            </button>
                            <button onclick="saveEditedContact()"class="color-blue-button">
                                <div class="button-txt-img">Save<img src="./addTaskImg/check.svg" class="check-svg">
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}


async function saveEditedContact() {
    debugger
    // Get the index of the contact being edited
    const contactIndex = document.getElementById('dialogNewEditContact').dataset.index;

    // Get the edited values from the form fields
    const editedName = document.getElementById('name-input').value;
    const editedEmail = document.getElementById('email-input').value;
    const editedPhone = document.getElementById('phone-input').value;

    try {
        // Assuming you have a function to get the current user's ID
        const userId = localStorage.getItem('uid'); // Replace with actual user ID
        let userData = await loadSpecificUserDataFromLocalStorage(); // Fetch the current user data
      

        console.log('User data before modification:', userData);

        // Update the contact data within the user data
        userData.contacts[contactIndex] = {
            name: editedName,
            email: editedEmail,
            number: editedPhone // Ensure the key matches the stored contact object
        };
        console.log('User data after modification:', userData);

        // Save the updated user data to Firebase
        await updateUserData(userId, userData);

        // Hide the edit form
        document.getElementById('dialogNewEditContact').classList.add('d-none');

        console.log('Contact updated successfully!');
    } catch (error) {
        console.error('Error updating contact: ', error);
    }
}


async function createNewContact() {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let uid = localStorage.getItem('uid');
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let number = document.getElementById('phone').value;
    let color = getRandomColor();
    let contact = { name: name, email: email, number: number, backgroundcolor: color };
    userData.contacts = userData.contacts || [];
    userData.contacts.push(contact);
    await updateUserData(uid, userData);
    checkExistingInitials();
    displayInitialsFilter();
    displayInitialsAndContacts();
}


async function deleteContact(uid, i) {
        let userData = await loadSpecificUserDataFromLocalStorage();
        userData.contacts.splice(i, 1);
        await deleteUserData(uid);
        checkExistingInitials();
        displayInitialsFilter();
        displayInitialsAndContacts();
}
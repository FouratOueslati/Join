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
}


async function checkExistingInitials() {
    let data = await loadUserData("contacts");
    let contacts = Object.values(data);
    for (let i = 0; i < letters.length; i++) {
        for (let j = 0; j < contacts.length; j++) {
            let letter = letters[i];
            let firstLetter = contacts[j]["name"].charAt(0);
            if (letter === firstLetter && displayedLetters.indexOf(letter) === -1) {
                displayedLetters.push(firstLetter);
            }
        }
    }
    console.log('Angezeigte Buchstaben:', displayedLetters);
}


async function displayInitialsFilter() {
    let data = await loadUserData("contacts");
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
    displayInitialsAndContacts();
}


async function displayInitialsAndContacts() {
    let data = await loadUserData("contacts");
    let contacts = Object.values(data);
    for (let j = 0; j < displayedLetters.length; j++) {
        let contactInitial = document.getElementById(`initialLetter${j}`);
        let contactsContainer = document.getElementById(`contactsContainer${j}`);
        for (let i = 0; i < contacts.length; i++) {
            let name = contacts[i]["name"];
            let email = contacts[i]["email"];
            let phonenumber = contacts[i]["number"];
            let color = contacts[i]["backgroundcolor"];
            let spaceIndex = name.indexOf(' ');
            let firstLetterOfName = name.charAt(0);
            let firstLetterOfLastName = name.charAt(spaceIndex + 1);
            let lastName = name.charAt(spaceIndex + contacts.length - 1);
            if (contactInitial.innerHTML === firstLetterOfName) {
                contactsContainer.innerHTML += getContactsContainerHtml(i, firstLetterOfName, firstLetterOfLastName, name, lastName, email, phonenumber);
                showColorForContact(i, color);
            }
        }
    }
}

function showColorForContact(i, color) {
    let contactInitial = document.getElementById(`contactsInitials${i}`);
    contactInitial.style.backgroundColor = color;
}


function getContactsContainerHtml(i, firstLetterOfName, firstLetterOfLastName, name, lastName, email) {
    return `
    <div id="contactData${i}" class="contact-data" onclick="openContact(${i})">
        <div id="contactsInitials${i}" class="shorts-name">${firstLetterOfName}${firstLetterOfLastName}</div>
        <div>
            <div id="contact-name${i}" class="contact-name">${name} ${lastName}</div>
            <div id="contact-email${i}" class="contact-email">${email}</div>
        </div>
    </div>
    `;
}

async function openContact(i) {
    let data = await loadUserData("contacts");
    let contacts = Object.values(data);
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
                    <img onclick="openEditContact()" src="./img/edit_contacts.png">
                    <img src="./img/delete_contact.png">
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
    for (let i = 0; i < 6; i++) {
        color = color + symbols[Math.floor(Math.random() * 16)];
    }
    newColor.style.backgroundColor = color;
    return color;
}

// function addColorToNewContact(i) {
//     let newShort = document.getElementById(`contactsInitials${i}`);
//     if (!newShort.style.backgroundColor) { // Überprüfen, ob noch keine Hintergrundfarbe zugewiesen wurde
//         newShort.style.backgroundColor = getRandomPastelColor();
//     }
// }


function openAddNewContact() {
    document.getElementById('dialogNewContact').classList.remove('d-none');
    let addNewContact = document.getElementById('addNewContact');
    addNewContact.style.transform = "translateX(113%)";
    setTimeout(() => {
        addNewContact.style.transform = "translateX(0)";
    }, 50);
    openContact();
    getRandomColor();
}


function closeDialog() {
    document.getElementById('dialogNewContact').classList.add('d-none');
    document.getElementById('contactInfos').classList.add('d-none');
    document.getElementById('dialogEditContact').classList.add('d-none');
}


function doNotClose(event) {
    event.stopPropagation();
}


function openEditContact() {
    document.getElementById('dialogEditContact').classList.remove('d-none');
    let editContact = document.getElementById('editNewContact');
    editContact.style.transform = "translateX(113%)";
    setTimeout(() => {
        editContact.style.transform = "translateX(0)";
    }, 50);
    getEditContactHtml();
}


function getEditContactHtml() {
    return `
    <div id="dialogEditContact" class="dialog-new-contact d-none" onclick="closeDialog()">
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
                        <input id="editName" placeholder="Name" type="text" required class="name-input">
                        <input id="editEmail" placeholder="Email" type="email" required class="email-input">
                        <input id="editPhone" placeholder="Phone" type="text" required class="phone-input">
                    </div>
                    <div class="close-create-button">
                        <button class="color-white-button" onclick="closeDialog(event)">
                            <div class="button-txt-img">Delete</div>
                        </button>
                        <button class="color-blue-button">
                            <div onclick="" class="button-txt-img">Save<img src="./addTaskImg/check.svg"
                                    class="check-svg">
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
    `;
}


async function createNewContact(path = "contacts", data = {}) {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let number = document.getElementById('phone');
    let color = getRandomColor();
    data = {
        name: name.value,
        email: email.value,
        number: number.value,
        backgroundcolor: color,
    }
    console.log(data);
    let response = await fetch(BASE_URL_USER_DATA + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    loadUserData();
    closeDialog();
    return responseToJson = await response.json();
}


async function editContacts(path = "contacts", data = {}) {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let number = document.getElementById('phone');

    data = {
        name: name.value,
        email: email.value,
        number: number.value,
    }
    let response = await fetch(BASE_URL_USER_DATA + path + ".json", {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    loadUserData();
    closeDialog();
    return responseToJson = await response.json();
}


async function deleteContact(path = "contacts", data = {}) {
    let response = await fetch(BASE_URL_USER_DATA + path + ".json", {
        method: "DELETE",

    });
    return responseToJson = await response.json();
}
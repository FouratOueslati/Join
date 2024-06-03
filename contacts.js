const BASE_URL_USER_DATA = "https://joincontacts-default-rtdb.europe-west1.firebasedatabase.app/";


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


async function loadUserData(path = "") {
    let response = await fetch(BASE_URL_USER_DATA + path + ".json");
    return responseToJson = await response.json();
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
}


function getContactInfosHtml(firstLetterOfName, firstLetterOfSurname, name, surname, phonenumber, i) {
    return `
    <div>
        <div class="edit-delete-contact">
            <div id="contactsInitialsBig${i}" class="shorts-name-big">${firstLetterOfName}${firstLetterOfSurname}</div>
            <div class="full-name">${name}
                <div class="edit-delete-box">
                    <img src="./img/edit_contacts.png">
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


function getRandomPastelColor() {
    var r = Math.floor(Math.random() * 256); // Rote Komponente
    var g = Math.floor(Math.random() * 256); // Grüne Komponente
    var b = Math.floor(Math.random() * 256); // Blaue Komponente


    // // Umwandlung in Pastellfarben durch Hinzufügen von Weiß
    // r = Math.floor((r + 255) / 2);
    // g = Math.floor((g + 255) / 2);
    // b = Math.floor((b + 255) / 2);

    return 'rgb(' + r + ',' + g + ',' + b + ')';
}


function addColorToNewContact(i) {
    let newShort = document.getElementById(`contactsInitials${i}`);
    if (!newShort.style.backgroundColor) { // Überprüfen, ob noch keine Hintergrundfarbe zugewiesen wurde
        newShort.style.backgroundColor = getRandomPastelColor();
    }
}


function addNewContact() {
    let addNewContact = document.getElementById('addNewContact');
    document.getElementById('dialogNewContact').classList.remove('d-none');
    addNewContact.style.transform = "translateX(113%)"
    setTimeout(() => {
        addNewContact.style.transform = "translateX(0)";
    }, 50);
}


function closeDialog() {
    document.getElementById('dialogNewContact').classList.add('d-none');
    document.getElementById('contactInfos').classList.add('d-none');
}


async function postUser(path = "", data = {}) {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let confirmedPassword = document.getElementById('confirmedPassword');

    data = {
        name: name.value,
        email: email.value,
        phone: password.value,
        confirmedPassword: confirmedPassword.value,
    };
    if (password.value === confirmedPassword.value) {
        let response = await fetch(BASE_URL_USER_DATA + path + ".json", {
            method: "POST",
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        return responseToJson = await response.json();
    } else {
        alert("passwords don't match")
    }
}
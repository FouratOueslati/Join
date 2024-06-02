function checkExistingInitials() {
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


function displayInitialsFilter() {
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


function displayInitialsAndContacts() {
    for (let j = 0; j < displayedLetters.length; j++) {
        let contactInitial = document.getElementById(`initialLetter${j}`);
        let contactsContainer = document.getElementById(`contactsContainer${j}`);
        for (let i = 0; i < contacts.length; i++) {
            let name = contacts[i]["name"];
            let surname = contacts[i]["surname"];
            let email = contacts[i]["email"];
            let phonenumber = contacts[i]["number"];
            let firstLetterOfName = name.charAt(0);
            let firstLetterOfSurname = surname.charAt(0);
            if (contactInitial.innerHTML === firstLetterOfName) {
                contactsContainer.innerHTML += getContactsContainerHtml(i, firstLetterOfName, firstLetterOfSurname, name, surname, email, phonenumber);
            addColorToNewContact(i)
            }
        }
    }
}


function getContactsContainerHtml(i, firstLetterOfName, firstLetterOfSurname, name, surname, email) {
    return `
    <div id="contactData${i}" class="contact-data" onclick="openContact(${i})">
        <div id="contactsInitials${i}" class="shorts-name">${firstLetterOfName}${firstLetterOfSurname}</div>
        <div>
            <div id="contact-name${i}" class="contact-name">${name} ${surname}</div>
            <div id="contact-email${i}" class="contact-email">${email}</div>
        </div>
    </div>
    `;
}

function openContact(i) {

    let contactData = document.getElementById(`contactData${i}`);
    let firstLetterOfName = contactData.querySelector('.shorts-name').textContent.charAt(0);
    let firstLetterOfSurname = contactData.querySelector('.shorts-name').textContent.charAt(1);
    let name = contactData.querySelector('.contact-name').textContent;
    let email = contactData.querySelector('.contact-email').textContent;
    let phonenumber = contacts[i]["number"];
    
    let contactInfos = document.getElementById('contactInfos');
    contactInfos.innerHTML = '';
    contactInfos.innerHTML += getContactInfosHtml(firstLetterOfName, firstLetterOfSurname, name, email, phonenumber, i);
    addColorToNewContact(i);
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
    document.getElementById('dialogNewContact').classList.remove('d-none');
}


function closeDialog() {
    document.getElementById('dialogNewContact').classList.add('d-none');
    document.getElementById('contactInfos').classList.add('d-none');
}


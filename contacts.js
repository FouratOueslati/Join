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
            let firstLetterOfName = name.charAt(0);
            let firstLetterOfSurname = surname.charAt(0);
            if (contactInitial.innerHTML === firstLetterOfName) {
                contactsContainer.innerHTML += getContactsContainerHtml(i, firstLetterOfName, firstLetterOfSurname, name, surname, email);
            }
        }
    }
}


function getContactsContainerHtml(i, firstLetterOfName, firstLetterOfSurname, name, surname, email) {
    return `
    <div class="contact-data">
        <div id="contactsInitials${i}" class="shorts-name">${firstLetterOfName}${firstLetterOfSurname}</div>
        <div>
            <div id="contact-name${i}" class="contact-name">${name} ${surname}</div>
            <div id="contact-email${i}" class="contact-email">${email}</div>
        </div>
    </div>
    `;
}


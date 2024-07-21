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


function getContactInfosHtml(firstLetterOfName, firstLetterOfSurname, name, email, number, i) {
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
            <div class="email-phone join">${email}</div>
            <div class="email-phone-headline">Phone</div>
            <div class="email-phone">${number}</div>
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
                            <div class="add-contact-data">
                                <input id="name" placeholder="Name" type="text" required class="name-input">
                                <input id="email" placeholder="Email" type="email" required class="email-input email-input-edit">
                                <input id="number" placeholder="Phone" type="text" required class="phone-input">
                            </div>
                            <div class="close-create-button">
                                <button class="color-white-button wht-btn-edit" onclick="closeDialog(event)">
                                    <div class="button-txt-img">Cancel<img src="./addTaskImg/close.svg" class="close-svg"></div>
                                </button>
                                <button onclick="createNewContact()" class="color-blue-button">
                                    <div class="button-txt-img">Create Contact <img src="./addTaskImg/check.svg"
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

function getEditDeleteMenuBoxHtml(i) {
    return`
    <button onclick="openEditContact(i)"><img src="./img/edit_contacts.png"></button>
    <button onclick="deleteContact()"><img src="./img/delete_contact.png"></button>
    `
}


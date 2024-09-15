
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
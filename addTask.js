let namesOfUsers = [];

function onloadFunction() {
    displayName();
}

async function displayName() {
    let data = await loadUserData("contacts");
    let contacts = Object.values(data);
    for (let i = 0; i < contacts.length; i++) {
        let name = contacts[i]["name"];
        let color = contacts[i]["backgroundcolor"];
        namesOfUsers.push(name);
    }
    renderContact();
}

async function renderContact() {
    let containerContact = document.getElementById("contactList");
    for (let i = 0; i < namesOfUsers.length; i++) { 
        containerContact.innerHTML += generateContactToChose(namesOfUsers[i]); 
    }
}

function generateContactToChose(name) {
    return /*html*/ `
    <div class="contact-boarder">
        <div class="name-inicial">
        	<div class="circle-inicial"></div>
            <li id="${name}">${name}</li>
        </div>
        <div class="chek-box"></div>
    </div>
    `;
}


const BASE_URL_USER_DATA = "https://joincontacts-default-rtdb.europe-west1.firebasedatabase.app/";

function onloadFunction() {
    displayName();
}

async function loadUserData(path = "") {
    let response = await fetch(BASE_URL_USER_DATA + path + ".json");
    return await response.json(); 
}

async function displayName() {
    let containerContact = document.getElementById("contactList");
    let data = await loadUserData("contacts");
    let contacts = Object.values(data);
    for (let i = 0; i < contacts.length; i++) { 
        let name = contacts[i].name;
        let color = contacts[i].backgroundcolor;
        let initials = getInitials(name);
        containerContact.innerHTML += generateContactToChose(name, color, initials, i); 
    }
}

function getInitials(name) {
    let upperChars = "";
    let words = name.split(" ");  
    for (let word of words) {
        if (word.length > 0) {
            upperChars += word[0].toUpperCase();  
        }
    }
    return upperChars;
}

function generateContactToChose(name, color, initials, i) {
    return /*html*/ `
    <div class="contact-boarder">
        <div class="name-inicial">
            <div class="circle-inicial" style="background: ${color}">
                <div class="inicial-style">${initials}</div>
            </div>
            <li id="${name}">${name}</li>
        </div>
        <div class="chek-box-custom">
            <input type="checkbox" class="check-box-style" onclick="displayContactForAssignment()">
        </div>
    </div>
    `;
}

function displayContactForAssignment() {
    let containerBubbleInitials = document.getElementById('contactsDisplayBuble');
    containerBubbleInitials.innerHTML = '';
    let checkboxes = document.querySelectorAll('.check-box-style');
    for (let i = 0; i < checkboxes.length; i++) {
        let checkbox = checkboxes[i];
        if (checkbox.checked) {
            let contactElement = checkbox.closest('.contact-boarder');
            let nameElement = contactElement.querySelector('li');
            let initialsElement = contactElement.querySelector('.circle-inicial .inicial-style');
            let circleElement = contactElement.querySelector('.circle-inicial');
            let initials = initialsElement.innerText;
            let color = circleElement.style.background; 
            containerBubbleInitials.innerHTML += generateBubbleInitials(i, initials, color);
        }
    }
}

function generateBubbleInitials(i, initials, color) {
    return /* html */ `
    <div id="bubble-${i}" class="bubble-initial" style="background: ${color}">
        <span class="inicial-style">${initials}</span>
    </div>
    `;
}

function addSubtask() {
    subtaskInput = document.getElementById('subtask');  
    container = document.getElementById('subtaskContainer'); 
}

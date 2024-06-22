let subtaskCounter = 0;
// dieses Array wird benötigt um die Contacts zu den Tasks hinzufügen zu können
let assignedContacts = [];
// dieses Array wird benötigt um die subtasks zu den Tasks hinzufügen zu können
let subtasks = [];


function onloadFunction() {
    includeHTML();
    loadSubtasksFromLocalStorage();
    displayName();
}

// displays contacts names die man wählen kann
async function displayName() {
    let containerContact = document.getElementById("contactList");
    let userData = await loadSpecificUserDataFromLocalStorage();
    let contacts = userData.contacts;
    containerContact.innerHTML = '';  // Clear existing content
    for (let i = 0; i < contacts.length; i++) {
        let name = contacts[i].name;
        let color = contacts[i].backgroundcolor;
        let initials = getInitials(name);
        containerContact.innerHTML += generateContactToChose(name, color, initials, i);
    }
}

// displays contacts initials
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

// generates HTML für die Funktion displayName()
function generateContactToChose(name, color, initials, i) {
    return `
    <div class="contact-boarder">
        <div class="name-inicial">
            <div class="circle-inicial" style="background: ${color}">
                <div class="inicial-style">${initials}</div>
            </div>
            <li id="contact-${i}" data-name="${name}" class="contact-item">${name}</li>
        </div>
        <div class="check-box-custom">
            <input id="checkbox${i}" type="checkbox" class="check-box-style" data-name="${name}" onchange="choseContactForAssignment(event)">
        </div>
    </div>
    `;
}

// displays contacts names die man gewählt hat
function displayContactForAssignment() {
    let containerBubbleInitials = document.getElementById('contactsDisplayBuble');
    containerBubbleInitials.innerHTML = '';
    let checkboxes = document.querySelectorAll('.check-box-style');
    for (let i = 0; i < checkboxes.length; i++) {
        let checkbox = checkboxes[i];
        if (checkbox.checked) {
            let contactElement = checkbox.closest('.contact-boarder');
            let initialsElement = contactElement.querySelector('.circle-inicial .inicial-style');
            let circleElement = contactElement.querySelector('.circle-inicial');
            let initials = initialsElement.innerText;
            let color = circleElement.style.background;
            containerBubbleInitials.innerHTML += generateBubbleInitials(i, initials, color);
        }
    }
}

// generates HTML für die Funktion DisplayContactsForAssignment()
function generateBubbleInitials(i, initials, color) {
    return /* html */ `
    <div id="bubble-${i}" class="bubble-initial" style="background: ${color}">
        <span class="inicial-style">${initials}</span>
    </div>
    `;
}

// updates Inputfield des subtasks
function onInputChange() {
    let subtaskImg = document.getElementById('plusImg');
    let subtaskButtons = document.getElementById('closeOrAccept');
    let inputField = document.getElementById('inputFieldSubtask');
    if (inputField.value.length > 0) {
        subtaskImg.style.display = 'none';
        subtaskButtons.style.display = 'block';
    } else {
        subtaskImg.style.display = 'block';
        subtaskButtons.style.display = 'none';
    }
}


// fügt Subtaks hinzu
function addSubtask() {
    let container = document.getElementById('subtasksContainer');
    let subtask = document.getElementById('inputFieldSubtask').value;
    if (subtask.trim() !== '') {
        subtaskCounter++;
        subtasks.push(subtask);
        localStorage.setItem('subtasks', JSON.stringify(subtasks));
        let subtaskHTML = /*html*/`
        <div class="subtask-Txt" id="subtask-Txt-${subtaskCounter}">
            <div id="subtask${subtaskCounter}">${subtask}</div>
            <div class="delete-edit">
                <img src="./addTaskImg/edit.svg" onclick="editSubtask(${subtaskCounter})">
                <img src="./addTaskImg/delete.svg" onclick="deleteSubtask(${subtaskCounter})">
            </div>
        </div>`;
        container.innerHTML += subtaskHTML;
        document.getElementById('inputFieldSubtask').value = '';
    }
}

// loads subtask vom localStorage dass sie nicht verloren onload
function loadSubtasksFromLocalStorage() {
    let savedSubtasks = localStorage.getItem('subtasks');
    if (savedSubtasks) {
        subtasks = JSON.parse(savedSubtasks);
        subtaskCounter = subtasks.length ? subtasks[subtasks.length - 1].id : 0;
        displaySubtasks();
    }
}

// displays die subtasks vom localStorage
function displaySubtasks() {
    const container = document.getElementById('subtasksContainer');
    container.innerHTML = '';
    subtasks.forEach((subtask, index) => {
        let subtaskHTML = /*html*/`
        <div class="subtask-Txt" id="subtask-Txt-${index}">
            <div id="subtask${index}">${subtask}</div>
            <div class="delete-edit">
                <img src="./addTaskImg/edit.svg" onclick="editSubtask(${index})">
                <img src="./addTaskImg/delete.svg" onclick="deleteSubtask(${index})">
            </div>
        </div>`;
        container.innerHTML += subtaskHTML;
    });
}

// Function to delete a subtask
function deleteSubtask(index) {
    subtasks.splice(index, 1);
    localStorage.setItem('subtasks', JSON.stringify(subtasks));
    displaySubtasks();
}

// um subtasks zu editieren
function editSubtask(index) {
    let subtaskDiv = document.getElementById(`subtask${index}`);
    let text = subtaskDiv.innerHTML;
    document.getElementById('inputFieldSubtask').value = text;
    deleteSubtask(index)
    onInputChange();
}


function clearSubtaskInput() {
    let inpultField = document.getElementById('inputFieldSubtask');
    inpultField.value = '';
    onInputChange();
}

// AB HIER EVENTLISTENER FÜR DIE PRIO!!!!
document.addEventListener('DOMContentLoaded', (event) => {
    addPrioEventListeners();
    addCategoryEventListener();
});


function addPrioEventListeners() {
    document.getElementById('urgentButton').addEventListener('click', () => {
        localStorage.setItem('lastClickedButton', 'urgentButton');
    });

    document.getElementById('mediumButton').addEventListener('click', () => {
        localStorage.setItem('lastClickedButton', 'mediumButton');
    });

    document.getElementById('lowButton').addEventListener('click', () => {
        localStorage.setItem('lastClickedButton', 'lowButton');
    });
}


function addCategoryEventListener() {
    document.querySelectorAll('#categoryMenu li').forEach(category => {
        category.addEventListener('click', () => {
            localStorage.setItem('selectedCategory', category.textContent.trim());
        });
    });
}

// Kontakte wählen und im localStorage speichern
function choseContactForAssignment(event) {
    const checkbox = event.target;
    const contactName = checkbox.getAttribute('data-name');
    if (checkbox.checked) {
        if (!assignedContacts.includes(contactName)) {
            assignedContacts.push(contactName);
        }
    } else {
        assignedContacts = assignedContacts.filter(name => name !== contactName);
    }
    localStorage.setItem('contacts', assignedContacts)
}

// task adden
async function addTask() {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let taskTitle = document.getElementById('taskTitle').value;
    let taskDescription = document.getElementById('taskDescription').value;
    let date = document.getElementById('date').value;
    let lastClickedButton = localStorage.getItem('lastClickedButton');
    let selectedCategory = localStorage.getItem('selectedCategory');
    let contacts = JSON.parse(localStorage.getItem('contacts')); 
    let subtasks = JSON.parse(localStorage.getItem('subtasks')); 
    let uid = localStorage.getItem('uid');
    let task = { 
        name: taskTitle, 
        description: taskDescription, 
        date: date, 
        category: selectedCategory, 
        contacts: contacts, 
        subtasks: subtasks 
    };
    postTask('/users/' + uid + '/tasks', task)
        .then(async function(response) { 
            console.log('Task added:', response);
            if (lastClickedButton === 'urgentButton') {
                userData.urgentTasks = userData.urgentTasks || [];
                userData.urgentTasks.push(task);
            } else if (lastClickedButton === 'mediumButton') {
                userData.mediumTasks = userData.mediumTasks || [];
                userData.mediumTasks.push(task);
            } else if (lastClickedButton === 'lowButton') {
                userData.lowTasks = userData.lowTasks || [];
                userData.lowTasks.push(task);
            }

            await updateUserData(uid, userData); 

            console.log('User data updated');
        })
        .catch(function(error) {
            console.error('Error posting task:', error);
        });
}

function postTask(path = "", data = {}) {
    const BASE_URL_CONTACTS = "https://join-gruppenarbeit-7a79e-default-rtdb.europe-west1.firebasedatabase.app/";
    return fetch(BASE_URL_CONTACTS + path + ".json", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    })  
}


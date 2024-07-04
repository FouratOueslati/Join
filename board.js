let currentDraggedElement;
let currentTask = 0;

async function initBoard() {
    await displayOpenTasks();
}


async function displayOpenTasks() {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let toDoContainer = document.getElementById('open');
    let mediumTasks = userData.mediumTasks || {};
    let lowTasks = userData.lowTasks || {};
    let urgentTasks = userData.urgentTasks || {};
    let mediumTasksArray = Object.values(mediumTasks);
    let lowTasksArray = Object.values(lowTasks);
    let urgentTasksArray = Object.values(urgentTasks);
    let allTasksArray = urgentTasksArray.concat(lowTasksArray, mediumTasksArray);
    let allOpenTasks = allTasksArray.filter(task => task['dragCategory'] === 'open');
    toDoContainer.innerHTML = '';
    for (let i = 0; i < allOpenTasks.length; i++) {
        let task = allOpenTasks[i];
        toDoContainer.innerHTML += getOpenTaskHtml(task, i);
        await getContactInitials(task.contacts, i);
    }
}

// Html für die Funktion displayOpenTaks generieren
function getOpenTaskHtml(task, i) {
    return /*html*/`
    <div draggable="true" ondragstart="startDragging(${task.id})" class="todo" onclick="zoomTaskInfo(${i})" id="task${i}">
        <div class="task-category">
            <div class="category">${task['category']}</div>
        </div>
        <div class="task-title">${task['name']}</div>
        <div class="task-description">${task['description']}</div>
        <div class="subtasks-number-container">
            <img class="load-bar" src="./img/filler.png">
            <div class="subtasks">0/2 Subtasks</div>
        </div>
        <div class="initials-container" id="initialsContainer${i}"></div>
        <div id="myModal${i}" class="modal">
        <div class="modal-content">
            ${generateModalContent(task)}
        </div>
    </div>`;
}


function getInitials(name) {
    var upperChars = "";
    var words = name.split("");
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        if (word.length > 0) {
            upperChars += word[0].toUpperCase();
        }
    }
    return upperChars;
}


async function getContactInitials(contacts, i) {
    let contactInitialsContainer = document.getElementById(`initialsContainer${i}`);
    contactInitialsContainer.innerHTML = '';
    if (contacts && contacts.length > 0) {
        for (let j = 0; j < contacts.length; j++) {
            const contact = contacts[j];
            const initial = getInitials(contact.name);
            const color = contact.backgroundcolor;
            // VORSICHT, HIER KÖNNTE MAN SPÄTER ${i}-${j} BRAUCHEN
            contactInitialsContainer.innerHTML += `<div id="initials${j}" class="initials" style="background-color: ${color};">${initial}</div>`;
        }
    }
}

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    todos[currentDraggedElement]['category'] = category;
    updateHTML();
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

//New
function generateModalContent(task, i) {
    return /*html*/`
        <div>
            <div>${task['category']}</div>
            <div>${task['name']}</div>
            <div>${task['description']}</div>
            <div>${generateContactInitialsHtml(task['contacts'], i)}</div>
        </div>`;
}


function generateContactInitialsHtml(contacts, i) {
    if (!contacts || contacts.length === 0) return '';
    return contacts.map((contact, j) => {
        const initial = getInitials(contact.name);
        const color = contact.backgroundcolor;
        return `<div id="initials${i}-${j}" class="initials" style="background-color: ${color};">${initial}</div>`;
    }).join('');
}


async function loadDataIntoModal(modalContent, data, i) {
    modalContent.innerHTML = generateModalContent(data, task, i);
}


async function showModal(modal) {
    modal.display = block;
    document.body.style.overflow = "hidden";
    window.onclick = function (event) {
        if (event.target == modal) {
            closeModal(modal);
        }
    }
}


async function zoomTaskInfo(i) {
    const modal = document.getElementById(`myModal${i}`);
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    window.onclick = function (event) {
        if (event.target == modal) {
            closeModal(modal);
        }
    }
}


function closeModal(modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    window.onclick = null;
}


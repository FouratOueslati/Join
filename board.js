let currentDraggedElement;
let currentTask = 0;
let todos = {};

async function initBoard() {
    includeHTML();
    await displayOpenTasks();
    displayNamesOfContacts();
    showLoggedUserInitials();
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
    todos = allTasksArray.reduce((acc, task) => {
        acc[task.id] = task;
        return acc;
    }, {});
    toDoContainer.innerHTML = '';
    for (let i = 0; i < allOpenTasks.length; i++) {
        let task = allOpenTasks[i];
        toDoContainer.innerHTML += getOpenTaskHtml(task, i);
        await getContactInitials(task.contacts, i);
    }
}

// HTML for the displayOpenTasks function
function getOpenTaskHtml(task, i) {
    return /*html*/`
    <div draggable="true" ondragstart="startDragging(${task.id})" class="todo" onclick="zoomTaskInfo(${i})" id="task${i}">
        <div class="task-category">
            <div class="category">${task['category']}</div>
        </div>
        <div class="task-title">${task['name']}</div>
        <div id="desciption${i}" class="task-description">${task['description']}</div>
        <div class="subtasks-number-container">
            <img class="load-bar" src="./img/filler.png">
            <div class="subtasks">0/2 Subtasks</div>
        </div>
        <div class="initials-container" id="initialsContainer${i}"></div>
        <div id="myModal${i}" class="modal">
            <div class="modal-content">
                ${generateModalContent(task, i)}
            </div>
        </div>
    </div>`;
}

function getInitials(name) {
    var upperChars = "";
    var words = name.split(" ");
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
            contactInitialsContainer.innerHTML += `<div id="initials${i}-${j}" class="initials" style="background-color: ${color};">${initial}</div>`;
        }
    }
}
function openAddTaskInBoard() {
    let addTask = document.getElementById('addTaskContainerInBoard');
    addTask.classList.remove('d-none'); addTask.classList.add('addTask-container-background');
    let addTaskWindow = document.getElementById('addTaskPopUp');
    addTaskWindow.classList.add('bring-out-addTask-window');
}


function closeAddTaskInBoard() {
    let addTask = document.getElementById('addTaskContainerInBoard');
    addTask.classList.add('d-none');
    let addTaskWindow = document.getElementById('addTaskPopUp');
    addTaskWindow.classList.remove('bring-out-addTask-window');
}


function limitText(containerId, wordLimit) {
    var container = document.getElementById(containerId);
    if (container) {
        var words = container.innerText.split(' ');
        if (words.length > wordLimit) {
            var truncatedText = words.slice(0, wordLimit).join(' ') + ' ..';
            container.innerText = truncatedText;
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
    if (todos[currentDraggedElement]) {
        todos[currentDraggedElement]['dragCategory'] = category;
        updateHTML();
    }
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

function updateHTML() {
    let open = Object.values(todos).filter(t => t['dragCategory'] == 'open');
    document.getElementById('open').innerHTML = '';
    for (let index = 0; index < open.length; index++) {
        const element = open[index];
        document.getElementById('open').innerHTML += getOpenTaskHtml(element, index);
        getContactInitials(element.contacts, index);
    }

    let inprogress = Object.values(todos).filter(t => t['dragCategory'] == 'inprogress');
    document.getElementById('inprogress').innerHTML = '';
    for (let index = 0; index < inprogress.length; index++) {
        const element = inprogress[index];
        document.getElementById('inprogress').innerHTML += getOpenTaskHtml(element, index);
        getContactInitials(element.contacts, index);
    }

    let awaitfeedback = Object.values(todos).filter(t => t['dragCategory'] == 'awaitfeedback');
    document.getElementById('awaitfeedback').innerHTML = '';
    for (let index = 0; index < awaitfeedback.length; index++) {
        const element = awaitfeedback[index];
        document.getElementById('awaitfeedback').innerHTML += getOpenTaskHtml(element, index);
        getContactInitials(element.contacts, index);
    }

    let closed = Object.values(todos).filter(t => t['dragCategory'] == 'closed');
    document.getElementById('closed').innerHTML = '';
    for (let index = 0; index < closed.length; index++) {
        const element = closed[index];
        document.getElementById('closed').innerHTML += getOpenTaskHtml(element, index);
        getContactInitials(element.contacts, index);
    }
}

function generateTodoHTML(element) {
    return `<div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">${element['name']}</div>`;
}

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
    modalContent.innerHTML = generateModalContent(data, i);
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

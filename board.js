/*let todos = [{
    'id': 0,
    'title': 'Task 1',
    'category': 'open'
}, {
    'id': 1,
    'title': 'Task 2',
    'category': 'open'
}, {
    'id': 2,
    'title': 'Task 3',
    'category': 'closed'
}];*/

let currentDraggedElement;
let currentTask = 0;

async function initBoard() {
    await displayOpenTasks();
    displayInitialsOfAssignedContacts();
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
        let initials = task['initials']
        toDoContainer.innerHTML += getOpenTaskHtml(task, initials);
    }
}

// Html für die Funktion displayOpenTaks generieren
function getOpenTaskHtml(task, initials) {
    return `<div id="${task['id']}" draggable="true" ondragstart="startDragging(${task['id']})" class="todo">
    <div class="task-category">
        <div class="category">${task['category']}</div>
    </div>
    <div class="task-title">${task['name']}</div>
    <div class="task-description">${task['description']}</div>
    <div class="subtasks-number-container">
        <img class="load-bar" src="./img/filler.png">
        <div class="subtasks">0/2 Subtasks</div>
    </div>
    <div id="AssignedContactsContainer">${initials}</div>
</div>`;
}

function displayInitialsOfAssignedContacts() {
    let allOpenTasks = allTasksArray.filter(task => task['dragCategory'] === 'open');
console.log(allOpenTasks)
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
function extractTaskData(task) {
    let taskData = {};
    taskData.category = document.getElementById(`${task['category']}`);
    taskData.title = document.getElementById(`${task['name']}`);
    taskData.description = document.getElementById(`${task['description']}`);
    taskData.concats = document.getElementById(`${task['contacts']}`);
    return taskData;
}

function generateModalContent(data, task, i) {
    return /*html*/ `
    <div id="myModal${i}" class="modal">
        <div class='modal-content'>
            <div></div>
        </div>
    </div>
    ` 
}

async function loadDataIntoModal(modalContent, data, i) {
    modalContent.innerHTML = generateModalContent(data, task, i);
}

async function showModal(modal) {
    modal.display = block;
    document.body.style.overflow = "hidden";
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal(modal);
        }
    }
}

async function zoomTaskInfo(i) {
    currentTask = i;
    const modal = document.getElementById(`myModal${i}`);
    const modalContent = modal.querySelector('.modal-content');
    const taskData = extractTaskData(task);
    await loadDataIntoModal();
    showModal(modal);
}

function closeModal (modal) {
    modal.style.display = "none"
    document.body.style.overflow = "auto";
    window.onclick = null;
}

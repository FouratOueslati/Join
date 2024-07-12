
let currentDraggedElement;
let currentTask = 0;
let todos = [];

async function initBoard() {
    includeHTML();
    await displayOpenTasks();
    displayNamesOfContacts();
    showLoggedUserInitials();
}


document.addEventListener('DOMContentLoaded', (event) => {
    addDragCategoryEventListeners();
});

function addDragCategoryEventListeners() {
    document.getElementById('awaitFeedback').addEventListener('click', () => {
        localStorage.setItem('dragCategory', 'awaitfeedback');
    });
    document.getElementById('toDo').addEventListener('click', () => {
        localStorage.setItem('dragCategory', 'todo');
    });
    document.getElementById('inProgress').addEventListener('click', () => {
        localStorage.setItem('dragCategory', 'inprogress');
    });
}


async function displayOpenTasks() {
    const containers = {
        'todo': document.getElementById('toDoTasks'),
        'inprogress': document.getElementById('inProgressTasks'),
        'awaitfeedback': document.getElementById('feedbackTasks'),
        'done': document.getElementById('done')
    };
    for (let key in containers) {
        containers[key].innerHTML = '';
    }
    await processTasks(containers);
}


async function processTasks(containers) {
    const userData = await loadSpecificUserDataFromLocalStorage();
    const tasks = userData.tasks;
    if (tasks) {
        const taskIds = Object.keys(tasks);
        for (let i = 0; i < taskIds.length; i++) {
            const id = taskIds[i];
            const task = { id: id, task: tasks[id] };
            const category = tasks[id]['dragCategory'].trim();
            if (containers[category]) {
                containers[category].innerHTML += getToDoTaskHtml(task, i);
                await getContactInitials(task.task.contacts, i);
                todos.push(task); 
            }
        }
    }
    console.log(todos);
}



// HTML for the displayOpenTasks function
function getToDoTaskHtml(task, i) {
    return /*html*/`
    <div draggable="true" ondragstart="startDragging(${i})" class="todo-class" onclick="zoomTaskInfo(${i})" id="task${i}">
        <div class="task-category">
            <div class="category">${task['task']['category']}</div>
        </div>
        <div class="task-title">${task['task']['name']}</div>
        <div id="desciption${i}" class="task-description">${task['task']['description']}</div>
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

function startDragging(id) {
    currentDraggedElement = id;
}

function generateModalContent(task, i) {
    return /*html*/`
            <div class="category-opened">${task['task']['category']}</div>
            <div class="title-opened">${task['task']['name']}</div>
            <div class="description-opened">${task['task']['description']}</div>
            <div class="details-container">
                <span class="fine-written"> Due date:</span>
                <div class="space-correct"> ${task['task']['date']}</div>
            </div>
            <div class="details-container">
                <span class="fine-written"> Priority:</span>
                <div class="space-correct"> ${task['task']['priority']}</div>
            </div>
            <div class="assigned-to-container">
                  <div>Assigned To:</div>
                <div class="assigned-contacts-container">
                  <div >${generateContactInitialsAndNamesHtml(task['task']['contacts'], i)}</div>
                </div>
            </div>       
            <div>
              <div class="details-container">Subtasks</div>
              <div class="subtasks-opened">${generateSubtasksHtml(task['task']['subtasks'], i)}</div>
            </div>
        `;
}

function generateContactInitialsAndNamesHtml(contacts, i) {
    if (!contacts || contacts.length === 0) return '';
    let result = '';
    for (let j = 0; j < contacts.length; j++) {
        const contact = contacts[j];
        const initial = getInitials(contact.name);
        const color = contact.backgroundcolor;
        const contactName = contact.name;
        result += `
        <div class="assigned-contacts-and-intials-container">
            <div id="initials${i}-${j}" class="initials-opened" style="background-color: ${color};">${initial}</div>
            <div id="contact${i}-${j}">${contactName}</div>
        </div>
        `;
    }
    return result;
}


function generateSubtasksHtml(subtasks, i) {
    if (!subtasks || subtasks.length === 0) return '';
    let result = '';
    for (let j = 0; j < subtasks.length; j++) {
        const subtask = subtasks[j];
        result += `
        <div class="checkbox-and-subtask">
            <input type="checkbox" class="rectangle">
            <div>${subtask}</div>
        </div>
        `;
    }
    return result;
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

function closeModal(modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    window.onclick = null;
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

// zeigt die Initialien der Kontakte an
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

// limitiert den Text des Description
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


async function moveTo(category) {
    if (todos[currentDraggedElement]) {
        const currentCategory = todos[currentDraggedElement]['task']['dragCategory'];
        todos[currentDraggedElement]['task']['dragCategory'] = category;
        // den alten Container aktualisieren
        await updateContainer(currentCategory);
        // den neuen Container aktualisieren
        await updateContainer(category);
        removeSpecificColorFromDragArea();
    }
}


function allowDrop(ev) {
    ev.preventDefault();
}


function highlight() {
    document.querySelector('.drag-area').classList.add('drag-area-highlight');
}

function removeHighlight() {
    document.querySelector('.drag-area').classList.remove('drag-area-highlight');
}

// speichert die Änderung der dragCategory in Firebase
async function updateInFirebase(newDragCategory, taskId) {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let tasks = userData.tasks;
    if (tasks[taskId]) {
        tasks[taskId].dragCategory = newDragCategory;
        await updateUserData(uid, userData);
    }
}


async function updateContainer(category) {
    const containerIdMap = {
        'todo': 'toDoTasks',
        'inprogress': 'inProgressTasks',
        'awaitfeedback': 'feedbackTasks',
        'done': 'done'
    };
    const containerId = containerIdMap[category];
    if (containerId) {
        document.getElementById(containerId).innerHTML = "";
        await updateElements(category);
        renderElements(category, containerId);
    }
}

// Elemente in Firebase basierend auf der übergebenen category aktualisieren
async function updateElements(category) {
    for (let i = 0; i < todos.length; i++) {
        const element = todos[i];
        if (element.task.dragCategory === category) {
            await updateInFirebase(category, element.id);
        }
    }
}

//  HTML basierend auf der übergebenen category  rendern und sie dem spezifizierten Container anzufügen
function renderElements(category, containerId) {
    for (let i = 0; i < todos.length; i++) {
        const element = todos[i];
        if (element.task.dragCategory === category) {
            const container = document.getElementById(containerId);
            container.innerHTML += getToDoTaskHtml(element, i);
            getContactInitials(element.task.contacts, i);
        }
    }
}

function removeSpecificColorFromDragArea() {
    let containers = [
        document.getElementById('toDoTasks'),
        document.getElementById('inProgressTasks'),
        document.getElementById('feedbackTasks'),
        document.getElementById('done')
    ];
    let classRemove = 'drag-area';
    let classAdd = 'drag-area-full';
    for (let i = 0; i < containers.length; i++) {
        let container = containers[i];
        if (container && container.querySelector('div')) {
            console.log('Test');
            container.classList.remove(classRemove);
        } else {
            container.classList.add(classAdd);
        }
    }
}



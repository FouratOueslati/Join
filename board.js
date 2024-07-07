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
        localStorage.setItem('dragCategory', 'await feedback');
    });
    document.getElementById('toDo').addEventListener('click', () => {
        localStorage.setItem('dragCategory', 'to do');
    });
    document.getElementById('inProgress').addEventListener('click', () => {
        localStorage.setItem('dragCategory', 'in progress');
    });
}

async function displayOpenTasks() {
    let toDoContainer = document.getElementById('toDoTasks');
    let toDoInProgressContainer = document.getElementById('inProgressTasks');
    let toDoFeedbackContainer = document.getElementById('feedbackTasks');
    let userData = await loadSpecificUserDataFromLocalStorage();
    let tasks = userData.tasks;
    let taskIds = Object.keys(tasks);
    console.log(taskIds);
    for (let i = 0; i < taskIds.length; i++) {
        let id = taskIds[i];
        let task = { id: id, task: tasks[id] };
        if (tasks[id]['dragCategory'] === 'to do') {
            toDoContainer.innerHTML += getOpenTaskHtml(task, i);
        } else if (tasks[id]['dragCategory'] === 'in progress') {
            toDoInProgressContainer.innerHTML += getOpenTaskHtml(task, i);
        } else if (tasks[id]['dragCategory'] === 'await feedback') {
            toDoFeedbackContainer.innerHTML += getOpenTaskHtml(task, i);
        }
        await getContactInitials(task.task.contacts, i);
        todos.push(task);
    }
    console.log('Todos:', todos);
}



// HTML for the displayOpenTasks function
function getOpenTaskHtml(task, i) {
    return /*html*/`
    <div draggable="true" ondragstart="startDragging(${i})" class="todo" onclick="zoomTaskInfo(${i})" id="task${i}">
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


function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    if (todos[currentDraggedElement]) {
        todos[currentDraggedElement]['dragCategory'] = category;
        updateHTML();
    }
}

function highlight() {
    document.querySelector('.drag-area').classList.add('drag-area-highlight');
}

function removeHighlight() {
    document.querySelector('.drag-area').classList.remove('drag-area-highlight');
}

function updateHTML() {
    debugger
    let open = Object.values(todos).filter(t => t['dragCategory'] == 'open');
    for (let index = 0; index < open.length; index++) {
        const element = open[index];
        document.getElementById('toDoTasks').innerHTML += getOpenTaskHtml(element, index);
        getContactInitials(element.contacts, index);
    }

    let inprogress = Object.values(todos).filter(t => t['dragCategory'] == 'inprogress');
    for (let index = 0; index < inprogress.length; index++) {
        const element = inprogress[index];
        document.getElementById('inProgressTasks').innerHTML += getOpenTaskHtml(element, index);
        getContactInitials(element.contacts, index);
    }

    let awaitfeedback = Object.values(todos).filter(t => t['dragCategory'] == 'awaitfeedback');
    for (let index = 0; index < awaitfeedback.length; index++) {
        const element = awaitfeedback[index];
        document.getElementById('awaitFeedback').innerHTML += getOpenTaskHtml(element, index);
        getContactInitials(element.contacts, index);
    }

    let closed = Object.values(todos).filter(t => t['dragCategory'] == 'closed');
    for (let index = 0; index < closed.length; index++) {
        const element = closed[index];
        document.getElementById('closed').innerHTML += getOpenTaskHtml(element, index);
        getContactInitials(element.contacts, index);
    }
}





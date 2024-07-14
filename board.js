
let currentDraggedElement;
let currentTask = 0;
let todos = [];


async function initBoard() {
    includeHTML();
    await displayOpenTasks();
    displayNamesOfContacts();
    showLoggedUserInitials();
    removeSpecificColorFromDragArea();
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
            const category = tasks[id]['dragCategory'];
            if (containers[category]) {
                containers[category].innerHTML += getToDoTaskHtml(task, i);
                await getContactInitials(task.task.contacts, i);
                todos.push(task);
                await generateNumberOfSubtasks(i, task);
            }
        }
    }
}

// HTML for the displayOpenTasks function
function getToDoTaskHtml(task, i) {
    return /*html*/`
    <div draggable="true" ondragstart="startDragging(${i})" class="todo-class" onclick="zoomTaskInfo(${i})" id="task${i}">
        <div class="task-category">
            <div class="category">${task['task']['category']}</div>
        </div>
        <div id="taskTitle${i}" class="task-title">${task['task']['name']}</div>
        <div id="desciption${i}" class="task-description">${task['task']['description']}</div>
        <div class="subtasks-number-container">
            <img class="load-bar" src="./img/filler.png">
            <div id="subtasksNumber${i}" class="subtasks">
            </div>
        </div>
        <div class="initials-container" id="initialsContainer${i}"></div>
        <div id="myModal${i}" class="modal">
            <div class="modal-content">
              ${generateModalContent(task, i)}
            </div>
        </div>
    </div>`;
}


function generateModalContent(task, i) {
    return /*html*/`
        <div class="category-opened">${task['task']['category']}</div>
        <div class="title-opened">${task['task']['name']}</div>
        <div class="description-opened">${task['task']['description']}</div>
        <div class="details-container">
            <span class="fine-written">Due date:</span>
            <div class="space-correct">${task['task']['date']}</div>
        </div>
        <div class="details-container">
            <span class="fine-written">Priority:</span>
            <div class="space-correct">${task['task']['priority']}</div>
        </div>
        <div class="assigned-to-container">
            <div>Assigned To:</div>
            <div class="assigned-contacts-container">
                <div>${generateContactInitialsAndNamesHtml(task['task']['contacts'], i)}</div>
            </div>
        </div>
        <div>
            <div class="details-container">Subtasks</div>
            <div class="subtasks-opened">${generateSubtasksHtml(task['task']['subtasks'], i)}</div>
        </div>
        <div class="edit-delete-task-container">
        <img onclick="deleteContact(3)" src="./img/delete_contact.png">
        <div style="font-size: 12px;">|</div>
        <img onclick="openEditContact(3)" src="./img/edit_contacts.png">
        </div>
    `;
}

function generateSubtasksHtml(subtasks, i) {
    if (!subtasks || subtasks.length === 0) return '';
    let result = '';
    for (let j = 0; j < subtasks.length; j++) {
        const subtask = subtasks[j];
        result += `
        <div class="checkbox-and-subtask">
            <input id="subtaskCheckbox(${i}, ${j})" type="checkbox" class="subtask-checkbox" ${subtask.status === 'done' ? 'checked' : ''} onchange="toggleSubtaskStatus(${i}, ${j})">
            <div id="subtaskText(${i}, ${j})">${subtask.text}</div>
        </div>
        `;
    }
    return result;
}


// DIESE FUNKTION MUSS ICH MIR NOCHMAL GENAUER ANSCHAUEN ES FUNKTIONIERT NUR DANN WENN MAN PAGE REFRESH MACHT
async function generateNumberOfSubtasks(i, task) {
    const subtasksNumber = document.getElementById(`subtasksNumber${i}`);
    if (!subtasksNumber || !task.task || !Array.isArray(task.task.subtasks)) return;
    const subtasks = task.task.subtasks;
    const completedSubtasks = subtasks.filter(subtask => subtask.status === 'done').length;
    const numberOfSubtasks = subtasks.length;
    subtasksNumber.innerHTML = `${completedSubtasks}/${numberOfSubtasks} Subtasks`;
    generateSubtasksHtml(subtasks, i);
}


async function toggleSubtaskStatus(i, j) {
    let subtaskCheckbox = document.getElementById(`subtaskCheckbox(${i}, ${j})`);
    localStorage.setItem(`subtaskCheck(${i}, ${j})`, subtaskCheckbox.checked);
    let statusOfSubtask = JSON.parse(localStorage.getItem(`subtaskCheck(${i}, ${j})`));
    let subtaskText = document.getElementById(`subtaskText(${i}, ${j})`);
    let userData = await loadSpecificUserDataFromLocalStorage();
    let tasks = userData.tasks;
    let taskIds = Object.keys(tasks);
    let id = taskIds[i];
    let task = tasks[id];
    await findAndUpdateSubtask(tasks, subtaskText.innerHTML, statusOfSubtask);
    generateNumberOfSubtasks(i, task);
}


async function findAndUpdateSubtask(tasks, subtaskText, statusOfSubtask) {
    const taskIds = Object.keys(tasks);
    for (let taskIndex = 0; taskIndex < taskIds.length; taskIndex++) {
        const taskId = taskIds[taskIndex];
        let task = tasks[taskId];
        let subtasks = task.subtasks;
        const subtaskIds = Object.keys(subtasks);

        for (let subtaskIndex = 0; subtaskIndex < subtaskIds.length; subtaskIndex++) {
            const subtaskId = subtaskIds[subtaskIndex];
            let subtask = subtasks[subtaskId];

            if (subtaskText === subtask.text) {
                subtask.status = statusOfSubtask ? 'done' : 'undone';
                await updateSubtaskStatusInFirebase(subtask.status, taskId, subtaskId);
            }
        }
    }
}


async function updateSubtaskStatusInFirebase(status, taskId, subtaskId) {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let tasks = userData.tasks;
    if (tasks[taskId] && tasks[taskId].subtasks[subtaskId]) {
        tasks[taskId].subtasks[subtaskId].status = status;
        await updateUserData(uid, userData);
    }
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
            <div class="names-style" id="contact${i}-${j}">${contactName}</div>
        </div>
        `;
    }
    return result;
}


async function zoomTaskInfo(i) {
    const modal = document.getElementById(`myModal${i}`);
    modal.style.display = "flex";
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
    localStorage.removeItem('dragCategory');
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


function startDragging(id) {
    currentDraggedElement = id;
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
            await updateDragCategoryInFirebase(category, element.id);
        }
    }
}

// speichert die Änderung der dragCategory in Firebase
async function updateDragCategoryInFirebase(newDragCategory, taskId) {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let tasks = userData.tasks;
    if (tasks[taskId]) {
        tasks[taskId].dragCategory = newDragCategory;
        await updateUserData(uid, userData);
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
    removeSpecificColorFromDragArea();
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
            container.classList.remove(classRemove);
        } else {
            container.classList.add(classAdd);
        }
    }
}


function filterTask() {
    let search = document.getElementById('search').value.toLowerCase().slice(0, 3);
    if (search.length >= 3) {
        filterWithSearchTerm(search);
    } else {
        location.reload();
    } if (search.length === 0) {
        location.reload();
    }
}


function filterWithSearchTerm(searchTerm) {
    for (let i = 0; i < todos.length; i++) {
        let taskTitle = document.getElementById(`taskTitle${i}`).textContent.toLocaleLowerCase().slice(0, 3);
        let taskCard = document.getElementById(`task${i}`);
        if (taskTitle.includes(searchTerm)) {
            taskCard.style.display = 'block';
        } else {
            taskCard.style.display = 'none';
        }
    }
}

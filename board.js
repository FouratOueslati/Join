let currentDraggedElement;
let currentTask = 0;
let todos = [];


async function initBoard() {
    includeHTML();
    await displayOpenTasks();
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
                setCategoryColor(i);
                await getContactInitials(task.task.contacts, i);
                todos.push(task);
                await generateNumberOfSubtasks(i, task);
                await generatePriorityImgUnopened(i, task);
                updateLoadBar(i);
            }
        }
    }
}

// HTML for the displayOpenTasks function
function getToDoTaskHtml(task, i) {
    return /*html*/`
    <div draggable="true" ondragstart="startDragging(${i})" class="todo-class" onclick="zoomTaskInfo(${i})" id="task${i}">
        <div class="task-category">
            <div id="category${i}" class="category">${task['task']['category']}</div>
        </div>
        <div id="taskTitle${i}" class="task-title">${task['task']['name']}</div>
        <div id="desciption${i}" class="task-description">${task['task']['description']}</div>
        <div class="subtasks-number-container">
            <img id="loadBar${i}" class="load-bar">
            <div id="subtasksNumber${i}" class="subtasks">
            </div>
        </div>
        <div class="initials-and-priority-container">
          <div class="initials-container" id="initialsContainer${i}"></div>
          <img id="priorityImgUnopened${i}">
        </div>
        <div id="myModal${i}" class="modal">
            <div id="modal${i}" class="modal-content">
              ${generateModalContent(task, i)}
            </div>
        </div>
    </div>`;
}


function generateModalContent(task, i) {
    return /*html*/`
        <div class="category-opened-container">
            <div id="categoryOpened${i}" class="category-opened">${task['task']['category']}</div>
            <img onclick="closeModal(myModal${i})" src="./img/close.png">
        </div>
        <div id="openedTitle${i}" class="title-opened">${task['task']['name']}</div>
        <div class="description-opened">${task['task']['description']}</div>
        <div class="details-container">
            <span class="fine-written">Due date:</span>
            <div class="space-correct">${task['task']['date']}</div>
        </div>
        <div class="details-container">
            <span class="fine-written">Priority:</span>
            <div class="space-correct">
                <div id="openedPriority${i}">${task['task']['priority']}</div>
                <img id="priorityImg${i}">
            </div>
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
            <img onclick="deleteTask(${i})" src="./img/delete_contact.png">
            <div style="font-size: 12px;">|</div>
            <img onclick="editTask(${i})" src="./img/edit_contacts.png">
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
}


async function generatePriorityImgUnopened(i, task) {
    const img = document.getElementById(`priorityImgUnopened${i}`);
    let priority = task.task.priority;
    if (priority && priority === 'Medium') {
        img.src = "./addTaskImg/mediu.svg";
    } else if (priority && priority === 'Low') {
        img.src = "./addTaskImg/low.svg";
    } else if (priority && priority === 'Urgent') {
        img.src = "./addTaskImg/high.svg";
    }
}


function setCategoryColor(i) {
    let categoryContainer = document.getElementById(`category${i}`);
    if (categoryContainer.innerHTML === 'Technical Task') {
        categoryContainer.style.backgroundColor = 'rgb(31, 215, 193)';
    } else if (categoryContainer.innerHTML === 'User Story') {
        categoryContainer.style.backgroundColor = 'rgb(0, 56, 255)';
    }
}

function setCategoryColorOpened(i) {
    let categoryContainerOpened = document.getElementById(`categoryOpened${i}`);
    if (categoryContainerOpened.innerHTML === 'Technical Task') {
        categoryContainerOpened.style.backgroundColor = 'rgb(31, 215, 193)';
    } else if (categoryContainerOpened.innerHTML === 'User Story') {
        categoryContainerOpened.style.backgroundColor = 'rgb(0, 56, 255)';
    }
}

async function toggleSubtaskStatus(i, j) {
    let subtaskCheckbox = document.getElementById(`subtaskCheckbox(${i}, ${j})`);
    localStorage.setItem(`subtaskCheck(${i}, ${j})`, subtaskCheckbox.checked);
    let statusOfSubtask = JSON.parse(localStorage.getItem(`subtaskCheck(${i}, ${j})`));
    let userData = await loadSpecificUserDataFromLocalStorage();
    let tasks = userData.tasks;
    let taskIds = Object.keys(tasks);
    let id = taskIds[i];
    let task = tasks[id];
    await updateSubtaskStatus(tasks, i, j, statusOfSubtask);
    await generateNumberOfSubtasks(i, task);
    updateLoadBar(i);
}


async function updateSubtaskStatus(tasks, i, j, statusOfSubtask) {
    let taskIds = Object.keys(tasks);
    let taskId = taskIds[i];
    let task = tasks[taskId];
    let subtasks = task.subtasks;
    let subtaskIds = Object.keys(subtasks);
    let subtaskId = subtaskIds[j];
    let subtask = subtasks[subtaskId];
    subtask.status = statusOfSubtask ? 'done' : 'undone';
    await updateSubtaskStatusInFirebase(subtask.status, taskId, subtaskId);
}



async function updateSubtaskStatusInFirebase(status, taskId, subtaskId) {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let tasks = userData.tasks;
    if (tasks[taskId] && tasks[taskId].subtasks[subtaskId]) {
        tasks[taskId].subtasks[subtaskId].status = status;
        await updateUserData(uid, userData);
    }
}

function updateLoadBar(i) {
    const loadBar = document.getElementById(`loadBar${i}`);
    const subtaskNumber = document.getElementById(`subtasksNumber${i}`);
    switch (subtaskNumber.innerHTML) {
        case "1/2 Subtasks":
            loadBar.src = "./img/Progress-Bar-half.png";
            break;
        case "0/2 Subtasks":
        case "0/1 Subtasks":
            loadBar.src = "./img/Progress-Bar-empty.png";
            break;
        case "2/2 Subtasks":
        case "1/1 Subtasks":
            loadBar.src = "./img/filler.png";
            break;
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
    setCategoryColorOpened(i);
    window.onclick = function (event) {
        if (event.target == modal) {
            closeModal(modal);
        }
    }
    generatePriorityImgOpened(i);
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
    displayOpenTasks(); 
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


function generatePriorityImgOpened(i) {
    let priority = document.getElementById(`openedPriority${i}`);
    let img = document.getElementById(`priorityImg${i}`);
    if (priority && priority.innerHTML === 'Medium') {
        img.src = "./addTaskImg/mediu.svg";
    } else if (priority && priority.innerHTML === 'Low') {
        img.src = "./addTaskImg/low.svg";
    } else if (priority && priority.innerHTML === 'Urgent') {
        img.src = "./addTaskImg/high.svg";
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
            container.classList.remove('drag-area-no-elements');
            container.classList.add('drag-area-has-elements');
            container.innerHTML += getToDoTaskHtml(element, i);
            getContactInitials(element.task.contacts, i);
            generateNumberOfSubtasks(i, element);  // Ensure subtasks are generated
            generatePriorityImgUnopened(i, element);  // Ensure priority image is generated
            updateLoadBar(i);
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
    let classHasElements = 'drag-area-has-elements';
    let classNoElements = 'drag-area-no-elements';
    for (let i = 0; i < containers.length; i++) {
        let container = containers[i];
        container.classList.remove(classHasElements);
        container.classList.remove(classNoElements);
        if (container && container.querySelector('div')) {
            container.classList.add(classHasElements);
        } else {
            container.classList.add(classNoElements);
        }
    }
}


function filterTask() {
    let search = document.getElementById('search').value.toLowerCase().slice(0, 3);
    if (search.length >= 3) {
        filterWithSearchTerm(search);
        document.querySelector('.display-none-a').style.display = "block";
    } else {

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


async function deleteTask(i) {
    let taskTitle = document.getElementById(`openedTitle${i}`).innerHTML;
    let taskIndex = todos.findIndex(todo => taskTitle === todo.task.name);
    if (taskIndex !== -1) {
        const taskId = todos[taskIndex].id;
        await deleteUserTask(uid, taskId);
    }
    displayOpenTasks();
}

//New
function generateEditModalContent(task, i) {
    return /*html*/`
        <div class="category-opened-container">
            <div class="category-opened">${task.category}</div>
            <img id="closeImg${i}" src="./img/close.png">
        </div>
        <div class="modal-edit-content">
            <label for="editTaskTitle${i}" class="margin-span">Title:</label>
            <input id="taskTitle" required placeholder="Enter a title..." minlength="4" class="task-input-field" value="${task.name}">
            
            <label for="editTaskDescription${i}">Description:</label>
            <textarea style="height: 80px;" id="taskDescription" required placeholder="Enter a Description..." minlength="4" class="task-input-field">${task.description}</textarea>
           
            <label for="editTaskTitle${i}" class="margin-span">Assigned to:</label>
            <div class="inputs-flex">
                <div class="drop-down">
                    <div class="select">
                        <span class="selected" id="selectContact">Search Contact</span>
                        <div class="caret"></div>
                    </div>
                    <ul class="menu" id="contactListEdit"></ul>
                </div>
                <div class="bubble-setup">
                    <div id="contactsDisplayBubble" class="assigned-contacts-container"></div>
                </div>
            </div>

            <label for="editTaskDate${i}" class="margin-span">Due date:</label>
            <input id="date" type="date" class="task-input-field date" value="${task.date}">

            <label for="editTaskPriority${i}" class="margin-span">Priority:</label>
            <div class="button-prio-width">
        <button onclick="changeColorEdit(this); addPrioEventListenersEdit()" id="urgentButtonEdit" type="button" class="button-prio">
            <div class="center">
            <div class="button-txt-img">Urgent <img src="./addTaskImg/high.svg" class="prio-photos"></div>
            </div>
        </button>
        <button onclick="changeColorEdit(this) addPrioEventListenersEdit()" id="mediumButtonEdit" type="button" class="button-prio">
            <div class="center">
            <div class="button-txt-img">Medium <img src="./addTaskImg/mediu.svg" class="prio-photos"></div>
            </div>
        </button>
        <button onclick="changeColorEdit(this) addPrioEventListenersEdit()" id="lowButtonEdit" type="button" class="button-prio">
            <div class="center">
            <div class="button-txt-img">Low <img src="./addTaskImg/low.svg" class="prio-photos"></div>
            </div>
        </button>
            </div>
        </div>

        <label for="editTaskTitle${i}" class="margin-span">Subtask</label>
        <div class="input-with-img">
            <div style="display: flex; align-items: center; width: 100%;">
                <input required placeholder="Add new subtask" class="task-input-with-img" oninput="onInputChangeEdit()" id="inputFieldSubtaskEdit">
                <img src="./addTaskImg/plus.svg" class="input-field-svg" id="plusImgEdit">
            </div>
            <div class="check-cross-position" id="closeOrAcceptEdit">
                <button class="button-transparacy">
                    <img onclick="clearSubtaskInputEdit()" src="./addTaskImg/close.svg" class="subtaskButtons" alt="close">
                </button>
                <button class="button-transparacy">
                    <img onclick="addSubtaskEdit(${i})" src="./addTaskImg/checkBlack.svg" class="subtaskButtons" alt="check">
                </button>
            </div>
        </div>
        <div class="subtasks-opened" id="subtasksContainer${i}">
            ${generateSubtasksEditHtml(task.subtasks, i)}
        </div>
        <div class="align-center justify-center">
            <button class="button-dark" id="createTaskBtn" type="submit" onclick="saveTask(${i})">Save Changes</button>
        </div>
    `;
}

async function editTask(i) {
    const modalContentEdit = document.getElementById(`modal${i}`);
    const task = todos[i]['task'];
    modalContentEdit.innerHTML = generateEditModalContent(task, i);
    addEventListenerDropDown();
    changeColor(document.querySelector('.button-prio-selected'));
    onInputChangeEdit();
    displayNamesOfContactsEdit();
}

// displays contacts names die man wählen kann
async function displayNamesOfContactsEdit() {
    let containerContact = document.getElementById("contactListEdit");
    containerContact.innerHTML = '';
    let userData = await loadSpecificUserDataFromLocalStorage();
    let contacts = userData.contacts;
    if (contacts) {
        const keys = Object.keys(contacts);
        for (let i = 0; i < keys.length; i++) {
            let contactId = keys[i];
            let name = contacts[contactId]["name"];
            let color = contacts[contactId]["backgroundcolor"];
            let initials = getInitials(name);
            containerContact.innerHTML += generateContactToChose(name, color, initials, i);
        }
    }
}

// generates HTML für die Funktion displayNamesOfContacts()
function generateContactToChoseEdit(name, color, initials, i) {
    return `
    <div class="contact-boarder">
        <div class="name-inicial">
            <div class="circle-inicial" style="background: ${color}">
                <div class="inicial-style">${initials}</div>
            </div>
            <li id="contact-${i}" data-name="${name}" class="contact-item">${name}</li>
        </div>
        <div class="check-box-custom">
            <input id="checkbox${i}" type="checkbox" class="check-box-style" data-name="${name}" onchange="choseContactForAssignment()">
        </div>
    </div>
    `;
}

function displayContactsForAssignmentEdit() {
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

function generateBubbleInitials(i, initials, color) {
    return `
    <div id="bubble${i}" class="bubble-initial" style="background: ${color}">
        <span class="inicial-style">${initials}</span>
    </div>
    `;
}

function changeColorEdit(clickedButton) {
    const buttons = [
        { element: document.getElementById('lowButtonEdit'), class: 'lowSelected' },
        { element: document.getElementById('mediumButtonEdit'), class: 'mediumSelected' },
        { element: document.getElementById('urgentButtonEdit'), class: 'urgentSelected' }
    ];

    buttons.forEach(button => {
        if (button.element) {
            button.element.classList.toggle(button.class, button.element === clickedButton);
            if (button.element !== clickedButton) {
                button.element.classList.remove(button.class);
            }
        }
    });
}


function addEventListenerDropDown() {
    const dropDowns = document.querySelectorAll('.drop-down');
    dropDowns.forEach(dropDown => {
        const select = dropDown.querySelector('.select');
        const caret = dropDown.querySelector('.caret');
        const menu = dropDown.querySelector('.menu');
        const options = dropDown.querySelectorAll('.menu li');
        const selected = dropDown.querySelector('.selected');

        select.addEventListener('click', () => {
            select.classList.toggle('selectClicked');
            caret.classList.toggle('createRotate');
            menu.classList.toggle('menuOpen');
        });

        options.forEach(option => {
            option.addEventListener('click', () => {
                selected.innerText = option.innerText;
                select.classList.remove('selectClicked');
                caret.classList.remove('createRotate');
                menu.classList.remove('menuOpen');
                options.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });
    });
}

function generateSubtasksEditHtml(subtasks, i) {
    if (!subtasks || subtasks.length === 0) return '';
    let result = '';
    for (let j = 0; j < subtasks.length; j++) {
        const subtask = subtasks[j];
        result += /*html*/`
        <div class="subtask-Txt">
            <div id="subtask${i}-${j}">${subtask.text}</div>
            <div class="delete-edit">
                <img src="./addTaskImg/edit.svg" onclick="editSubtaskEdit(${i}, ${j})">
                <img src="./addTaskImg/delete.svg" onclick="deleteSubtaskEdit(${i}, ${j})">
            </div>
        </div>
        `;
    }
    return result;
}

function addSubtaskEdit(i) {
    let container = document.getElementById(`subtasksContainer${i}`);
    let subtaskText = document.getElementById('inputFieldSubtaskEdit').value.trim();

    if (subtaskText !== '') {
        let newSubtask = { text: subtaskText, status: 'pending' };
        if (editedSubtask !== null) {
            todos[editedSubtask.taskIndex].task.subtasks.splice(editedSubtask.subtaskIndex, 0, newSubtask);
            editedSubtask = null; 
        } else {
            todos[i].task.subtasks.push(newSubtask);
        }

        localStorage.setItem('todos', JSON.stringify(todos));
        container.innerHTML = generateSubtasksEditHtml(todos[i].task.subtasks, i);
        document.getElementById('inputFieldSubtaskEdit').value = '';
    }

    onInputChangeEdit();
}

let editedSubtask = null;

function editSubtaskEdit(taskIndex, subtaskIndex) {
    let subtaskDiv = document.getElementById(`subtask${taskIndex}-${subtaskIndex}`);
    let text = subtaskDiv.innerHTML;
    document.getElementById('inputFieldSubtaskEdit').value = text;
    editedSubtask = { taskIndex, subtaskIndex, text };
    todos[taskIndex].task.subtasks.splice(subtaskIndex, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
    displaySubtasksEdit(taskIndex);
    onInputChangeEdit();
}


function displaySubtasksEdit(i) {
    const container = document.getElementById(`subtasksContainer${i}`);
    container.innerHTML = generateSubtasksEditHtml(todos[i].task.subtasks, i);
}

function onInputChangeEdit() {
    let subtaskImg = document.getElementById('plusImgEdit');
    let subtaskButtons = document.getElementById('closeOrAcceptEdit');
    let inputField = document.getElementById('inputFieldSubtaskEdit');
    if (inputField.value.length > 0) {
        subtaskImg.style.display = 'none';
        subtaskButtons.style.display = 'block';
    } else {
        subtaskImg.style.display = 'block';
        subtaskButtons.style.display = 'none';
    }
}

function clearSubtaskInputEdit() {
    let inputField = document.getElementById('inputFieldSubtaskEdit');
    inputField.value = '';
    if (editedSubtask !== null) {
        todos[editedSubtask.taskIndex].task.subtasks.splice(editedSubtask.subtaskIndex, 0, { text: editedSubtask.text, status: 'pending' });
        localStorage.setItem('todos', JSON.stringify(todos));
        displaySubtasksEdit(editedSubtask.taskIndex);
        editedSubtask = null; 
    }

    onInputChangeEdit();
}

function deleteSubtaskEdit(taskIndex, subtaskIndex) {
    let subtasks = todos[taskIndex].task.subtasks;
    subtasks.splice(subtaskIndex, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
    displaySubtasksEdit(taskIndex);
}

document.addEventListener('DOMContentLoaded', (event) => {
    addPrioEventListenersEdit();
    addCategoryEventListenerEdit();
});


function addPrioEventListenersEdit() {
    document.getElementById('urgentButtonEdit').addEventListener('click', () => {
        localStorage.setItem('lastClickedButton', 'Urgent');
        console.log('U');
    });

    document.getElementById('mediumButtonEdit').addEventListener('click', () => {
        localStorage.setItem('lastClickedButton', 'Medium');
        console.log('M');
    });

    document.getElementById('lowButtonEdit').addEventListener('click', () => {
        localStorage.setItem('lastClickedButton', 'Low');
        console.log('L');
    });
}

function addCategoryEventListenerEdit() {
    document.querySelectorAll('#categoryMenu li').forEach(category => {
        category.addEventListener('click', () => {
            localStorage.setItem('selectedCategory', category.textContent.trim());
        });
    });
}

async function loadLastButtonClicked() {
    const userData = await loadSpecificUserDataFromLocalStorage();
}






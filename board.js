let currentDraggedElement;
let currentTask = 0;
let editedSubtask = null;
let todos = [];


async function initBoard() {
    includeHTML();
    await displayOpenTasks();
    showLoggedUserInitials();
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
    removeSpecificColorFromDragArea();
}


async function processTasks(containers) {
    const userData = await loadSpecificUserDataFromLocalStorage();
    const tasks = userData.tasks;
    if (tasks) {
        const taskIds = Object.keys(tasks);
        for (let i = 0; i < taskIds.length; i++) {
            const id = taskIds[i];
            const taskData = tasks[id];
            const task = { id: id, task: taskData };
            const category = taskData['dragCategory'];
            const container = containers[category];
            if (container) {
                container.innerHTML += getToDoTaskHtml(task, i);
                setCategoryColor(i);
                await getContactInitials(taskData.contacts, i);
                todos.push(task);
                await generateNumberOfSubtasks(i, task);
                await generatePriorityImgUnopened(i, task);
                updateLoadBar(i);
            }
        }
    }
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


function closeModal(modal) {
    displayOpenTasks();
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    window.onclick = null;
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
    addTask.classList.remove('d-none'); 
    addTask.classList.add('addTask-container-background');
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


async function deleteTask(i) {
    let taskTitle = document.getElementById(`openedTitle${i}`).innerHTML;
    let taskIndex = todos.findIndex(todo => taskTitle === todo.task.name);
    if (taskIndex !== -1) {
        const taskId = todos[taskIndex].id;
        await deleteUserTask(uid, taskId);
    }
    displayOpenTasks();
}


async function editTask(i) {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let tasks = userData.tasks;
    const modalContentEdit = document.getElementById(`modal${i}`);
    const task = todos[i]['task'];
    const contacts = todos[i]['task']['contacts'];
    localStorage.setItem('toBeEditedAssignedContacts', JSON.stringify(contacts));
    const dragCategory = todos[i]['task']["dragCategory"];
    localStorage.setItem('toBeEditedDragCategory', JSON.stringify(dragCategory));
    const category = todos[i]['task']["category"];
    localStorage.setItem('toBeEditedCategory', JSON.stringify(category));
    const priority = todos[i]['task']["priority"];
    localStorage.setItem('toBeEditedPriority', JSON.stringify(priority));
    let title = task.name;
    let description = task.description;
    if (task) {
        const keys = Object.keys(tasks);
        for (let i = 0; i < keys.length; i++) {
            const taskId = keys[i];
            let taskTitleInFirebase = tasks[taskId]["name"]
            let taskDescriptionInFirebase = tasks[taskId]["description"]
            if (taskTitleInFirebase == title && taskDescriptionInFirebase == description) {
                localStorage.setItem('toBeEditedTaskId', taskId);
            }

        }
    }
    modalContentEdit.innerHTML = generateEditModalContent(task, i);
    addEventListenerDropDown();
    addPrioEventListenersEdit();
    changeColor(document.querySelector('.button-prio-selected'));
    onInputChangeEdit();
    displayNamesOfContactsEdit();
    displayAssignedContactsInEdit();
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


async function displayAssignedContactsInEdit() {
    let containerBubbleInitials = document.getElementById('contactsDisplayBubbleInEdit');
    let userData = await loadSpecificUserDataFromLocalStorage();
    let tasks = userData.tasks;
    let taskId = localStorage.getItem('toBeEditedTaskId');
    let toBeEditedTask = tasks[taskId];
    let contacts = toBeEditedTask.contacts;
    if (toBeEditedTask) {
        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            let backgroundColor = contact.backgroundcolor;
            let name = contact.name;
            let initials = getInitials(name)
            containerBubbleInitials.innerHTML += generateBubbleInitials(i, initials, backgroundColor);
        }
    }
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


function addSubtaskEdit(i) {
    let container = document.getElementById(`subtasksContainer${i}`);
    let subtaskText = document.getElementById('inputFieldSubtaskEdit').value.trim();
    if (subtaskText !== '') {
        let newSubtask = { text: subtaskText, status: 'pending' };
        if (todos[i]) {
            if (!todos[i].task) {
                todos[i].task = { subtasks: [] };
            } if (!Array.isArray(todos[i].task.subtasks)) {
                todos[i].task.subtasks = [];
            }
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
    }
    onInputChangeEdit();
}



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


function getTaskContacts() {
    const newlyAssignedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const toBeEditedAssignedContacts = JSON.parse(localStorage.getItem('toBeEditedAssignedContacts')) || [];
    let newContacts;
    if (newlyAssignedContacts.length > 0) {
        newContacts = newlyAssignedContacts;
    } else {
        newContacts = toBeEditedAssignedContacts;
    }
    return newContacts;
}


function getTaskPriority() {
    const priority = localStorage.getItem('lastClickedButton');
    const toBeEditedPriority = localStorage.getItem('toBeEditedPriority');
    let newPriority;
    if (toBeEditedPriority === priority) {
        newPriority = toBeEditedPriority;
    } else {
        newPriority = priority;
    }
    return newPriority;
}


function getTaskSubtasks(i) {
    const subtasksContainer = document.getElementById(`subtasksContainer${i}`);
    const subtaskDivs = subtasksContainer.getElementsByClassName('subtask-Txt');
    const subtasks = [];
    for (let j = 0; j < subtaskDivs.length; j++) {
        const subtaskText = subtaskDivs[j].querySelector(`#subtask${i}-${j}`).innerText;
        subtasks.push({ text: subtaskText, status: 'undone' });
    }
    return subtasks;
}


function getTaskDetails(i) {
    const nameEdit = document.getElementById('taskTitleEdit').value;
    const descriptionEdit = document.getElementById('taskDescriptionEdit').value;
    const dateEdit = document.getElementById('dateEdit').value;
    let details = {};
    if (nameEdit && descriptionEdit && dateEdit) {
        details = { nameEdit, descriptionEdit, dateEdit };
    }
    return details;
}


async function saveTask(i) {
    const toBeEditedTaskId = localStorage.getItem('toBeEditedTaskId');
    const toBeEditedDragCategory = JSON.parse(localStorage.getItem('toBeEditedDragCategory'));
    const toBeEditedCategory = JSON.parse(localStorage.getItem('toBeEditedCategory'));
    const newContacts = getTaskContacts();
    const newPriority = getTaskPriority();
    const { nameEdit, descriptionEdit, dateEdit } = getTaskDetails(i);
    const subtasks = getTaskSubtasks(i);
    const task = {
        name: nameEdit,
        description: descriptionEdit,
        date: dateEdit,
        contacts: newContacts,
        category: toBeEditedCategory,
        dragCategory: toBeEditedDragCategory,
        subtasks: subtasks,
        priority: newPriority
    };

    // Aktualisierte Daten in Firebase speichern
    await updateUserData(uid, userData); 
    initBoard();
}

function getContactByInitials(initials, contacts) {
    const keys = Object.keys(contacts);
    for (let i = 0; i < keys.length; i++) {
        let contact = contacts[keys[i]];
        if (getInitials(contact.name) === initials) {
            return contact;
        }
    }
    return null;
}











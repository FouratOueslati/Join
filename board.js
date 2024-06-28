
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
    await getBackgroundColorOfContact();
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
            // VORSICHT, HIER KÖNNTE MAN SPÄTER ${i}-${j} BRAUCHEN
            contactInitialsContainer.innerHTML += `<div id="initials${j}" class="initials" style="background-color: ${color};">${initial}</div>`;
        }
    }
}

// die FUnktion öffnet das AddTask Window im Board
function openAddTask() {
    let addTaskPopUp = document.getElementById('addTaskPopUp');
    let popupContainer = document.getElementById('addTaskPopUp');
    addTaskPopUp.classList.add("bring-out-addTask-popup");
    popupContainer.classList.add("background-effect-for-addTask-popup");
}

function closeAddTask(){
    let addTaskPopUp = document.getElementById('addTaskPopUp');
    let popupContainer = document.getElementById('addTaskPopUp');
    addTaskPopUp.classList.remove("bring-out-addTask-popup");
    popupContainer.classList.remove("background-effect-for-addTask-popup");
}

/*function updateHTML() {
    let open = todos.filter(t => t['category'] == 'open');
 
    document.getElementById('open').innerHTML = '';
 
    for (let index = 0; index < open.length; index++) {
        const element = open[index];
        document.getElementById('open').innerHTML += generateTodoHTML(element);
    }
 
    let inprogress = todos.filter(t => t['category'] == 'inprogress')
 
    document.getElementById('inprogress').innerHTML = '';
 
    for (let index = 0; index < inprogress.length; index++) {
        const element = inprogress[index];
        document.getElementById('inprogress').innerHTML += generateTodoHTML(element);
    }
 
    let awaitfeedback = todos.filter(t => t['category'] == 'awaitfeedback')
 
    document.getElementById('awaitfeedback').innerHTML = '';
 
    for (let index = 0; index < awaitfeedback.length; index++) {
        const element = awaitfeedback[index];
        document.getElementById('awaitfeedback').innerHTML += generateTodoHTML(element);
    }
 
    let closed = todos.filter(t => t['category'] == 'closed');
 
    document.getElementById('closed').innerHTML = '';
 
    for (let index = 0; index < closed.length; index++) {
        const element = closed[index];
        document.getElementById('closed').innerHTML += generateTodoHTML(element);
    }
}
    function generateTodoHTML(element) {
    return `<div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">${element['title']}</div>`;
}
 */

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
function generateModalContent(task) {
    return /*html*/`
        <div>
            <div>${task['category']}</div>
            <div>${task['name']}</div>
            <div>${task['description']}</div>
            <div>${getContactInitials(task['contacts'])}</div>
        </div>`;
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


////////////////////EventListeners//////////////////////////////////////////
document.addEventListener('DOMContentLoaded', (event) => {
    addDragCategoryEventListeners();
    addPrioEventListenersEdit();
    addCategoryEventListenerEdit();
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


function addPrioEventListenersEdit() {
    let urgentContainer = document.getElementById('urgentButtonEdit');
    let mediumContainer = document.getElementById('mediumButtonEdit');
    let lowContainer = document.getElementById('lowButtonEdit');
    if (urgentContainer && mediumContainer && lowContainer) {
        urgentContainer.addEventListener('click', () => {
            localStorage.setItem('lastClickedButton', 'Urgent');
        });
        mediumContainer.addEventListener('click', () => {
            localStorage.setItem('lastClickedButton', 'Medium');
        });

        lowContainer.addEventListener('click', () => {
            localStorage.setItem('lastClickedButton', 'Low');
        });
    }
}


function addCategoryEventListenerEdit() {
    document.querySelectorAll('#categoryMenu li').forEach(category => {
        category.addEventListener('click', () => {
            localStorage.setItem('selectedCategory', category.textContent.trim());
        });
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
            menu.classList.toggle('menu-open');
        });

        options.forEach(option => {
            option.addEventListener('click', () => {
                selected.innerText = option.innerText;
                select.classList.remove('selectClicked');
                caret.classList.remove('createRotate');
                menu.classList.remove('menu-open');
                options.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });
    });
}
////////////////////EventListeners//////////////////////////////////////////


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


function generateEditModalContent(task, i) {
    const modalId = `myModal${i}`;
    return /*html*/`
        <div class="category-opened-container">
            <div class="category-opened">${task.category}</div>
            <img id="closeImg${i}" src="./img/close.png"  onclick="closeModalEdit(document.getElementById('${modalId}'))">
        </div>
        <div class="scroll-y">
        <div class="modal-edit-content">
            <label for="editTaskTitle${i}" class="margin-span">Title:</label>
            <input id="taskTitleEdit${i}" required placeholder="Enter a title..." minlength="4" class="task-input-field" value="${task.name}">
            
            <label for="editTaskDescription${i}">Description:</label>
            <textarea style="height: 80px;" id="taskDescriptionEdit${i}" required placeholder="Enter a Description..." minlength="4" class="task-input-field">${task.description}</textarea>
           
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
                    <div id="contactsDisplayBubbleInEdit" class="assigned-contacts-container"></div>
                </div>
            </div>
            <label for="editTaskDate${i}" class="margin-span">Due date:</label>
            <input id="dateEdit${i}" type="date" class="task-input-field date" value="${task.date}">

            <label for="editTaskPriority${i}" class="margin-span">Priority:</label>
            <div class="button-prio-width">
        <button onclick="changeColorEdit(this);" id="urgentButtonEdit" type="button" class="button-prio">
            <div class="center">
            <div class="button-txt-img">Urgent <img src="./addTaskImg/high.svg" class="prio-photos"></div>
            </div>
        </button>
        <button onclick="changeColorEdit(this);" id="mediumButtonEdit" type="button" class="button-prio">
            <div class="center">
            <div class="button-txt-img">Medium <img src="./addTaskImg/mediu.svg" class="prio-photos"></div>
            </div>
        </button>
        <button onclick="changeColorEdit(this);" id="lowButtonEdit" type="button" class="button-prio">
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
            <button class="button-dark" id="createTaskBtn" type="submit" onclick="saveTask(${i})">OK <img src="./img/check.png"></button>
        </div>
    `;
}

function closeModalEdit(modal) {
    displayOpenTasks();
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    window.onclick = null;
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


function generateBubbleInitials(i, initials, backgroundColor) {
    return `
    <div id="bubble${i}" class="bubble-initial" style="background: ${backgroundColor}">
        <span class="initial-style">${initials}</span>
    </div>
    `;
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
    if (categoryContainer && categoryContainer.innerHTML === 'Technical Task') {
        categoryContainer.style.backgroundColor = 'rgb(31, 215, 193)';
    } else if (categoryContainer && categoryContainer.innerHTML === 'User Story') {
        categoryContainer.style.backgroundColor = 'rgb(0, 56, 255)';
    }
}


function setCategoryColorOpened(i) {
    let categoryContainerOpened = document.getElementById(`categoryOpened${i}`);
    if (categoryContainerOpened && categoryContainerOpened.innerHTML === 'Technical Task') {
        categoryContainerOpened.style.backgroundColor = 'rgb(31, 215, 193)';
    } else if (categoryContainerOpened && categoryContainerOpened.innerHTML === 'User Story') {
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


function filterTask() {
    let clickHere = document.getElementById('clickHere');
    let search = document.getElementById('search').value.toLowerCase();
    if (search.length >= 3) {
        clickHere.classList.remove('display-none-a');
        filterWithSearchTerm(search.slice(0, 3));
        document.getElementById('search').value = ''; 
        removeSpecificColorFromDragArea();
    } else if (search.length === 0) {
        clearClickHere();
        removeSpecificColorFromDragArea(); 
    }
}



function filterWithSearchTerm(searchTerm) {
    let matchingTaskCount = 0; 
    for (let i = 0; i < todos.length; i++) {
        let taskTitleElement = document.getElementById(`taskTitle${i}`);
        let taskCard = document.getElementById(`task${i}`);
        
        if (taskTitleElement && taskCard) {
            let taskTitle = taskTitleElement.innerHTML.toLowerCase().slice(0, 3);
            if (taskTitle.includes(searchTerm)) {
                taskCard.style.display = 'block';
                matchingTaskCount++; 
            } else {
                taskCard.style.display = 'none';
            }
        }
    }
    document.getElementById('taskCount').innerText = matchingTaskCount;
}


function clearClickHere() {
    let clickHere = document.getElementById('clickHere');
    clickHere.classList.add('display-none-a');
    for (let i = 0; i < todos.length; i++) {
        let taskCard = document.getElementById(`task${i}`);
        if (taskCard) {
            taskCard.style.display = 'block';
        }
    }
    document.getElementById('taskCount').innerText = '0';
}


function startDragging(id) {
    currentDraggedElement = id;
}


async function moveTo(category) {
    todos[currentDraggedElement]['task']['dragCategory'] = category;
    await updateDragCategoryInFirebase(category, todos[currentDraggedElement].id);
    removeTaskFromContainer(currentDraggedElement);
    addTaskToContainer(currentDraggedElement, category);
    await displayOpenTasks()
}

function removeTaskFromContainer(index) {
    const taskElement = document.getElementById(`task${index}`);
    if (taskElement) {
        taskElement.remove();
        const container = taskElement.parentElement;
        if (container && container.children.length === 0) {
            const noTaskMessage = container.querySelector('.drag-area-text');
            if (noTaskMessage) noTaskMessage.style.display = 'block';
        }
    }
}


function addTaskToContainer(index, category) {
    const containerIdMap = {
        'todo': 'toDoTasks',
        'inprogress': 'inProgressTasks',
        'awaitfeedback': 'feedbackTasks',
        'done': 'done'
    };
    const containerId = containerIdMap[category];
    const container = document.getElementById(containerId);
    if (container) {
        container.classList.remove('drag-area-no-elements');
        container.classList.add('drag-area-has-elements');
        const noTaskMessage = container.querySelector('.drag-area-text');
        if (noTaskMessage) noTaskMessage.style.display = 'none';

        container.innerHTML += getToDoTaskHtml(todos[index], index);
        getContactInitials(todos[index].task.contacts, index);
        generateNumberOfSubtasks(index, todos[index]);
        generatePriorityImgUnopened(index, todos[index]);
        updateLoadBar(index);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.drag-area');
    containers.forEach(container => {
        const tasks = container.querySelectorAll('.todo-class');
        const noTaskMessage = container.querySelector('.drag-area-text');
        if (tasks.length === 0 && noTaskMessage) {
            noTaskMessage.style.display = 'block';
        } else if (noTaskMessage) {
            noTaskMessage.style.display = 'none';
        }
    });
});


function allowDrop(ev) {
    ev.preventDefault();
}

function highlight() {
    document.querySelector('.drag-area').classList.add('drag-area-highlight');
}

function removeHighlight() {
    document.querySelector('.drag-area').classList.remove('drag-area-highlight');
}



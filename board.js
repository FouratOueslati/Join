let currentDraggedElement;
let currentTask = 0;
let editedSubtask = null;
let todos = [];


async function initBoard() {
    includeHTML();
    await displayOpenTasks();
    showLoggedUserInitials();
}

/**
 * This function displays the tasks
 */
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


/**
 * This function gets all the data to load the tasks in the processTasks() function
 * 
 * @param {element} container 
 * @param {element} task 
 * @param {number} i 
 * @param {element} taskData 
 */
async function handleTaskInContainer(container, task, i, taskData) {
    container.innerHTML += getToDoTaskHtml(task, i);
    setCategoryColor(i);
    await getContactInitials(taskData.contacts, i);
    const existingIndex = todos.findIndex(t => t.id === task.id);
    if (existingIndex !== -1) {
        todos[existingIndex] = task;
    } else {
        todos.push(task);
    }
    await generateNumberOfSubtasks(i, task);
    await generatePriorityImgUnopened(i, task);
    updateLoadBar(i);
}


/**
 * This function loads all the data and information and displays it in the tasks
 * 
 * @param {element} containers 
 */
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
                await handleTaskInContainer(container, task, i, taskData);
            }
        }
    }
}


/**
 * This function opens a larger view of the task
 * 
 * @param {number} i 
 */
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


/**
 * This function closes the larger viwe of the task
 * 
 * @param {string} modal 
 */
function closeModal(modal) {
    displayOpenTasks();
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    window.onclick = null;
}


/**
 * This function displays the initials of the contacts in the tasks
 * 
 * @param {object} contacts 
 * @param {number} i 
 */
async function getContactInitials(contacts, i) {
    let contactInitialsContainer = document.getElementById(`initialsContainer${i}`);
    contactInitialsContainer.innerHTML = '';

    if (contacts && contacts.length > 0) {
        const maxInitialsToShow = 3; // Show up to 3 initials
        const extraContactsCount = contacts.length - maxInitialsToShow; // Calculate how many extra contacts there are

        // Display up to the first 3 initials
        for (let j = 0; j < Math.min(contacts.length, maxInitialsToShow); j++) {
            const contact = contacts[j];
            const initial = getInitials(contact.name);
            const color = contact.backgroundcolor;
            contactInitialsContainer.innerHTML += `
                <div id="initials${i}-${j}" class="initials" style="background-color: ${color};">
                    ${initial}
                </div>`;
        }

        // If there are more than 3 contacts, add a '+n' element
        if (extraContactsCount > 0) {
            contactInitialsContainer.innerHTML += `
                <div id="initials${i}-extra" class="number-initials" style="color: black;">
                    +${extraContactsCount}
                </div>`;
        }
    }
}


/**
 * This function changes an image when priority is selected
 * 
 * @param {number} i 
 */
function generatePriorityImgOpened(i) {
    const priority = document.getElementById(`openedPriority${i}`);
    const img = document.getElementById(`priorityImg${i}`);
    if (!img) return;
    let imgSrc = "./addTaskImg/low.svg";
    if (priority) {
        switch (priority.innerHTML) {
            case 'Medium':
                imgSrc = "./addTaskImg/medium.svg";
                break;
            case 'Urgent':
                imgSrc = "./addTaskImg/high.svg";
                break;
        }
    }
    img.src = imgSrc;
}


/**
 * This function opens a window for adding a task in another interface
 */
function openAddTaskInBoard() {
    let addTask = document.getElementById('addTaskContainerInBoard');
    addTask.classList.remove('d-none'); addTask.classList.add('addTask-container-background');
    let addTaskWindow = document.getElementById('addTaskPopUp');
    addTaskWindow.classList.add('bring-out-addTask-window');
}


/**
 * This function closes the window for adding a task in another interface
 */
function closeAddTaskInBoard() {
    let addTask = document.getElementById('addTaskContainerInBoard');
    addTask.classList.add('d-none');
    let addTaskWindow = document.getElementById('addTaskPopUp');
    addTaskWindow.classList.remove('bring-out-addTask-window');
    localStorage.removeItem('dragCategory');
}


/**
 * This function limits the words in the small view of the tasks
 * 
 * @param {string} containerId 
 * @param {number} wordLimit 
 */
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


/**
 * This function updates of the drag catagory in the tasks
 * 
 * @param {element} category 
 */
async function updateElements(category) {
    for (let i = 0; i < todos.length; i++) {
        const element = todos[i];
        if (element.task.dragCategory === category) {
            await updateDragCategoryInFirebase(category, element.id);
        }
    }
}


/**
 * This function updates the catagories in local storage
 * 
 * @param {*} newDragCategory 
 * @param {*} taskId 
 */
async function updateDragCategoryInFirebase(newDragCategory, taskId) {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let tasks = userData.tasks;
    if (tasks[taskId]) {
        tasks[taskId].dragCategory = newDragCategory;
        await updateUserData(uid, userData);
    }
}


/**
 * This function gets the container id's to change the background after drag and drop
 */
function removeSpecificColorFromDragArea() {
    let containers = [
        document.getElementById('toDoTasks'),
        document.getElementById('inProgressTasks'),
        document.getElementById('feedbackTasks'),
        document.getElementById('done')
    ];
    updateContainerClasses(containers);
}


/**
 * This function changes the backrground after dragging and dropping the tasks
 * 
 * @param {object} containers 
 */
function updateContainerClasses(containers) {
    let classHasElements = 'drag-area-has-elements';
    let classNoElements = 'drag-area-no-elements';
    let noTaskTitle = 'no-task';
    for (let i = 0; i < containers.length; i++) {
        let container = containers[i];
        container.classList.remove(classHasElements);
        container.classList.remove(classNoElements);
        if (container && container.querySelector('div')) {
            container.classList.add(classHasElements);
            container.classList.remove(noTaskTitle);
        } else {
            container.classList.add(classNoElements);
            container.classList.add(noTaskTitle);
        }
    }
}


/**
 * This function displays all tasks on board
 */
function displayAllTasks() {
    let taskContainers = document.querySelectorAll('.drag-area');
    taskContainers.forEach(container => {
        container.innerHTML = '';
        todos.forEach((task, index) => {
            addTaskToContainer(index, task.status);
        });
    });
    removeSpecificColorFromDragArea();
}


/**
 * Thias function deletes the tasks
 * 
 * @param {number} i 
 */
async function deleteTask(i) {
    let taskTitle = document.getElementById(`openedTitle${i}`).innerHTML;
    let taskIndex = todos.findIndex(todo => taskTitle === todo.task.name);
    if (taskIndex !== -1) {
        const taskId = todos[taskIndex].id;
        await deleteUserTask(uid, taskId);
    }
    displayOpenTasks();
}


const emptyArray = [];

/**
 * This function saves the changes to an edited task and displays them
 * 
 * @param {number} i 
 */
async function editTask(i) {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let tasks = userData.tasks;
    const modalContentEdit = document.getElementById(`modal${i}`);
    const task = todos[i]['task'];
    const contacts = todos[i]['task']['contacts'];
    if (contacts) {
        localStorage.setItem('toBeEditedAssignedContacts', JSON.stringify(contacts));
    } else {
        localStorage.setItem('toBeEditedAssignedContacts', JSON.stringify(emptyArray));
    }
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
    displayNamesOfContactsEdit();
    displayAssignedContactsInEdit();
    onInputChangeEdit();
}


/**
 * This function displays the contacts and initials that can be selected for the tasks
 */
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
            containerContact.innerHTML += generateContactToChoseInEditTaskHtml(name, color, initials, i);
        }
    }
}


/**
 * This function allows you to select or deselect contacts für the tasks
 * 
 * @param {object} event 
 * @param {number} i 
 */
function choseContactForAssignmentEditTask(event, i) {
    const checkbox = event.target;
    const contactToChose = document.getElementById(`contactToChoseInEditTask${i}`);
    const contactName = checkbox.getAttribute('data-name-edittask');
    const contactElement = checkbox.closest('.contact-boarder-edittask');
    const color = contactElement.querySelector('.circle-initial-edittask').style.background;
    let assignedContacts = JSON.parse(localStorage.getItem('toBeEditedAssignedContacts')) || [];
    if (checkbox.checked) {
        if (!assignedContacts.some(contact => contact.name === contactName)) {
            assignedContacts.push({ name: contactName, backgroundcolor: color });
            contactToChose.style.backgroundColor = "#2A3647";
            contactToChose.style.color = "white";
        }
    } else {
        assignedContacts = assignedContacts.filter(contact => contact.name !== contactName);
        contactToChose.style.backgroundColor = "";
        contactToChose.style.color = "";
    }
    localStorage.setItem('toBeEditedAssignedContacts', JSON.stringify(assignedContacts));
}


/**
 * This function dsiplays the assigned contacts in editing view
 */
async function displayAssignedContactsInEdit() {
    let containerBubbleInitials = document.getElementById('contactsDisplayBubbleInEdit');
    let userData = await loadSpecificUserDataFromLocalStorage();
    let tasks = userData.tasks;
    let taskId = localStorage.getItem('toBeEditedTaskId');
    let toBeEditedTask = tasks[taskId];
    let contacts = toBeEditedTask.contacts;
    if (toBeEditedTask && contacts) {
        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            let backgroundColor = contact.backgroundcolor;
            let name = contact.name;
            let initials = getInitials(name)
            containerBubbleInitials.innerHTML += generateBubbleInitialsHtml(i, initials, backgroundColor);
        }
    }
}
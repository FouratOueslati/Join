let subtaskCounter = 0;
let assignedContacts = [];
let subtasks = [];


let uid = localStorage.getItem('uid');


async function onloadFunction() {
    includeHTML();
    await loadSpecificUserDataFromLocalStorage();
    loadSubtasksFromLocalStorage();
    await displayNamesOfContacts();
    showLoggedUserInitials();
}


/**
 * This function checks whether the entries have been entered correctly before adding a new task
 */
function validateAndAddTask() {
    const taskTitle = document.getElementById('taskTitle');
    const date = document.getElementById('date');
    const categoryContainer = document.getElementById('selectCategoryContainer');
    const category = document.getElementById('selectCategory');
    taskTitle.style.borderColor = '';
    date.style.borderColor = '';
    categoryContainer.style.borderColor = '';
    let isValid = true;
    if (taskTitle.value.trim().length < 4) {
        taskTitle.style.borderColor = 'red';
        isValid = false;
    }
    if (!date.value) {
        date.style.borderColor = 'red';
        isValid = false;
    }
    if (category.textContent === 'Select task category') {
        categoryContainer.style.borderColor = 'red';
        isValid = false;
    }
    if (isValid) {
        addTask();
    }
}


/**
 * This function executes the addPrioEventListeners and addCategoryEventListener functions
 * only after the full html element has loaded
 */
document.addEventListener('DOMContentLoaded', (event) => {
    addPrioEventListeners();
    addCategoryEventListener();
});


/**
 * This function saves the priority of te task in local storage
 */
function addPrioEventListeners() {
    localStorage.setItem('lastClickedButton', 'Medium');
    document.getElementById('urgentButton').addEventListener('click', () => {
        localStorage.setItem('lastClickedButton', 'Urgent');
    });
    document.getElementById('mediumButton').addEventListener('click', () => {
        localStorage.setItem('lastClickedButton', 'Medium');
    });
    document.getElementById('lowButton').addEventListener('click', () => {
        localStorage.setItem('lastClickedButton', 'Low');
    });
}


/**
 * This function saves the task category in local storage
 */
function addCategoryEventListener() {
    document.querySelectorAll('#categoryMenu li').forEach(category => {
        category.addEventListener('click', () => {
            localStorage.setItem('selectedCategory', category.textContent.trim());
        });
    });
}


/**
 * This function displays the name of contacts to use for the tasks
 */
async function displayNamesOfContacts() {
    let containerContact = document.getElementById("contactList");
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
            containerContact.innerHTML += generateContactToChoseHtml(name, color, initials, i);
        }
    }
}


/**
 * This function generates the initials of the contacts
 * 
 * @param {string} name 
 * @returns {string}
 */
function getInitials(name) {
    if (typeof name !== "string" || !name) {
        return "";
    }
    let upperChars = "";
    let words = name.split(" ");
    for (let word of words) {
        if (word.length > 0) {
            upperChars += word[0].toUpperCase();
        }
    }
    return upperChars;
}


/**
 * This function adds subtasks to the tasks 
 */
function addSubtask(taskIndex) {
    let container = document.getElementById('subtasksContainer');
    let subtask = document.getElementById('inputFieldSubtask').value;
    if (subtask.trim() !== '') {
        let subtaskIndex = subtasks.length; // Set the subtask index based on the array length
        subtasks.push(subtask);
        localStorage.setItem('subtasks', JSON.stringify(subtasks));
        container.innerHTML += addSubtaskHtml(taskIndex, subtaskIndex, subtask);
        document.getElementById('inputFieldSubtask').value = '';
    }
}



/**
 * This function loads the subtasks from local storage
 */
function loadSubtasksFromLocalStorage() {
    let savedSubtasks = localStorage.getItem('subtasks');
    if (savedSubtasks) {
        subtasks = JSON.parse(savedSubtasks);
        subtaskCounter = subtasks.length ? subtasks[subtasks.length - 1].id : 0;
        displaySubtasks();
    }
}

/**
 * This function edits the subtasks
 * 
 * @param {number} index 
 */
function editSubtask(taskIndex, subtaskIndex) {
    let subtaskDiv = document.getElementById(`subtask${taskIndex}-${subtaskIndex}`);
    let text = subtaskDiv.innerHTML; 
    document.getElementById('inputFieldSubtask').value = text;
    subtasks.splice(subtaskIndex, 1);
    localStorage.setItem('subtasks', JSON.stringify(subtasks));
    document.getElementById('subtask-Txt-' + taskIndex + '-' + subtaskIndex).remove();
    onInputChange();
}




/**
 * This function empties the input field after saving the task
 */
function clearSubtaskInput() {
    let inpultField = document.getElementById('inputFieldSubtask');
    inpultField.value = '';
    onInputChange();
}


/**
 * This function deletes the subtasks
 * 
 * @param {number} index 
 */
function deleteSubtask(taskIndex, subtaskIndex) {
    subtasks.splice(subtaskIndex, 1);
    localStorage.setItem('subtasks', JSON.stringify(subtasks));
    let subtaskElement = document.getElementById(`subtask-Txt-${taskIndex}-${subtaskIndex}`);
    if (subtaskElement) {
        subtaskElement.remove();
    }
}



/**
 * This function checked whether something was entered into the input field to show or hide buttons
 */
function onInputChange() {
    let subtaskImg = document.getElementById('plusImg');
    let subtaskButtons = document.getElementById('closeOrAccept');
    let inputField = document.getElementById('inputFieldSubtask');
    if (inputField.value.length > 0) {
        subtaskImg.style.display = 'none';
        subtaskButtons.style.display = 'flex';
    } else {
        subtaskImg.style.display = 'flex';
        subtaskButtons.style.display = 'none';
    }
}


/**
 * This function saves the selected contacts in local storage and display them in task
 * 
 * @param {object} event 
 */
function choseContactForAssignment(event, i) {
    const checkbox = event.target;
    const contactToChose = document.getElementById(`contactToChose${i}`);
    const contactName = checkbox.getAttribute('data-name');
    const contactElement = checkbox.closest('.contact-boarder');
    const color = contactElement.querySelector('.circle-initial').style.background;
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
    localStorage.setItem('contactsAssignedToTask', JSON.stringify(assignedContacts));
    displayContactsForAssignment();
}


/**
 * This function displays the contacts selected in the task
 */
function displayContactsForAssignment() {
    let containerBubbleInitials = document.getElementById('contactsDisplayBubble');
    containerBubbleInitials.innerHTML = '';
    let checkboxes = document.querySelectorAll('.assign-contact-checkbox');
    for (let i = 0; i < checkboxes.length; i++) {
        let checkbox = checkboxes[i];
        if (checkbox.checked) {
            let contactElement = checkbox.closest('.contact-boarder');
            let initialsElement = contactElement.querySelector('.circle-initial .initial-style');
            let circleElement = contactElement.querySelector('.circle-initial');
            let initials = initialsElement.innerText;
            let color = circleElement.style.backgroundColor;
            containerBubbleInitials.innerHTML += generateBubbleInitialsHtml(i, initials, color);
        }
    }
}


/**
 * This function retrieves datas from local storage and creates an object with data
 */
async function addTask() {
    const taskTitle = document.getElementById('taskTitle');
    const taskDescription = document.getElementById('taskDescription');
    const assignedContactsContainer = document.getElementById('contactsDisplayBubble');
    const subtasksContainer = document.getElementById('subtasksContainer');
    const date = document.getElementById('date');
    const contacts = JSON.parse(localStorage.getItem('contactsAssignedToTask'));
    const subtasks = JSON.parse(localStorage.getItem('subtasks'));
    const lastClickedButton = localStorage.getItem('lastClickedButton');
    const selectedCategory = localStorage.getItem('selectedCategory');
    const dragCategory = localStorage.getItem('dragCategory');
    const task = createTaskObject(taskTitle.value, taskDescription.value, date.value, lastClickedButton, selectedCategory, contacts, subtasks);
    await handleTaskSubmission(task, assignedContactsContainer, date, subtasksContainer, dragCategory);
}


async function addContactsToTask() {
    
}

/**
 * This function post the task to the server, reset the form, updates the tasks and shows
 * a confirmation for creating the task
 * 
 * @param {object} task 
 * @param {object} assignedContactsContainer 
 * @param {number} date 
 * @param {string} subtasksContainer 
 */
async function handleTaskSubmission(task, assignedContactsContainer, date, subtasksContainer) {
    await postTask('/users/' + uid + '/tasks', task);
    resetForm(assignedContactsContainer, date, subtasksContainer);
    if (window.location.pathname.includes('board.html')) {
        displayOpenTasks();
        closeAddTaskInBoard();
    }
    showConfirmationTask();
}


/**
 * This function creates an object for the tasks with the required parameters
 * 
 * @param {string} name 
 * @param {string} description 
 * @param {number} date 
 * @param {string} priority 
 * @param {string} category 
 * @param {object} contacts 
 * @param {string} subtasks 
 * @returns 
 */
function createTaskObject(name, description, date, priority, category, contacts, subtasks) {
    const subtasksArray = createSubtasksArray(subtasks);
    return {
        name,
        description,
        date,
        priority,
        category,
        contacts,
        subtasks: subtasksArray,
        dragCategory: localStorage.getItem('dragCategory') || "todo"
    };
}


/**
 * This function creates an array for the subtasks
 * 
 * @param {object} subtasks 
 * @returns {object}
 */
function createSubtasksArray(subtasks) {
    if (!subtasks) return [];
    return subtasks.map(subtask => ({
        text: subtask,
        status: "undone"
    }));
}

/**
 * This function clears all inputs on AddTask
 */
function removeAllInput() {
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("selectContact").textContent = "Search Contact";
    document.getElementById("contactsDisplayBubble").innerHTML = "";
    document.getElementById("date").value = "";
    const priorityButtons = document.querySelectorAll(".button-prio");
    priorityButtons.forEach(button => {
        button.classList.add("mediumSelected", "mediumSelected");
        button.classList.remove("lowSelected", "lowButton");
        button.classList.remove("urgentSelected", "urgentButton");
    });
    document.getElementById("selectCategory").textContent = "Select task category";
    document.getElementById("inputFieldSubtask").value = "";
    document.getElementById("subtasksContainer").innerHTML = "";
}

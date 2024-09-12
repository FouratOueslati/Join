/**
 * This function adds a highlight (background) to the drag and drop container
 */
function highlight() {
    document.querySelector('.drag-area').classList.add('drag-area-highlight');
}


/**
 * This function removes a highlight (background) from the drag and drop container
 */
function removeHighlight() {
    document.querySelector('.drag-area').classList.remove('drag-area-highlight');
}


/**
 * This function changes the color of the selected priority button
 * 
 * @param {element} clickedButton 
 */
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


/**
 * This function allows adding a subtask to an existing task or editing the subtask
 * 
 * @param {number} i 
 */
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


/**
 * This function edit the subtasks and saves them in local storage
 * 
 * @param {number} taskIndex 
 * @param {number} subtaskIndex 
 */
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


/**
 * This function dispays the edited subtask
 * 
 * @param {number} i 
 */
function displaySubtasksEdit(i) {
    const container = document.getElementById(`subtasksContainer${i}`);
    container.innerHTML = generateSubtasksEditHtml(todos[i].task.subtasks, i);
}


/**
 * This function deletes the input field for the subtask
 */
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


/**
 * Thias function delete the subtask
 * 
 * @param {number} taskIndex 
 * @param {number} subtaskIndex 
 */
function deleteSubtaskEdit(taskIndex, subtaskIndex) {
    let subtasks = todos[taskIndex].task.subtasks;
    subtasks.splice(subtaskIndex, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
    displaySubtasksEdit(taskIndex);
}


/**
 * This function get the assigned contacts to save them
 * 
 * @returns {object}
 */
function getTaskContacts() {
    let newContacts;
    const toBeEditedAssignedContacts = JSON.parse(localStorage.getItem('toBeEditedAssignedContacts')) || [];
    newContacts = toBeEditedAssignedContacts;
    return newContacts;
}


/**
 * This function gets the assigned priority for saving
 * 
 * @returns {element}
 */
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


/**
 * This function gets the assigned subtask for saving
 * 
 * @param {number} i 
 * @returns {string}
 */
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


/**
 * This function updates the status of the checkbox based on saved contacts in local storage
 * 
 * @returns no return
 */
function showCheckedContacts() {
    let assignedContactsJson = localStorage.getItem('toBeEditedAssignedContacts');
    if (!assignedContactsJson) {
        return;
    }
    let assignedContacts = JSON.parse(assignedContactsJson);
    let assignedContactNames = assignedContacts.map(contact => contact.name);
    let contacts = document.querySelectorAll('[id^="contactInEditTask-"]');
    let checkboxes = document.querySelectorAll('[id^="checkboxInEditTask"]');
    let contactCheckboxMap = {};
    contacts.forEach(contact => {
        let contactName = contact.innerHTML.trim();
        let contactIndex = contact.id.split('-')[1];
        contactCheckboxMap[contactIndex] = contactName;
    });
    checkboxes.forEach(checkbox => {
        let checkboxIndex = checkbox.id.replace('checkboxInEditTask', '');
        let contactName = contactCheckboxMap[checkboxIndex];
        if (contactName) {
            checkbox.checked = assignedContactNames.includes(contactName);
        } else {
            checkbox.checked = false;
        }
    });
}


/**
 * This function save a task after editing
 * 
 * @param {number} i 
 */
async function saveTask(i) {
    const { nameEdit, descriptionEdit, dateEdit } = getTaskDetails(i);
    const subtasks = getTaskSubtasks(i);
    const newContacts = getTaskContacts();
    const newPriority = getTaskPriority();
    const toBeEditedTaskId = localStorage.getItem('toBeEditedTaskId');
    const toBeEditedDragCategory = JSON.parse(localStorage.getItem('toBeEditedDragCategory'));
    const toBeEditedCategory = JSON.parse(localStorage.getItem('toBeEditedCategory'));
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
    await updateUserTasks(uid, toBeEditedTaskId, task);
    await displayOpenTasks();
    localStorage.removeItem('contacts');
}


/**
 * This function gets the details of the task (description, name and date) for saving
 * 
 * @param {number} i 
 * @returns {string, number}
 */
function getTaskDetails(i) {
    const nameEdit = document.getElementById(`taskTitleEdit${i}`).value;
    const descriptionEdit = document.getElementById(`taskDescriptionEdit${i}`).value;
    const dateEdit = document.getElementById(`dateEdit${i}`).value;
    let details = {};
    if (nameEdit && descriptionEdit && dateEdit) {
        details = { nameEdit, descriptionEdit, dateEdit };
    }
    return details;
}


/**
 * This function checks wether all required fields are filled in to add a new task
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
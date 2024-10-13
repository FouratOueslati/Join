/**
 * The functions addDragCategoryEventListeners(), addPrioEventListenersEdit() and
 * addCategoryEventListenerEdit() sare only tartet when all elemnts are loaded
 */
document.addEventListener('DOMContentLoaded', (event) => {
    addDragCategoryEventListeners();
    addDragCategoryEventListenersMobile();
    addPrioEventListenersEdit();
    addCategoryEventListenerEdit();
});


/**
 * This function adds a click event listener to drag and drop the tasks
 */
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


/**
 * This function adds an event listener for use on mobile devices
 */
function addDragCategoryEventListenersMobile() {
    document.getElementById('awaitFeedback').addEventListener('touchstart', () => {
        localStorage.setItem('dragCategory', 'awaitfeedback');
    });
    document.getElementById('toDo').addEventListener('touchstart', () => {
        localStorage.setItem('dragCategory', 'todo');
    });
    document.getElementById('inProgress').addEventListener('touchstart', () => {
        localStorage.setItem('dragCategory', 'inprogress');
    });
}


/**
 * This function adds a click event listener to select and save a priority
 */
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


/**
 * This function adds a click event listener to list elements to save the selected category 
 * in local storage
 */
function addCategoryEventListenerEdit() {
    document.querySelectorAll('#categoryMenu li').forEach(category => {
        category.addEventListener('click', () => {
            localStorage.setItem('selectedCategory', category.textContent.trim());
        });
    });
}


/**
 * This function adds drop down event listener to different elements
 */
function addEventListenerDropDown() {
    const dropDowns = ['dropDownEdit']; // Add the IDs of each dropdown
    dropDowns.forEach(dropDownId => {
        const dropDown = document.getElementById(dropDownId);
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


/**
 * This function closes the larger view of an open task
 * 
 * @param {Element} modal 
 */
function closeModalEdit(modal) {
    displayOpenTasks();
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    window.onclick = null;
}


/**
 * This function generates the names and initials of the contacts in an html element to display them
 * 
 * @param {object} contacts 
 * @param {number} i 
 * @returns {object}
 */
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


/**
 * This function generates icons for the subtasks so that they can be edited and displays them
 * 
 * @param {string} subtasks 
 * @param {number} i 
 * @returns {Element}
 */
function generateSubtasksEditHtml(subtasks, i) {
    if (!subtasks || subtasks.length === 0) return '';
    let result = '';
    for (let j = 0; j < subtasks.length; j++) {
        const subtask = subtasks[j];
        result += /*html*/`
        <div class="subtask-Txt">
            <div id="subtask${i}-${j}">${subtask.text}</div>
            <div class="delete-edit">
                <img src="./img/addTaskImg/edit.svg" onclick="editSubtaskEdit(${i}, ${j})">
                <img src="./img/addTaskImg/delete.svg" onclick="deleteSubtaskEdit(${i}, ${j})">
            </div>
        </div>
        `;
    }
    return result;
}


/**
 * This function generates the subtasks in an html element to display them
 * 
 * @param {element} subtasks 
 * @param {number} i 
 * @returns {element}
 */
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


/**
 * This function searches for the correct contact based on the initials
 * 
 * @param {string} initials 
 * @param {object} contacts 
 * @returns 
 */
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


/**
 * This function displays the numbers of subtasks in a task
 * 
 * @param {number} i 
 * @param {object} task 
 * @returns 
 */
async function generateNumberOfSubtasks(i, task) {
    const subtasksNumber = document.getElementById(`subtasksNumber${i}`);
    if (!subtasksNumber || !task.task || !Array.isArray(task.task.subtasks)) return;
    const subtasks = task.task.subtasks;
    const completedSubtasks = subtasks.filter(subtask => subtask.status === 'done').length;
    const numberOfSubtasks = subtasks.length;
    subtasksNumber.innerHTML = `${completedSubtasks}/${numberOfSubtasks} Subtasks`;
}


/**
 * This function adds an icon corresponding to the selected priority of the task
 * 
 * @param {number} i 
 * @param {element} task 
 */
async function generatePriorityImgUnopened(i, task) {
    const img = document.getElementById(`priorityImgUnopened${i}`);
    if (!img) return;
    const priority = task?.task?.priority;
    let imgSrc = "./img/addTaskImg/low.svg";
    switch (priority) {
        case 'Medium':
            imgSrc = "./img/addTaskImg/medium.svg";
            break;
        case 'Urgent':
            imgSrc = "./img/addTaskImg/high.svg";
            break;
    }
    img.src = imgSrc;
}


/**
 * This function sets the background color for the selected category
 * 
 * @param {number} i 
 */
function setCategoryColor(i) {
    let categoryContainer = document.getElementById(`category${i}`);
    if (categoryContainer && categoryContainer.innerHTML === 'Technical Task') {
        categoryContainer.style.backgroundColor = 'rgb(31, 215, 193)';
    } else if (categoryContainer && categoryContainer.innerHTML === 'User Story') {
        categoryContainer.style.backgroundColor = 'rgb(0, 56, 255)';
    } else if (categoryContainer && categoryContainer.innerHTML === 'Design') {
        categoryContainer.style.backgroundColor = 'rgb(255,211,155)';
    }
}


/**
 * This function hides or shows icons depending on whether the user writes in the input field
 * or not
 */
function onInputChangeEdit() {
    let subtaskImg = document.getElementById('plusImgEdit');
    let subtaskButtons = document.getElementById('closeOrAcceptEdit');
    let inputField = document.getElementById('inputFieldSubtaskEdit');
    if (inputField.value.length > 0) {
        subtaskImg.style.display = 'none';
        subtaskButtons.style.display = 'flex';
    } else {
        subtaskImg.style.display = 'flex';
        subtaskButtons.style.display = 'none';
    }
}
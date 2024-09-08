/**
 * This function add a click event listener to each option on dropdown menus
 * 
 * @param {element} options 
 * @param {element} select 
 * @param {element} caret 
 * @param {element} menu 
 * @param {element} selected 
 */
function addOptionListeners(options, select, caret, menu, selected) {
    options.forEach(option => {
        option.addEventListener('click', () => {
            selected.innerText = option.innerText;
            select.classList.remove('selectClicked');
            caret.classList.remove('createRotate');
            menu.classList.remove('menu-open');
            options.forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
        });
    });
}


/**
 * This function initialized all drop down menus when is loading
 */
document.addEventListener('DOMContentLoaded', () => {
    const dropDowns = document.querySelectorAll('.drop-down');
    dropDowns.forEach(dropDown => {
        const select = dropDown.querySelector('.select');
        const caret = dropDown.querySelector('.caret');
        const menu = dropDown.querySelector('.menu');
        const options = dropDown.querySelectorAll('.menu li');
        const selected = dropDown.querySelector('.selected');
        select.addEventListener('click', (event) => {
            event.stopPropagation();
            select.classList.toggle('selectClicked');
            caret.classList.toggle('createRotate');
            menu.classList.toggle('menu-open');
        });
        addOptionListeners(options, select, caret, menu, selected);
        document.addEventListener('click', (event) => {
            if (!dropDown.contains(event.target)) {
                select.classList.remove('selectClicked');
                caret.classList.remove('createRotate');
                menu.classList.remove('menu-open');
            }
        });
    });
});


// this function closes the drop down menu when you click on the body
function addOptionListeners(options, select, caret, menu, selected) {
    options.forEach(option => {
        option.addEventListener('click', () => {
            selected.textContent = option.textContent;
            select.classList.remove('selectClicked');
            caret.classList.remove('createRotate');
            menu.classList.remove('menu-open');
        });
    });
}


/**
 * This function changes the color of the priority buttons and save the selected priority
 */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('lowButton').onclick = function () { changeColor(this); };
    document.getElementById('mediumButton').onclick = function () { changeColor(this); };
    document.getElementById('urgentButton').onclick = function () { changeColor(this); };
});


/**
 * This function reset the form so the user can create a new task
 * 
 * @param {object} assignedContactsContainer 
 * @param {number} date 
 * @param {string} subtasksContainer 
 */
function resetForm(assignedContactsContainer, date, subtasksContainer) {
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    assignedContactsContainer.innerHTML = '';
    date.value = '';
    subtasksContainer.innerHTML = '';
    localStorage.removeItem('dragCategory');
    localStorage.removeItem('subtasks');
    localStorage.removeItem('lastClickedButton');
}


/**
 * This function shows the user a confirmation that the task has been created
 */
function showConfirmationTask() {
    let addedToBoard = document.getElementById('addedToBoard');
    addedToBoard.classList.remove('d-none');
    setTimeout(() => {
        addedToBoard.classList.add('d-none');
        window.location.href = 'board.html';
    }, 1500);
}


/**
 * This function changes the color of priority buttons
 * 
 * @param {object} clickedButton 
 */

function changeColor(clickedButton) {
    const buttons = [
        { element: document.getElementById('lowButton'), class: 'lowSelected' },
        { element: document.getElementById('mediumButton'), class: 'mediumSelected' },
        { element: document.getElementById('urgentButton'), class: 'urgentSelected' }
    ];
    buttons.forEach(button => {
        button.element.classList.toggle(button.class, button.element === clickedButton);
        if (button.element !== clickedButton) {
            button.element.classList.remove(button.class);
        }
    });
}


/**
 * This function allows saving the input from the subtask using the enter key
 */
const subtaskInput = document.getElementById('inputFieldSubtask');
subtaskInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addSubtask();
    }
});


 // Function to format the current date as YYYY-MM-DD
 function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    dateInput.setAttribute('min', getTodayDate());
});


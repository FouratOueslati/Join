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
 * This function displays the background color for the selected category in the larger view 
 * of the task
 * 
 * @param {number} i 
 */
function setCategoryColorOpened(i) {
    let categoryContainerOpened = document.getElementById(`categoryOpened${i}`);
    if (categoryContainerOpened && categoryContainerOpened.innerHTML === 'Technical Task') {
        categoryContainerOpened.style.backgroundColor = 'rgb(31, 215, 193)';
    } else if (categoryContainerOpened && categoryContainerOpened.innerHTML === 'User Story') {
        categoryContainerOpened.style.backgroundColor = 'rgb(0, 56, 255)';
    } else if (categoryContainerOpened && categoryContainerOpened.innerHTML === 'Design') {
        categoryContainerOpened.style.backgroundColor = 'rgb(255,211,155)';
    }
}


/**
 * This function toggle the status of the subtask
 * 
 * @param {number} i 
 * @param {number} j 
 */
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


/**
 * This function updates the status of subtask
 * 
 * @param {object} tasks 
 * @param {number} i 
 * @param {number} j 
 * @param {*element} statusOfSubtask 
 */
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


/**
 * This function updates the subtask status in external storage
 * 
 * @param {element} status 
 * @param {number} taskId 
 * @param {number} subtaskId 
 */
async function updateSubtaskStatusInFirebase(status, taskId, subtaskId) {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let tasks = userData.tasks;
    if (tasks[taskId] && tasks[taskId].subtasks[subtaskId]) {
        tasks[taskId].subtasks[subtaskId].status = status;
        await updateUserData(uid, userData);
    }
}


/**
 * This function updates the loadbar
 * 
 * @param {number} i 
 */
function updateLoadBar(i) {
    const loadBarContainer = document.getElementById(`loadBarContainer${i}`);
    const loadBar = document.getElementById(`loadBar${i}`);
    const subtaskNumber = document.getElementById(`subtasksNumber${i}`);
    const subtaskText = subtaskNumber.innerHTML;
    const match = subtaskText.match(/(\d+)\/(\d+) Subtasks/);
    if (match) {
        const completedSubtasks = parseInt(match[1], 10);
        const totalSubtasks = parseInt(match[2], 10);
        const percentage = (completedSubtasks / totalSubtasks) * 100;
        loadBar.style.width = `${percentage}%`;
    } else {
        loadBarContainer.style.display = 'none';
        loadBar.style.width = '0%';
    }
}


/**
 * This function filters searched tasks
 */
function filterTask() {
    let clickHere = document.getElementById('clickHere');
    let searchInput = document.getElementById('search');
    let search = searchInput.value.toLowerCase();
    if (search.length >= 3) {
        clickHere.classList.remove('display-none-a');
        filterWithSearchTerm(search.slice(0, 3));
        removeSpecificColorFromDragArea();
    } else if (search.length === 0) {
        clearClickHere();
        removeSpecificColorFromDragArea();
    }
}


/**
 * This function displays searched tasks based on words entered
 * 
 * @param {string} searchTerm 
 */
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


/**
 * This function clears the serach input and displays all tasks
 */
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


/**
 * This function manages the drag and drop state
 * 
 * @param {number} id 
 */
function startDragging(id) {
    currentDraggedElement = id;
}


/**
 * Those function allows tasks can be postponed
 * 
 * @param {element} category 
 * @param {number} i
 * @param {event} event
 */
async function moveTo(category) {
    todos[currentDraggedElement]['task']['dragCategory'] = category;
    await updateDragCategoryInFirebase(category, todos[currentDraggedElement].id);
    removeTaskFromContainer(currentDraggedElement);
    addTaskToContainer(currentDraggedElement, category);
    await displayOpenTasks()
}

async function moveToFromMenu(event, category, i) {
    event.stopPropagation();
    todos[i]['task']['dragCategory'] = category;
    await updateDragCategoryInFirebase(category, todos[i].id);
    removeTaskFromContainer(i);
    addTaskToContainer(i, category);
    await displayOpenTasks();
}


/**
 * This function allows tasks to be remove from a container
 * 
 * @param {number} index 
 */
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


/**
 * This function add a new task in the correct container
 * 
 * @param {number} index 
 * @param {element} category 
 */
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


/**
 * This function checks the drag and drop container and displays the tasks or information
 */
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


/**
 * This function makes it possible to drag and drop tasks into a container
 * 
 * @param {*} ev 
 */
function allowDrop(ev) {
    ev.preventDefault();
}


function toggleMoveToMenu(event, i) {
    event.stopPropagation();
    document.getElementById(`moveToMenu${i}`).classList.toggle('d-none');
}
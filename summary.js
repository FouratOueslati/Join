async function initSummary() {
    includeHTML();
    await greetUser();
    await loadToDoTasks();
    await loadUrgentTasksNumber();
    await displayUpcomingDeadline();
    await loadAllTasks();
    await loadInProgressTasks();
    await loadFeedbackTasks();
    showLoggedUserInitials();
}

/**
 * This function load all tasks of an user from the local storage
 */
async function loadAllTasks() {
    let allTasksNumber = document.getElementById('allTasksNumber');
    let tasks = await loadAllTasksFromStorage();
    let taskIds = Object.keys(tasks);
    allTasksNumber.innerHTML = taskIds.length;
}

/**
 * This function load the number of taks in the category urgent of an user an show them
 */
async function loadUrgentTasksNumber() {
    let urgentTasksNumber = document.getElementById('urgentTasksNumber');
    let tasks = await loadAllTasksFromStorage();
    let taskIds = Object.keys(tasks);
    let urgentTaskCount = 0;
    for (let i = 0; i < taskIds.length; i++) {
        let id = taskIds[i];
        if (tasks[id].priority === 'Urgent') {
            urgentTaskCount++;
        }
    }
    urgentTasksNumber.innerHTML = urgentTaskCount;
}

/**
 * This function load the number of tasks in the category to do of an user an show them
 */
async function loadToDoTasks() {
    let toDoTasksNumber = document.getElementById('toDosNumber');
    let tasks = await loadAllTasksFromStorage();
    let taskIds = Object.keys(tasks);
    let toDoTasksCount = 0;
    for (let i = 0; i < taskIds.length; i++) {
        let id = taskIds[i];
        if (tasks[id].dragCategory === 'todo') {
            toDoTasksCount++;
        }
    }
    toDoTasksNumber.innerHTML = toDoTasksCount;
}

/**
 * This function load the number of tasks in the category progress of an user an show them
 */
async function loadInProgressTasks() {
    let inProgressTasksNumber = document.getElementById('inProgressNumber');
    let tasks = await loadAllTasksFromStorage();
    let taskIds = Object.keys(tasks);
    let inProgressTasksCount = 0;
    for (let i = 0; i < taskIds.length; i++) {
        let id = taskIds[i];
        if (tasks[id].dragCategory === 'inprogress') {
            inProgressTasksCount++;
        }
    }
    inProgressTasksNumber.innerHTML = inProgressTasksCount;
}

/**
 * This function load the number of tasks in the category feedback of an user an show them
 */
async function loadFeedbackTasks() {
    let feedbackTasksNumber = document.getElementById('feedbackNumber');
    let tasks = await loadAllTasksFromStorage();
    let taskIds = Object.keys(tasks);
    let feedbackTasksCount = 0;
    for (let i = 0; i < taskIds.length; i++) {
        let id = taskIds[i];
        if (tasks[id].dragCategory === 'awaitfeedback') {
            feedbackTasksCount++;
        }
    }
    feedbackTasksNumber.innerHTML = feedbackTasksCount;
}

/**
 * This function load the specific user name ofe the user and show the greet
 */
async function greetUser() {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let UserNameContainer = document.getElementById('userNameContainer');
    UserNameContainer.innerHTML = userData.name;
}


async function displayUpcomingDeadline() {
    let deadline = document.getElementById('deadline');
    let tasks = await loadAllTasksFromStorage();
    let taskIds = Object.keys(tasks);
    let earliestTask = null;
    for (let i = 0; i < taskIds.length; i++) {
        let id = taskIds[i];
        if (tasks[id].priority === 'Urgent') {
            let currentTask = tasks[id];
            let currentTaskDeadline = new Date(currentTask.date);
            if (!earliestTask || currentTaskDeadline < new Date(earliestTask.date)) {
                earliestTask = currentTask;
            }
        }
    }
    if (earliestTask) {
        let options = { year: 'numeric', month: 'long', day: 'numeric' };
        let formattedDeadline = new Date(earliestTask.date).toLocaleDateString('en-US', options);
        deadline.innerHTML = formattedDeadline;
    } else {
        deadline.innerHTML = 'No upcoming Deadlines';
    }
}

async function initSummary() {
    includeHTML();
    await loadAllTasks();
    await greetUser();
    await loadToDoTasks();
    await loadDoneTasks();
    await loadUrgentTasksNumber();
    await displayUpcomingDeadline();
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
    if (tasks) {
        let taskIds = Object.keys(tasks);
        allTasksNumber.innerHTML = taskIds.length;
    } else {
        allTasksNumber.innerHTML = '0';
    }
}


async function loadDoneTasks() {
    let doneTasksNumber = document.getElementById('doneNumber');
    let tasks = await loadAllTasksFromStorage();
    if (tasks) {
        let taskIds = Object.keys(tasks);
        let doneTasksCount = 0;
        for (let i = 0; i < taskIds.length; i++) {
            let id = taskIds[i];
            if (tasks[id].dragCategory === 'done') {
                doneTasksCount++;
            }
        }
        doneTasksNumber.innerHTML = doneTasksCount;
    } else {
        doneTasksNumber.innerHTML = '0';
    }
}

/**
 * This function load the number of taks in the category urgent of an user an show them
 */
async function loadUrgentTasksNumber() {
    let urgentTasksNumber = document.getElementById('urgentTasksNumber');
    let tasks = await loadAllTasksFromStorage();
    if (tasks) {
        let taskIds = Object.keys(tasks);
        let urgentTaskCount = 0;
        for (let i = 0; i < taskIds.length; i++) {
            let id = taskIds[i];
            if (tasks[id].priority === 'Urgent') {
                urgentTaskCount++;
            }
        }
        urgentTasksNumber.innerHTML = urgentTaskCount;
    } else {
        urgentTasksNumber.innerHTML = '0';
    }
}

/**
 * This function load the number of tasks in the category to do of an user an show them
 */
// Bitte Funktion prüfen
async function loadToDoTasks() {
    let toDoTasksNumber = document.getElementById('toDosNumber');
    let tasks = await loadAllTasksFromStorage();
    if (tasks) {
        let taskIds = Object.keys(tasks);
        let toDoTasksCount = 0;
        for (let i = 0; i < taskIds.length; i++) {
            let id = taskIds[i];
            if (tasks[id].dragCategory === 'todo') {
                toDoTasksCount++;
            }
        }
        toDoTasksNumber.innerHTML = toDoTasksCount;
    } else {
        toDoTasksNumber.innerHTML = '0';
    }
}

/**
 * This function load the number of tasks in the category progress of an user an show them
 */
async function loadInProgressTasks() {
    let inProgressTasksNumber = document.getElementById('inProgressNumber');
    let tasks = await loadAllTasksFromStorage();
    if (tasks) {
        let taskIds = Object.keys(tasks);
        let inProgressTasksCount = 0;
        for (let i = 0; i < taskIds.length; i++) {
            let id = taskIds[i];
            if (tasks[id].dragCategory === 'inprogress') {
                inProgressTasksCount++;
            }
        }
        inProgressTasksNumber.innerHTML = inProgressTasksCount;
    } else {
        inProgressTasksNumber.innerHTML = '0';
    }
}
/**
 * This function load the number of tasks in the category feedback of an user an show them
 */
async function loadFeedbackTasks() {
    let feedbackTasksNumber = document.getElementById('feedbackNumber');
    let tasks = await loadAllTasksFromStorage();
    if (tasks) {
        let taskIds = Object.keys(tasks);
        let feedbackTasksCount = 0;
        for (let i = 0; i < taskIds.length; i++) {
            let id = taskIds[i];
            if (tasks[id].dragCategory === 'awaitfeedback') {
                feedbackTasksCount++;
            }
        }
        feedbackTasksNumber.innerHTML = feedbackTasksCount;
    } else {
        feedbackTasksNumber.innerHTML = '0';
    }
}


/**
 * This function load the specific user name ofe the user and show the greet
 */
async function greetUser() {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let userNameContainer = document.getElementById('userNameContainer');
    if (userData.name !== 'Guest') {
        userNameContainer.innerHTML = userData.name;
    }
    document.getElementById('greeting').innerHTML = getDayTime();
}


function greetDayTime(dayTime) {
    if (dayTime < 10) {
        return 'Good Morning,'
    } else if (dayTime >= 10 && dayTime < 16) {
        return 'Hello,'
    } else if (dayTime >= 16 && dayTime < 18) {
        return 'Good afternoon,'
    } else {
        return 'Good evening,'
    }
}

/**
 * This function get the current time of the day for the matching greeting
 * 
 * @returns 
 */
function getDayTime() {
    let dayTime = new Date().getHours();
    let greeting = greetDayTime(dayTime);
    return greeting;
}


async function displayUpcomingDeadline() {
    let deadline = document.getElementById('deadline');
    let tasks = await loadAllTasksFromStorage();
    if (tasks) {
        let taskIds = Object.keys(tasks);
        let earliestTask = null;
        for (let id of taskIds) {
            let currentTask = tasks[id];
            if (currentTask.priority === 'Urgent') {
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
    } else {
        deadline.innerHTML = 'No upcoming Deadlines';
    }
}

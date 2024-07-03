async function initSummary() {
    includeHTML();
    showLoggedUserInitials();
    await greetUser();
    await loadAllTasks();
    await displayUpcomingDeadline();
    await loadUrgentsTasks();
}

async function loadAllTasks() {
    let allTasksArray = await loadAllTasksFromStorage();
    let allTasksNumber = document.getElementById('allTasksNumber');
    allTasksNumber.innerHTML = allTasksArray.length;
}

async function loadUrgentsTasks() {
    let urgentTasks = await loadAllUrgentTasksFromStorage();
    let urgentTasksNumber = document.getElementById('urgentTasksNumber');
    urgentTasksNumber.innerHTML = urgentTasks.length;
}

async function greetUser() {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let UserNameContainer = document.getElementById('userNameContainer');
    UserNameContainer.innerHTML = userData.name;
}


async function displayUpcomingDeadline() {
    let deadline = document.getElementById('deadline');
    let urgentTasks = await loadAllUrgentTasksFromStorage();
    let earliestTask = urgentTasks[0];
    for (let i = 1; i < urgentTasks.length; i++) {
        let currentTask = urgentTasks[i];
        let currentTaskDeadline = new Date(currentTask.date);
        let earliestTaskDeadline = new Date(earliestTask.date);
        if (currentTaskDeadline < earliestTaskDeadline) {
            earliestTask = currentTask;
        }
    }
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDeadline = new Date(earliestTask.date).toLocaleDateString('en-US', options);
    deadline.innerHTML = formattedDeadline;
}
async function initSummary() {
    includeHTML();
    showLoggedUserInitials();
    await greetUser();
    await loadAllTasks();
    await loadUrgentsTasks();
}

async function loadAllTasks() {
    let allTasksArray = await loadAllTasksFromStorage();
    let allTasksNumber = document.getElementById('allTasksNumber');
    allTasksNumber.innerHTML = allTasksArray.length;
}

async function loadUrgentsTasks() {
    let urgentTasks = await loadAllUrgentTasksFromStorage();
    console.log(urgentTasks);
    let urgentTasksNumber = document.getElementById('urgentTasksNumber');
    urgentTasksNumber.innerHTML = urgentTasks.length;
}


async function greetUser() {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let UserNameContainer = document.getElementById('userNameContainer');
    UserNameContainer.innerHTML = userData.name;
}
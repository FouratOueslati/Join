async function initSummary() {
    includeHTML();
    showLoggedUserInitials();
    await greetUser();
    await loadAllTasks();
}

async function loadAllTasks() {
    let allTasksArray = await loadAllTasksFromStorage();
    let allTasksNumber = document.getElementById('allTasksNumber');
    allTasksNumber.innerHTML = allTasksArray.length;
}


async function greetUser() {
    let userData = await loadSpecificUserDataFromLocalStorage();
    let UserNameContainer = document.getElementById('userNameContainer');
    UserNameContainer.innerHTML = userData.name;
}
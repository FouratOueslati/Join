function onloadFunction() {
    displayName();
}

async function displayName() {
    let containerContact = document.getElementById("contactList");
    let data = await loadUserData("contacts");
    let contacts = Object.values(data);
    for (let i = 0; i < contacts.length; i++) {
        let name = contacts[i].name;
        let color = contacts[i].backgroundcolor;
        let initials = getInitials(name);
        containerContact.innerHTML += generateContactToChose(name, color, initials, i);
    }
}

function getInitials(name) {
    let upperChars = "";
    let words = name.split(" ");
    for (let word of words) {
        if (word.length > 0) {
            upperChars += word[0].toUpperCase();
        }
    }
    return upperChars;
}

function generateContactToChose(name, color, initials, i) {
    return /*html*/ `
    <div class="contact-boarder">
        <div class="name-inicial">
            <div class="circle-inicial" style="background: ${color}">
                <div class="inicial-style">${initials}</div>
            </div>
            <li id="${name}">${name}</li>
        </div>
        <div class="chek-box-custom">
            <input type="checkbox" class="check-box-style" onclick="displayContactForAssignment()">
        </div>
    </div>
    `;
}

function displayContactForAssignment() {
    let containerBubbleInitials = document.getElementById('contactsDisplayBuble');
    containerBubbleInitials.innerHTML = '';
    let checkboxes = document.querySelectorAll('.check-box-style');
    for (let i = 0; i < checkboxes.length; i++) {
        let checkbox = checkboxes[i];
        if (checkbox.checked) {
            let contactElement = checkbox.closest('.contact-boarder');
            let nameElement = contactElement.querySelector('li');
            let initialsElement = contactElement.querySelector('.circle-inicial .inicial-style');
            let circleElement = contactElement.querySelector('.circle-inicial');
            let initials = initialsElement.innerText;
            let color = circleElement.style.background;
            containerBubbleInitials.innerHTML += generateBubbleInitials(i, initials, color);
        }
    }
}

function generateBubbleInitials(i, initials, color) {
    return /* html */ `
    <div id="bubble-${i}" class="bubble-initial" style="background: ${color}">
        <span class="inicial-style">${initials}</span>
    </div>
    `;
}

function addSubtask() {
    subtaskInput = document.getElementById('subtask');
    container = document.getElementById('subtaskContainer');
}


// das hier lädt den EventListener für die Prio und Categories buttons
document.addEventListener('DOMContentLoaded', (event) => {
    addPrioEventListeners();
    addCategoryEventListener();
});


function addPrioEventListeners() {
    document.getElementById('urgentButton').addEventListener('click', () => {
        localStorage.setItem('lastClickedButton', 'urgentButton');
    });

    document.getElementById('mediumButton').addEventListener('click', () => {
        localStorage.setItem('lastClickedButton', 'mediumButton');
    });

    document.getElementById('lowButton').addEventListener('click', () => {
        localStorage.setItem('lastClickedButton', 'lowButton');
    });
}


function addCategoryEventListener() {
    document.querySelectorAll('#categoryMenu li').forEach(category => {
        category.addEventListener('click', () => {
            localStorage.setItem('selectedCategory', category.textContent.trim());
        });
    });
}


// ACHTUNG DARAN ARBEITET DER FOURAT NOCH DAHER DIE FUNKTION AUSGEBLENDET
async function addTask() {
    try {
        let userData = await loadSpecificUserDataFromLocalStorage();

        let taskTitle = document.getElementById('taskTitle').value;
        let taskDescription = document.getElementById('taskDescription').value;
        let date = document.getElementById('date').value;
        let lastClickedButton = localStorage.getItem('lastClickedButton');
        let selectedCategory = localStorage.getItem('selectedCategory');
        let uid = localStorage.getItem('uid')

        let task = { name: taskTitle, description: taskDescription, date: date, category: selectedCategory};

        if (lastClickedButton === 'urgentButton') {
            userData.urgentTasks = userData.urgentTasks || [];
            userData.urgentTasks.push(task);
        } else if (lastClickedButton === 'mediumButton') {
            userData.mediumTasks = userData.mediumTasks || [];
            userData.mediumTasks.push(task);
        } else if (lastClickedButton === 'lowButton') {
            userData.lowTasks = userData.lowTasks || [];
            userData.lowTasks.push(task);
        }

        await updateUserData(uid, userData);

        console.log('Task added successfully:', task);
    } catch (error) {
        console.error('Error adding task:', error);
    }
}
async function getTaskDataFromFireBase() {
    let data = await loadSpecificUserDataFromLocalStorage();
    console.log(data);
    let tasks = Object.values(data);
    let containerToDo = document.getElementById('open');
    let urgent = data['urgentTasks'];
    for (let i = 0; i < urgent.length; i++) {
        console.log('Urgent', urgent);
    }
}


/*
async function getTaskDataFromFireBase() {
    let containerToDo = document.getElementById('open');
    containerToDo.innerHTML = '';
    let userData = await loadSpecificUserDataFromLocalStorage();
    let urgent = userData.urgentTask;
    let medium = userData.mediumTask;
    let low = userData.lowTask;
    const data = [Object.values(urgent), Object.values(medium), Object.values(low)];
    for (let i = 0; i < data.length; i++) {
        console.log('Task', data[i]); 
    }
}
*/






let todos = [{
    'id': 0,
    'title': 'Task 1',
    'category': 'open'
}, {
    'id': 1,
    'title': 'Task 2',
    'category': 'open'
}, {
    'id': 2,
    'title': 'Task 3',
    'category': 'closed'
}];

let currentDraggedElement;

function updateHTML() {
    getTaskDataFromFireBase();
    let open = todos.filter(t => t['category'] == 'open');

    document.getElementById('open').innerHTML = '';

    for (let index = 0; index < open.length; index++) {
        const element = open[index];
        document.getElementById('open').innerHTML += generateTodoHTML(element);
    }

    let inprogress = todos.filter(t => t['category'] == 'inprogress')

    document.getElementById('inprogress').innerHTML = '';

    for (let index = 0; index < inprogress.length; index++) {
        const element = inprogress[index];
        document.getElementById('inprogress').innerHTML += generateTodoHTML(element);
    }

    let awaitfeedback = todos.filter(t => t['category'] == 'awaitfeedback')

    document.getElementById('awaitfeedback').innerHTML = '';

    for (let index = 0; index < awaitfeedback.length; index++) {
        const element = awaitfeedback[index];
        document.getElementById('awaitfeedback').innerHTML += generateTodoHTML(element);
    }

    let closed = todos.filter(t => t['category'] == 'closed');

    document.getElementById('closed').innerHTML = '';

    for (let index = 0; index < closed.length; index++) {
        const element = closed[index];
        document.getElementById('closed').innerHTML += generateTodoHTML(element);
    }
}

function startDragging(id) {
    currentDraggedElement = id;
}

function generateTodoHTML(element) {
    return `<div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">${element['title']}</div>`;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    todos[currentDraggedElement]['category'] = category;
    updateHTML();
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}
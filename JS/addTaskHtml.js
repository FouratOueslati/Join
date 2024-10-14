function generateContactToChoseHtml(name, color, initials, i) {
    return `
    <label id="contactToChose${i}" class="contact-boarder">
        <div class="name-initial">
            <div class="circle-initial" style="background: ${color}">
                <div class="initial-style">${initials}</div>
            </div>
            <li id="contact-${i}" data-name="${name}">${name}</li>
        </div>
        <div class="check-box-custom">
            <input id="checkbox${i}" type="checkbox" class="assign-contact-checkbox" data-name="${name}" onchange="choseContactForAssignment(event, ${i})">
        </div>
    </label>
    `;
}


function generateContactToChoseHtml(name, color, initials, i) {
    return `
    <label id="contactToChose${i}" class="contact-boarder">
        <div class="name-initial">
            <div class="circle-initial" style="background: ${color}">
                <div class="initial-style">${initials}</div>
            </div>
            <li id="contact-${i}" data-name="${name}">${name}</li>
        </div>
        <div class="check-box-custom">
            <input id="checkbox${i}" type="checkbox" class="assign-contact-checkbox" data-name="${name}" onchange="choseContactForAssignment(event, ${i})">
        </div>
    </label>
    `;
}


function generateContactToChoseInEditTaskHtml(name, color, initials, i) {
    return `
    <label id="contactToChoseInEditTask${i}" class="contact-boarder-edittask">
        <div class="name-initial">
            <div class="circle-initial-edittask" style="background: ${color}">
                <div class="initial-style">${initials}</div>
            </div>
            <li id="contactInEditTask-${i}" data-name-edittask="${name}">${name}</li>
        </div>
        <div class="check-box-custom">
            <input id="checkboxInEditTask${i}" type="checkbox" class="assign-contact-checkbox-edittask" data-name-edittask="${name}" onchange="choseContactForAssignmentEditTask(event, ${i})">
        </div>
    </label>
    `;
}


function generateBubbleInitialsHtml(i, initials, color) {
    return `
    <div id="bubble${i}" class="bubble-initial" style="background: ${color}">
        <span class="initial-style">${initials}</span>
    </div>
    `;
}


function addSubtaskHtml(taskIndex, subtaskIndex, subtask) {
    return `
        <div class="subtask-Txt" id="subtask-Txt-${taskIndex}-${subtaskIndex}">
            <div id="subtask${taskIndex}-${subtaskIndex}">${subtask}</div>
            <div class="delete-edit">
                <img src="./img/addTaskImg/edit.svg" onclick="editSubtask(${taskIndex}, ${subtaskIndex})">
                <img src="./img/addTaskImg/delete.svg" onclick="deleteSubtask(${taskIndex}, ${subtaskIndex})">
            </div>
        </div>
    `;
}





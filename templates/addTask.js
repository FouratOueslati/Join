function addSubtaskHtml(subtaskCounter, subtask) {
    return `
        <div class="subtask-Txt" id="subtask-Txt-${subtaskCounter}">
            <div id="subtask${subtaskCounter}">${subtask}</div>
            <div class="delete-edit">
                <img src="./addTaskImg/edit.svg" onclick="editSubtask(${subtaskCounter})">
                <img src="./addTaskImg/delete.svg" onclick="deleteSubtask(${subtaskCounter})">
            </div>
        </div>
    `;
}


function displaySubtasksHtml(index, subtask) {
    return `
        <div class="subtask-Txt" id="subtask-Txt-${index}">
            <div id="subtask${index}">${subtask}</div>
            <div class="delete-edit">
                <img src="./addTaskImg/edit.svg" onclick="editSubtask(${index})">
                <img src="./addTaskImg/delete.svg" onclick="deleteSubtask(${index})">
            </div>
        </div>
    `;
}


// function generateContactToChoseHtml(name, color, initials, i) {
//     return `
//     <div class="contact-boarder">
//         <div class="name-initial">
//             <div class="circle-initial" style="background: ${color}">
//                 <div class="initial-style">${initials}</div>
//             </div>
//             <li id="contact-${i}" data-name="${name}" class="contact-item">${name}</li>
//         </div>
//         <div class="check-box-custom">
//             <input id="checkbox${i}" type="checkbox" class="check-box-style" data-name="${name}" onchange="choseContactForAssignment(event)">
//         </div>
//     </div>
//     `;
// }


function generateBubbleInitialsHtml(i, initials, color) {
    return `
    <div id="bubble${i}" class="bubble-initial" style="background: ${color}">
        <span class="initial-style">${initials}</span>
    </div>
    `;
}


function generateContactToChoseHtml(name, color, initials, i) {
    return `
    <div class="contact-boarder">
        <div class="name-initial">
            <div class="circle-initial" style="background: ${color}">
                <div class="initial-style">${initials}</div>
            </div>
            <li id="contact-${i}" data-name="${name}" class="contact-item">${name}</li>
        </div>
        <div class="check-box-custom">
            <input id="checkbox${i}" type="checkbox" class="check-box-style" data-name="${name}" onchange="choseContactForAssignment(event)">
        </div>
    </div>
    `;
}

function generateBubbleInitialsHtml(i, initials, color) {
    return `
    <div id="bubble${i}" class="bubble-initial" style="background: ${color}">
        <span class="initial-style">${initials}</span>
    </div>
    `;
}
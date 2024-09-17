function getToDoTaskHtml(task, i) {
    return /*html*/`
    <div draggable="true" ondragstart="startDragging(${i})" class="todo-class" onclick="zoomTaskInfo(${i})" id="task${i}">
        <div class="task-category">
            <div id="category${i}" class="category">${task['task']['category']}</div>
            <div class="moveTo-menu-container">
                <img id="moveToMenuImg" onclick="toggleMoveToMenu(event, ${i})" src="./img/menu.png" class="moveTo-menu d-none">
                <div id="moveToMenu${i}" class="moveTo-menu-options d-none">
                     <ul >
                        <div class="move-to">Move to: </div>
                        <li class="category-to-moveTo" onclick="moveToFromMenu(event, 'todo', ${i})">To do</li>
                        <li class="category-to-moveTo" onclick="moveToFromMenu(event, 'inprogress', ${i})">In progress</li>
                        <li class="category-to-moveTo" onclick="moveToFromMenu(event, 'awaitfeedback', ${i})">Await Feedback</li>
                        <li class="category-to-moveTo" onclick="moveToFromMenu(event, 'done', ${i})">Done</li>
                    </ul>
                </div>
            </div>
        </div>
        <div id="taskTitle${i}" class="task-title">${task['task']['name']}</div>
        <div id="desciption${i}" class="task-description">${task['task']['description']}</div>
        <div class="subtasks-number-container">
            <div id="loadBarContainer${i}"  class="progress">
            <div id="loadBar${i}" class="progress-bar"></div>
            </div>
            <div id="subtasksNumber${i}" class="subtasks">
            </div>
        </div>
        <div class="initials-and-priority-container">
          <div class="initials-container" id="initialsContainer${i}"></div>
          <img id="priorityImgUnopened${i}">
        </div>
        <div id="myModal${i}" class="modal">
            <div id="modal${i}" class="modal-content">
              ${generateModalContent(task, i)}
            </div>
        </div>
    </div>`;
}


function generateModalContent(task, i) {
    return /*html*/`
        <div class="category-opened-container">
            <div id="categoryOpened${i}" class="category-opened">${task['task']['category']}</div>
            <img onclick="closeModal(myModal${i})" src="./img/close.png" class="pointer">
        </div>
        <div class="scroll-y">
        <div id="openedTitle${i}" class="title-opened">${task['task']['name']}</div>
        <div class="description-opened">${task['task']['description']}</div>
        <div class="details-container">
            <span class="fine-written">Due date:</span>
            <div class="space-correct">${task['task']['date']}</div>
        </div>
        <div class="details-container">
            <span class="fine-written">Priority:</span>
            <div class="space-correct">
                <div id="openedPriority${i}">${task['task']['priority']}</div>
                <img id="priorityImg${i}">
            </div>
        </div>
        <div class="assigned-to-container">
            <div>Assigned To:</div>
            <div class="assigned-contacts-container">
                <div>${generateContactInitialsAndNamesHtml(task['task']['contacts'], i)}</div>
            </div>
        </div>
        <div>
            <div class="details-container">Subtasks</div>
            <div class="subtasks-opened">${generateSubtasksHtml(task['task']['subtasks'], i)}</div>
        </div>
        <div class="edit-delete-task-container">
            <img onclick="deleteTask(${i})" class="pointer" src="./img/delete_contact.png">
            <div style="font-size: 12px;">|</div>
            <img onclick="editTask(${i})" class="pointer" src="./img/edit_contacts.png">
        </div>
        </div>
    `;
}


function generateEditModalContent(task, i) {
    const modalId = `myModal${i}`;
    return /*html*/`
        <div class="category-opened-container">
            <div class="category-opened">${task.category}</div>
            <img id="closeImg${i}" src="./img/close.png" class="pointer"  onclick="closeModalEdit(document.getElementById('${modalId}'))">
        </div>
        <div class="scroll-y">
        <div class="modal-edit-content">
            <label for="editTaskTitle${i}" class="margin-span">Title:</label>
            <input id="taskTitleEdit${i}" required placeholder="Enter a title..." minlength="4" class="task-input-field" value="${task.name}">
            <label for="editTaskDescription${i}">Description:</label>
            <textarea style="height: 80px;" id="taskDescriptionEdit${i}" required placeholder="Enter a Description..." minlength="4" class="task-input-field">${task.description}</textarea>
            <label for="editTaskTitle${i}" class="margin-span">Assigned to:</label>
            <div class="inputs-flex">
                <div class="drop-down">
                    <div onclick="showCheckedContacts()"  class="select">
                        <span class="selected" id="selectContact">Search Contact</span>
                        <div class="caret"></div>
                    </div>
                    <ul class="menu" id="contactListEdit"></ul>
                </div>
                <div class="bubble-setup">
                    <div id="contactsDisplayBubbleInEdit" class="assigned-contacts-container"></div>
                </div>
            </div>
            <label for="editTaskDate${i}" class="margin-span">Due date:</label>
            <input id="dateEdit${i}" type="date" class="task-input-field date" value="${task.date}">
            <label for="editTaskPriority${i}" class="margin-span">Priority:</label>
            <div class="button-prio-width">
        <button onclick="addPrioEventListenersEdit(); changeColorEdit(this);" id="urgentButtonEdit" type="button" class="button-prio">
            <div class="center">
            <div class="button-txt-img">Urgent <img src="./addTaskImg/high.svg" class="prio-photos"></div>
            </div>
        </button>
        <button onclick="addPrioEventListenersEdit(); changeColorEdit(this);" id="mediumButtonEdit" type="button" class="button-prio">
            <div class="center">
            <div class="button-txt-img">Medium <img src="./addTaskImg/medium.svg" class="prio-photos"></div>
            </div>
        </button>
        <button onclick="addPrioEventListenersEdit(); changeColorEdit(this);" id="lowButtonEdit" type="button" class="button-prio">
            <div class="center">
            <div class="button-txt-img">Low <img src="./addTaskImg/low.svg" class="prio-photos"></div>
            </div>
        </button>
            </div>
        </div>
        <label for="editTaskTitle${i}" class="margin-span">Subtask</label>
        <div class="input-with-img">
            <div style="display: flex; align-items: center; width: 100%;">
                <input required placeholder="Add new subtask" class="task-input-with-img" oninput="onInputChangeEdit()" id="inputFieldSubtaskEdit">
                <img src="./addTaskImg/plus.svg" class="input-field-svg" id="plusImgEdit">
            </div>
            <div class="check-cross-position" id="closeOrAcceptEdit">
                <button class="button-transparacy">
                    <img onclick="clearSubtaskInputEdit()" src="./addTaskImg/close.svg" class="subtaskButtons" alt="close">
                </button>
                <button class="button-transparacy">
                    <img onclick="addSubtaskEdit(${i})" src="./addTaskImg/checkBlack.svg" class="subtaskButtons" alt="check">
                </button>
            </div>
        </div>
        <div class="subtasks-opened" id="subtasksContainer${i}">
            ${generateSubtasksEditHtml(task.subtasks, i)}
        </div>
        <div class="align-center justify-center">
            <button class="button-dark color-blue-button" id="createTaskBtn" type="submit" onclick="saveTask(${i})">OK <img src="./img/check.png"></button>
        </div>
    `;
}
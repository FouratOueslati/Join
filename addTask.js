function getElements() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const selectContact = document.getElementById("selectContact").innerText;
    const date = document.getElementById("date").value;
    const selectCategory = document.getElementById("selectCategory").innerText;

    return {
        title,
        description,
        selectContact,
        date,
        selectCategory
    };
}

function addTaskToBoard() {
    const elements = getElements();
    console.log(elements);
}
function showLoggedUserInitials() {
    let data = localStorage.getItem('data');
    let dataAsText = JSON.parse(data);
    let name = dataAsText.name
    let spaceIndex = name.indexOf(' ');
    let firstLetterOfName = name.charAt(0);
    let firstLetterOfLastName = name.charAt(spaceIndex + 1);
    if (name === 'Guest') {
        let roundContainer = document.getElementById('userInitialsRoundContainer');
        roundContainer.innerHTML = `${firstLetterOfName}`;
    } else {
        let roundContainer = document.getElementById('userInitialsRoundContainer');
        roundContainer.innerHTML = `${firstLetterOfName}${firstLetterOfLastName}`;
    }
}


function toggleMenu() {
    document.getElementById('menu').classList.toggle('d-none');
}

// die Funktion sorgt dafür dass die Initials erst nach dem Laden des benötigten Element erfolgt.
document.addEventListener('DOMContentLoaded', function () {
    includeHTML();
});
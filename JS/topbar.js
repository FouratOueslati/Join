/**
 * This function displays the initials of the logged in user
 */
function showLoggedUserInitials() {
    if (!window.location.pathname.includes('privacyPolicyExtern.html') && !window.location.pathname.includes('legalNoticeExtern.html')) {
        let data = localStorage.getItem('data');
        let dataAsText = JSON.parse(data);
        let name = dataAsText.name
        let spaceIndex = name.indexOf(' ');
        let firstLetterOfName = name.charAt(0);
        let firstLetterOfLastName = name.charAt(spaceIndex + 1);
        if (name && name === 'Guest') {
            let roundContainer = document.getElementById('userInitialsRoundContainer');
            roundContainer.innerHTML = `${firstLetterOfName}`;
        } else {
            let roundContainer = document.getElementById('userInitialsRoundContainer');
            roundContainer.innerHTML = `${firstLetterOfName}${firstLetterOfLastName}`;
        }
    }
}

/**
 * This function hide or display the menu
 */
function toggleMenu() {
    document.getElementById('menu').classList.toggle('d-none');
}


/**
 * This function loads the initials after the DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function () {
    includeHTML();
});
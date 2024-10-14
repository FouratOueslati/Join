function initPolicy() {
    showLoggedUserInitials();
    addClassScroll();     
    changeBgColorMenu();
}

/**
 * This function add or remove the characteristic to scroll the webside based on the screen width
 */
function addClassScroll() {
    const screenWidth = window.innerWidth;
    const parentContainer = document.getElementById('ppParentCont');
    if (screenWidth < 500) {
        parentContainer.classList.add("scroll");
    } else {
        parentContainer.classList.remove("scroll");
    }
}
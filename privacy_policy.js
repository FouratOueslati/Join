
function addClassScroll() {
    const screenWidth = window.innerWidth;
    const parentContainer = document.getElementById('ppParentCont');
    if (screenWidth < 500) {
        parentContainer.classList.add("scroll");
    } else {
        parentContainer.classList.remove("scroll");
    }
}


function initPolicy() {
    includeHTML();
    addClassScroll();     
    showLoggedUserInitials();
}
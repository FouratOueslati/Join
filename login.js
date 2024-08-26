async function logIn() {
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    let data = await loadUserData("users");
    let users = Object.entries(data);
    let foundUser = users.find(([uid, u]) => u.email === email && u.password === password);
    if (!foundUser) {
        wrongPassword();
        return null;
    }
    let userUID = foundUser[0];
    await setLoggedInUser(userUID);
    let rememberMeCheckbox = document.getElementById('rememberMeCheckbox');
    let rememberMe = rememberMeCheckbox.checked;
    localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');
    if (rememberMe) {
        localStorage.setItem('loggedInUser', JSON.stringify({ email: email, password: password }));
    }
    window.location.href = "summary.html";
    return userUID;
}


/**
 * This function load saved datas, logged the guest user in and forward to the summary
 */
async function guestLogin() {
    setLoggedInGuest('guest@email.com', '1110448388');
    let guest = JSON.parse(localStorage.getItem('loggedInGuest'));
    let email = document.getElementById('loginEmail');
    let password = document.getElementById('loginPassword');
    if (guest) {
        let emailLocalStorage = guest.email;
        let passworLocalStorage = guest.password;
        email.value = emailLocalStorage;
        password.value = passworLocalStorage;
        await setLoggedInGuest(emailLocalStorage, passworLocalStorage);
        window.location.href = "summary.html";
    }
}


/**
 * This function show an information if the entered password is wrong
 */
function wrongPassword() {
    let wrongPasswordContainer = document.getElementById('wrongPasswordContainer');
    if (wrongPasswordContainer) {
        wrongPasswordContainer.classList.remove('d-none');
        setTimeout(() => {
            wrongPasswordContainer.classList.add('d-none');
        }, 2000);
    }
}


/**
 * This function remember the login datas of an user and save them for the next login
 */
document.addEventListener('DOMContentLoaded', function () {
    let rememberMeCheckbox = document.getElementById('rememberMeCheckbox');
    let rememberMe = localStorage.getItem('rememberMe') === 'true';
    rememberMeCheckbox.checked = rememberMe;
    if (rememberMe) {
        let storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (storedUser && storedUser.email !== 'guest@email.com') {
            document.getElementById('loginEmail').value = storedUser.email;
            document.getElementById('loginPassword').value = storedUser.password;
        }
    }
});


/**
 * This function show the initals of the logged in user
 */
function showLoggedUserInitials() {
    let data = localStorage.getItem('data');
    let dataAsText = JSON.parse(data);
    let name = dataAsText.name
    let spaceIndex = name.indexOf(' ');
    let firstLetterOfName = name.charAt(0);
    let firstLetterOfLastName = name.charAt(spaceIndex + 1);
    let roundContainer = document.getElementById('userInitialsRoundContainer');
    roundContainer.innerHTML = `${firstLetterOfName}${firstLetterOfLastName}`;
}


/**
 * This function toggle the menu for hide or visible
 */
function toggleMenu() {
    document.getElementById('menu').classList.toggle('d-none');
}

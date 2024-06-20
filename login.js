// diese Funktion dient zum einloggen
async function logIn() {
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    let data = await loadUserData("users");
    let users = Object.entries(data);
    let foundUser = users.find(([uid, u]) => u.email === email && u.password === password);
    let userUID = foundUser[0];
    await setLoggedInUser(userUID);
    let rememberMeCheckbox = document.getElementById('rememberMeCheckbox');
    let rememberMe = rememberMeCheckbox.checked;
    localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');
    if (rememberMe) {
        localStorage.setItem('loggedInUser', JSON.stringify({ email: email, password: password }));
    } else {
        localStorage.removeItem('loggedInUser');
    }
    window.location.href = "summary.html";
    return userUID;
}


document.addEventListener('DOMContentLoaded', function () {
    let rememberMeCheckbox = document.getElementById('rememberMeCheckbox');
    let rememberMe = localStorage.getItem('rememberMe') === 'true';
    rememberMeCheckbox.checked = rememberMe;
});


async function logOut() {
    localStorage.removeItem('uid');
    localStorage.removeItem('data'); 
    window.location.href = "login.html";
}

function showLoggedUserInitials() {
    debugger
    let data = localStorage.getItem('data');
    let dataAsText = JSON.parse(data);
    let name = dataAsText.name
    let spaceIndex = name.indexOf(' ');
    let firstLetterOfName = name.charAt(0);
    let firstLetterOfLastName = name.charAt(spaceIndex + 1);
    let roundContainer = document.getElementById('userInitialsRoundContainer');
    roundContainer.innerHTML = `
${firstLetterOfName}${firstLetterOfLastName}
`;
}

function toggleMenu() {
    document.getElementById('menu').classList.toggle('d-none');
}
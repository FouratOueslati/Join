// diese Funktion dient zum einloggen
async function login() {
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    let data = await loadUserData("users");
    let users = Object.entries(data);
    let foundUser = users.find(([uid, u]) => u.email === email && u.password === password);
    let userUID = foundUser[0];
    await setLoggedInUser(userUID);
    window.location.href = "summary.html";
    return userUID;
}

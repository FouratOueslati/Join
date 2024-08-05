/**
 * This function delete the entries of an user from the local storage, logged out the user and forward the user to the log in
 */
async function logOut() {
    let data = JSON.parse(localStorage.getItem('data'));
    let guest = JSON.parse(localStorage.getItem('loggedInGuest'));
    if (data && data.name) {
        let name = data.name;
        if (name === 'Guest') {
            localStorage.removeItem('contacts');
            window.location.href = "login.html";
        } else {
            let Data = await loadUserData("users");
            let users = Object.entries(Data);
            let foundUser = users.find(([uid, u]) => u.email === data.email && u.password === data.password);
            let userUID = foundUser[0];
            localStorage.removeItem('uid');
            localStorage.removeItem('data');
            localStorage.removeItem('contacts');
            await setLoggedInUser(userUID);
            window.location.href = "login.html";
        }
    }
}

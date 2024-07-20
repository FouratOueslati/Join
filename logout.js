/**
 * This function delete the entries of an user from the local storage, logged out the user and forward the user to the log in
 */
async function logOut() {
    localStorage.removeItem('uid');
    localStorage.removeItem('data'); 
    localStorage.removeItem('contacts'); 
    window.location.href = "login.html";
}
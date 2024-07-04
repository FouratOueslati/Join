async function logOut() {
    localStorage.removeItem('uid');
    localStorage.removeItem('data'); 
    localStorage.removeItem('contacts'); 
    window.location.href = "login.html";
}
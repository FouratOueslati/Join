function displayIntialsOfLoggedInUser() {
let initialsContainer = document.getElementById('userInitialsRoundContainer');
let data = localStorage.getItem('data');
let loggedUserName = data.name;
console.log('data is', data)
console.log('name is', loggedUserName)
}
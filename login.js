// diese Funktion dient zum einloggen
async function logIn() {
    try {
        let email = document.getElementById('loginEmail').value;
        let password = document.getElementById('loginPassword').value;
        let data = await loadUserData("users");
        let users = Object.entries(data);

        // Find the user with the matching email and password
        let foundUser = users.find(([uid, u]) => u.email === email && u.password === password);
        
        if (!foundUser) {
            alert('Invalid email or password.');
            return null;
        }

        let userUID = foundUser[0];
        await setLoggedInUser(userUID);

        let rememberMeCheckbox = document.getElementById('rememberMeCheckbox');
        let rememberMe = rememberMeCheckbox.checked;
        
        // Remember the user if 'remember me' is checked
        localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');
        if (rememberMe) {
            localStorage.setItem('loggedInUser', JSON.stringify({ email: email, password: password }));
        } else {
            localStorage.removeItem('loggedInUser');
        }

        // Redirect to the summary page
        window.location.href = "summary.html";
        return userUID;
    } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred during login. Please try again later.');
        return null;
    }
}

// for remeber me 
document.addEventListener('DOMContentLoaded', function () {
    let rememberMeCheckbox = document.getElementById('rememberMeCheckbox');
    let rememberMe = localStorage.getItem('rememberMe') === 'true';
    rememberMeCheckbox.checked = rememberMe;
    if (rememberMe) {
        let storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (storedUser) {
            document.getElementById('loginEmail').value = storedUser.email;
            document.getElementById('loginPassword').value = storedUser.password;
        }
    }
});

function showLoggedUserInitials() {
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
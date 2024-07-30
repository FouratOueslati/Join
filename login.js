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
    if (rememberMe ) {
        localStorage.setItem('loggedInUser', JSON.stringify({ email: email, password: password }));
    } else {
        localStorage.removeItem('loggedInUser');
    }
    window.location.href = "summary.html";
    return userUID;
}

// for remeber me 
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


async function guestLogin() {
    let guest = JSON.parse(localStorage.getItem('loggedInGuest'));
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    if (guest && guest.email === 'guest@email.com') {
        email = guest.email;
        password = guest.password;
        window.location.href = "summary.html";
    } else {
        await postGuest();
        window.location.href = "summary.html";
    }
}

async function postGuest(path = "users", data = {}) {
    let name = 'Guest';
    let email = 'guest@email.com';
    let password = generateRandom10DigitNumber();
    localStorage.setItem('loggedInGuest', JSON.stringify({ email: email, password: password }));
    data = {
        name: name,
        email: email,
        password: password,
        urgentTasks: [],
        mediaumTasks: [],
        lowTasks: [],
        contacts: [],
    };
    let response = await fetch(BASE_URL_USER_DATA + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    await setLoggedInGuest(email, password);
    return responseToJson = await response.json();
}


async function setLoggedInGuest(email, password) {
    localStorage.removeItem('uid');
    localStorage.removeItem('data');
    let data = await loadUserData("users");
    let users = Object.entries(data);
    let foundUser = users.find(([uid, u]) => u.email === email && u.password === password);
    let userUID = foundUser[0];
    await setLoggedInUser(userUID);
}


function generateRandom10DigitNumber() {
    let randomNumber = Math.floor(Math.random() * 10000000000).toString();
    while (randomNumber.length < 10) {
        randomNumber = '0' + randomNumber;
    }
    return randomNumber;
}
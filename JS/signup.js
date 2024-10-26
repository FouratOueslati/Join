/**
 * This function createa an user object with all the data and if the password is correct 
 * the user is registered and can log in
 * 
 * @param {string} path 
 * @returns 
 */
async function signUp(path = "users") {
    let {name, email, password, confirmedPassword, color} = getUserData();
    if (password !== confirmedPassword) {
        alert("Passwords do not match.");
        return;
    }
    let data = createUserObject(name, email, password);
    let responseToJson = await postUser(path, data);
    if (responseToJson) {
        let userUID = responseToJson.name;
        let userData = await setSignedUpUser(userUID);
        if (userData) {
            await createOwnContact(name, email, '', color, userUID);
            document.getElementById('successfull-container').classList.remove('d-none');
            document.getElementById('succesfull-signup').classList.add('transform');
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        }
    }
}


/**
 * This function get all the entered user data
 * 
 * @returns {object}
 */
function getUserData() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmedPassword = document.getElementById('confirmedPassword').value;
    let color = getRandomColor();
    return {
        name: name,
        email: email,
        password: password,
        confirmedPassword: confirmedPassword,
        color: color
    };
}


/**
 * This function create an object with the user data
 * 
 * @param {string} name 
 * @param {string} email 
 * @param {string} password 
 * @returns {object}
 */
function createUserObject(name, email, password) {
    return {
        name: name,
        email: email,
        password: password,
        urgentTasks: [],
        mediumTasks: [],
        lowTasks: [],
        contacts: []
    };
}


/**
 * This function create an object with my own user data
 * 
 * @param {string} name 
 * @param {string} email 
 * @param {number} number 
 * @param {string} color 
 * @param {string} uid 
 * @returns {object}
 */
async function createOwnContact(name, email, number, color, uid) {
    const you = " (you)"
    let contact = {
        name: name + (you),
        email: email,
        number: number,
        backgroundcolor: color
    };
    await postContacts(`/users/${uid}/contacts`, contact);
    return contact;
}


/**
 * This function is responsible that the form works
 */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.main-container-signup');
    const button = document.querySelector('.sign-up-button');

    form.addEventListener('input', () => {
        button.disabled = !form.checkValidity();
    });

    form.addEventListener('change', () => {
        button.disabled = !form.checkValidity();
    });
});


/**
 * This fuction displays or hide the entered password and places the curser where it was entered
 */
function togglePassword(inputId) {
    let passwordInput = document.getElementById(inputId);
    if (passwordInput.type === "text") {
        passwordInput.type = "password";
        passwordInput.style.backgroundImage = 'url(./img/visibility_off.png)';
    } else {
        passwordInput.type = "text";
        passwordInput.style.backgroundImage = 'url(./img/visibility.png)';
    }
    setTimeout(() => {
        const length = passwordInput.value.length;
        passwordInput.setSelectionRange(length, length);
    }, 0);
}



/**
 * This function checks whether the first and last name have been entered
 */
function validateName() {
    const nameInput = document.getElementById('name');
    let corectIncorect = document.getElementById('nameCorectIncorectS');
    const nameValue = nameInput.value.trim();
    if (nameValue.split(' ').length >= 2) {
        nameInput.style.borderColor = 'green'; 
        corectIncorect.textContent = '';
        corectIncorect.style.color = 'green';
    } else {
        nameInput.style.borderColor = 'red'; 
        corectIncorect.textContent = '-Input Name Surname';
        corectIncorect.style.color = 'red';
    }
}



/**
 * This function checks whethter the email was entered correctly
 */
function validateEmailS() {
    const emailInput = document.getElementById('email');
    const emailValue = emailInput.value.trim();
    const corectIncorect = document.getElementById('emailCorectIncorectS');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(emailValue)) {
        emailInput.style.borderColor = 'green'; 
        corectIncorect.textContent = '';  
    } else {
        emailInput.style.borderColor = 'red'; 
        corectIncorect.textContent = 'Invalid email format: example@mail.com';
        corectIncorect.style.color = 'red';
    }
}


/**
 * This function checks whethter the password was entered correctly
 */
function validatePassword() {
    const passwordInput = document.getElementById('password');
    const confirmedPasswordInput = document.getElementById('confirmedPassword');
    let corectIncorectOne = document.getElementById('passwordOneCorectIncorect');
    let corectIncorectTwo = document.getElementById('passwordTwoCorectIncorect');
    const passwordValue = passwordInput.value.trim();
    const confirmedPasswordValue = confirmedPasswordInput.value.trim();
    if (passwordValue.length >= 3) {
        passwordInput.style.borderColor = 'green'; 
        corectIncorectOne.textContent = '';
    } else {
        passwordInput.style.borderColor = 'red'; 
        corectIncorectOne.textContent = 'Input a minumum of 3 signs';
        corectIncorectOne.style.color = 'red';
    }
    if (confirmedPasswordValue === passwordValue && confirmedPasswordValue.length >= 3) {
        confirmedPasswordInput.style.borderColor = 'green'; 
        corectIncorectTwo.textContent = "";
    } else if (confirmedPasswordValue.length > 0) {
        confirmedPasswordInput.style.borderColor = 'red'; 
        corectIncorectTwo.textContent = "Password dosen't match";
        corectIncorectTwo.style.color = 'red';
    } else {
        confirmedPasswordInput.style.borderColor = ''; 
    }
}

function validatePolicyAcceptance(event) {
    const checkbox = document.getElementById('acceptPolicy');
    const errorMsg = document.getElementById('policyErrorMsg');
    const label = document.getElementById('acceptText');
    
    if (checkbox.checked) {
        label.style.color = 'green';
        errorMsg.textContent = ''; // Clear any previous error
    } else {
        event.preventDefault(); // Prevent form submission
        label.style.color = 'red';
        errorMsg.textContent = '- Please accept the privacy policy';
        errorMsg.style.color = 'red';
    }
}




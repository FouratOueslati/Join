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
 * This fuction displays or hide the entered password
 */
function togglePassword() {
    let password = document.getElementById('password');
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  }

  function toggleConfirmedPassword() {
    let password = document.getElementById('confirmedPassword');
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  }
async function signUp(path = "users") {
    let { name, email, password, confirmedPassword, color } = getUserData();
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


async function createOwnContact(name, email, number, color, uid) {
    let contact = {
        name: name,
        email: email,
        number: number,
        backgroundcolor: color
    };
    await postContacts(`/users/${uid}/contacts`, contact);
    return contact;
}


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
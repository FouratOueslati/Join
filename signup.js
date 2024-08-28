async function postUser(path = "users", data = {}) {
    let number = '';
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmedPassword = document.getElementById('confirmedPassword').value;
    let color = getRandomColor();
    let contact = await createOwnContact(name, email, number, color);
    data = {
        name: name,
        email: email,
        password: password,
        urgentTasks: [],
        mediumTasks: [],
        lowTasks: [],
        contacts: [contact],
    };
    document.getElementById('successfull-container').classList.remove('d-none');
    document.getElementById('succesfull-signup').classList.add('transform');
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1500);
    if (password === confirmedPassword) {
        let response = await fetch(BASE_URL_USER_DATA + path + ".json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        let responseToJson = await response.json();
        return responseToJson;
    } else {
        alert("Passwords don't match");
    }
}


async function createOwnContact(name, email, number, color) {
    let contact = { 
        name: name, 
        email: email, 
        number: number, 
        backgroundColor: color 
    };
    await postContacts('/users/' + uid + '/contacts', contact);
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


function generateUID() {
    return 'xxxxxxxxyxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

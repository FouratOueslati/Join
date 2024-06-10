// diese Funktion dient zur Registreirung neuer Users
async function postUser(path = "users", data = {}) {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let confirmedPassword = document.getElementById('confirmedPassword');
    data = {
        name: name.value,
        email: email.value,
        password: password.value,
        urgentTasks: [],
        mediaumTasks: [],
        lowTasks: [],
        contacts: [],
    };
    document.getElementById('successfull-container').classList.remove('d-none');
    document.getElementById('succesfull-signup').classList.add('transform');
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);

    if (password.value === confirmedPassword.value) {
        let response = await fetch(BASE_URL_USER_DATA + path + ".json", {
            method: "POST",
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        return responseToJson = await response.json();
    } else {
        alert("passwords don't match")
    }
}
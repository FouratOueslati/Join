const BASE_URL_SIGNUP = "https://joincontacts-default-rtdb.europe-west1.firebasedatabase.app/";





async function postUser(path = "", data = {}) {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let confirmedPassword = document.getElementById('confirmedPassword');
    data = {
        name: name.value,
        email: email.value,
        password: password.value,
        confirmedPassword: confirmedPassword.value,
    };
    if (password.value === confirmedPassword.value) {
        let response = await fetch(BASE_URL_SIGNUP + path + ".json", {
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
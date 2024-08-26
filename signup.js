// // diese Funktion dient zur Registreirung neuer Users
// async function postUser(path = "users", data = {}) {
//     let name = document.getElementById('name').value;
//     let email = document.getElementById('email').value;
//     let password = document.getElementById('password');
//     let confirmedPassword = document.getElementById('confirmedPassword');
//     data = {
//         name: name,
//         email: email,
//         password: password.value,
//         urgentTasks: [],
//         mediaumTasks: [],
//         lowTasks: [],
//         contacts: [createOwnContact(Contact, name, email)],
//     };
//     document.getElementById('successfull-container').classList.remove('d-none');
//     document.getElementById('succesfull-signup').classList.add('transform');
//     setTimeout(() => {
//         window.location.href = "index.html";
//     }, 1500);
//     if (password.value === confirmedPassword.value) {
//         let response = await fetch(BASE_URL_USER_DATA + path + ".json", {
//             method: "POST",
//             header: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(data)
//         });
//         return responseToJson = await response.json();
//     } else {
//         alert("passwords don't match")
//     }
//     createOwnContact(Contact, name, email);
// }


// async function createOwnContact(Contact, name, email) {
//     let color = getRandomColor();
//     let contact = {name: name, email: email, backgroundcolor: color};
//     postContacts('/users/' + uid + '/contacts', contact)
//     await loadDataAfterChanges();
//     return Contact;
// }

async function postUser(path = "users", data = {}) {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value; // .value hinzufügen
    let confirmedPassword = document.getElementById('confirmedPassword').value; // .value hinzufügen

    if (password !== confirmedPassword) {
        alert("Passwords don't match");
        return; // Beende die Funktion hier
    }

    data = {
        name: name,
        email: email,
        password: password,
        urgentTasks: [],
        mediumTasks: [],
        lowTasks: [],
        contacts: [await createOwnContact(name, email)], // Warten auf die Erstellung des Kontakts
    };

    let response = await fetch(BASE_URL_USER_DATA + path + ".json", {
        method: "POST",
        headers: { // 'headers' statt 'header'
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        console.error("Fehler beim Erstellen des Benutzers:", response.statusText);
        return;
    }

    let responseToJson = await response.json();

    document.getElementById('successfull-container').classList.remove('d-none');
    document.getElementById('succesfull-signup').classList.add('transform');

    setTimeout(() => {
        window.location.href = "index.html";
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
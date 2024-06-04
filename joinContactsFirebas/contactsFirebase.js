const BASE_URL_CONTACTS = "https://joincontacts-default-rtdb.europe-west1.firebasedatabase.app/";





function onloadFunctionTestContacts() {
    console.log('test');
    contacts.forEach(contact => {
        postContacts("", contact).then(response => {
            console.log("Contact posted:", response);
        }).catch(error => {
            console.error("Error posting contact:", error);
        });
    });
}

async function postContacts(path = "", data = {}) {
    let responseContact = await fetch(BASE_URL_CONTACTS + path + ".json", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return await responseContact.json();
}

//onloadFunctionTestContacts();

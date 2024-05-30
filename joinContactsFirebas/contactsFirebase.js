const BASE_URL_CONTACTS = "https://joincontacts-default-rtdb.europe-west1.firebasedatabase.app/";
let contacts = [
    { name: "Davor", surname: "Jezernik", email: "davor@test.com", number: "+436646624833" },
    { name: "Fourat", surname: "Oueskati", email: "fourat@test.com", number: "+491576723116" },
    { name: "Nicole", surname: "Gerlach", email: "nicole@test.com", number: "+491576277456" },
    { name: "Max", surname: "Mustermann", email: "max@test.com", number: "+491576621366" },
    { name: "Lina", surname: "Muller", email: "lina@test.com", number: "+491572562385" },
    { name: "Lea", surname: "Fischer", email: "lea@test.com", number: "+436641115486" },
    { name: "Emilia", surname: "Weber", email: "emilia@test.com", number: "+431576541285" },
    { name: "Dominik", surname: "Ravljan", email: "dominik@test.com", number: "+436640005814" },
    { name: "Luka", surname: "Wolf", email: "luka@test.com", number: "+491575684236" },
    { name: "Patricia", surname: "Blazon", email: "patricia@test.com", number: "+436642445699" }
];


let letters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
]


let displayedLetters = [];


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

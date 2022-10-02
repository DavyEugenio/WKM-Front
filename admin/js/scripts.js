let baseUrl = "http://localhost:8080",
    homeUrl = "../",
    nomeField = document.getElementById("nomeSpan");
    admin = {};

verifyUser(homeUrl);
getUser();

getUser();
async function getUser() {
    try {
        admin = await findLoggedUser();
        nomeField.innerHTML = admin.nome;
    } catch {
    }
}

function makeRequest(method, url, onloadend, data) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, baseUrl + url, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.setRequestHeader('Authorization', JSON.parse(localStorage.localUser).token);
    if (data) {
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }
    xhr.onloadend = onloadend;
}
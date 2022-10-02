let url = new URL(window.location.href),
    baseUrl = "http://localhost:8080",
    homeUrl = "../../",
    addForm = document.getElementById("dataForm"),
    senha = addForm.elements.namedItem("senha"),
    csenha = addForm.elements.namedItem("csenha");

//verifyUser(homeUrl);

addForm.onreset = admins;

addForm.onsubmit = function (e) {
    e.preventDefault();
    const data = new FormData(e.target);
    makeRequest("POST", "/jogadores", async function () {
        let rj = JSON.parse(this.responseText);
        if (this.readyState == 4 && this.status == 201) {
            addForm.reset();
            admins();
        } else {
            errorHandler(JSON.parse(this.responseText));
        }
    }, fillDTO(data));
}

function fillDTO(data) {
    const value = Object.fromEntries(data.entries());
    console.log(value);
    value.csenha.delete
    return value;
}

function validatePassword() {
    if (senha.value != csenha.value) {
        csenha.setCustomValidity("Senhas diferentes!");
    } else {
        csenha.setCustomValidity('');
    }
    return senha.value == csenha.value;
}

senha.onchange = validatePassword;
csenha.onkeyup = validatePassword;

function admins() {
    window.location.replace("../jogadores");
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
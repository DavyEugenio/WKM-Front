let url = new URL(window.location.href),
    id = url.searchParams.get("id"),
    baseUrl = "http://localhost:8080",
    homeUrl = "../../",
    editForm = document.getElementById("dataForm"),
    admin = {};

verifyUser(homeUrl);
if (id) {
    getAdmin();
} else {
    alert("Selecione um administrador!");
    admins();
}

function getAdmin() {
    makeRequest("GET", `/admins/${id}`, async function () {
        let rj = JSON.parse(this.responseText);
        if (this.readyState == 4 && this.status == 200) {
            admin = rj;
            fillForm();
        } else {
            if(this.status == 401){
                errorHandler(rj);
                window.location.replace(homeUrl);
            }
            
        }
    });
}

function fillForm() {
    editForm.elements.namedItem("nome").value = admin.nome;
    editForm.elements.namedItem("nomeUsuario").value = admin.nomeUsuario;
    editForm.elements.namedItem("email").value = admin.email;
}

editForm.onreset = admins;

editForm.onsubmit = function (e) {
    e.preventDefault();
    const data = new FormData(e.target);
    makeRequest("PUT", `/admins/${id}`, async function () {
        if (this.readyState == 4 && this.status == 204) {
            editForm.reset();
            admins();
        } else {
            let rj = JSON.parse(this.responseText);
            errorHandler(rj);
        }
    }, fillDTO(data));
}

function fillDTO(data) {
    const value = Object.fromEntries(data.entries());
    return value;
}

function admins() {
    window.location.replace("../admins");
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
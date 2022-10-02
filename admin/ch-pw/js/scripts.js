let url = new URL(window.location.href),
    id = url.searchParams.get("id"),
    baseUrl = "http://localhost:8080",
    homeUrl = "../../",
    editForm = document.getElementById("dataForm"),
    nsenha = editForm.elements.namedItem("novaSenha"),
    csenha = editForm.elements.namedItem("csenha");

verifyUser(homeUrl);

function validatePassword() {
    if (nsenha.value != csenha.value) {
        csenha.setCustomValidity("Senhas diferentes!");
    } else {
        csenha.setCustomValidity('');
    }
    return nsenha.value == csenha.value;
}

nsenha.onchange = validatePassword;
csenha.onkeyup = validatePassword;

editForm.onreset = perfil;

editForm.onsubmit = async function (e) {
    e.preventDefault();
    const data = new FormData(e.target);
    makeRequest("PUT", `/auth/password`, async function () {
        if (this.readyState == 4 && this.status == 204) {
            editForm.reset();
            alert("Senha atualizada com êxito!");
            perfil();
        } else {
            let rj = JSON.parse(this.responseText);
            errorHandler(rj);
        }
    }, fillDTO(data));

}

function fillDTO(data) {
    const value = Object.fromEntries(data.entries());
    delete value.csenha;
    return value;
}

function perfil() {
    window.location.replace("../perfil");
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
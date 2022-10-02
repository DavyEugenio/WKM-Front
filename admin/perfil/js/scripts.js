let url = new URL(window.location.href),
    id = url.searchParams.get("id"),
    baseUrl = "http://localhost:8080",
    homeUrl = "../../",
    editForm = document.getElementById("dataForm"),
    pwField = document.getElementById("inputSenha"),
    admin = {};

verifyUser(homeUrl);

getUser();
async function getUser() {
    try {
        admin = await findLoggedUser();
        fillForm();
    } catch {
    }
}

function fillForm() {
    editForm.elements.namedItem("nome").value = admin.nome;
    editForm.elements.namedItem("nomeUsuario").value = admin.nomeUsuario;
    editForm.elements.namedItem("email").value = admin.email;
}

editForm.elements.namedItem("email").onchange = function () {
    let inputSenha = editForm.elements.namedItem("senha");
    if (verifyEmailChange() && pwField.classList.contains("d-none")) {
        pwField.classList.remove("d-none");
        inputSenha.required = true;
    } else {
        inputSenha.required = false;
        pwField.classList.add("d-none");
    }
}

function verifyEmailChange() {
    let lu = JSON.parse(localStorage.localUser),
        email = editForm.elements.namedItem("email").value;
    return lu.email != email;
}

editForm.onreset = getUser;

editForm.onsubmit = async function (e) {
    e.preventDefault();
    const data = new FormData(e.target);
    if (verifyEmailChange()) {
        try {
            await login(fillCredDTO(false));
            editUser(data);
        } catch (err) {
            if (err.status == 401) {
                alert("Senha incorreta!");
            } else {
                errorHandler(err);
            }
        }
    } else {
        editUser(data);
    }

}

function editUser(data) {
    makeRequest("PUT", `/admins/${admin.id}`, async function () {
        if (this.readyState == 4 && this.status == 204) {
            if (verifyEmailChange()) {
                try {
                    await login(fillCredDTO(true));
                    inputSenha.required = false;
                    pwField.classList.add("d-none");
                } catch (err) {
                    errorHandler(err);
                }
            }
            editForm.reset();
            alert("Usuário atualizado com êxito!")
        } else {
            let rj = JSON.parse(this.responseText);
            errorHandler(rj);
        }
    }, fillDTO(data));
}

function fillDTO(data) {
    const value = Object.fromEntries(data.entries());
    delete value.senha;
    return value;
}

function fillCredDTO(edited) {
    let cred = {};
    if (!edited) {
        cred["email"] = admin.email;
    } else {
        cred["email"] = editForm.elements.namedItem("email").value;
    }
    cred["senha"] = editForm.elements.namedItem("senha").value;
    return cred;
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
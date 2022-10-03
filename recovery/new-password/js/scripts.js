let url = new URL(window.location.href),
    rpt = url.searchParams.get("rpt"),
    email = url.searchParams.get("email"),
    baseUrl = "http://localhost:8080",
    homeUrl = "../../",
    editForm = document.getElementById("dataForm"),
    nsenha = editForm.elements.namedItem("novaSenha"),
    csenha = editForm.elements.namedItem("csenha");

    if (!(rpt)) {
        alert("Token não localizado");
        location.replace("../../");
    }

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
    let dto = fillDTO(data);
    makeRequest("PUT", `/auth/recoverPassword${rpt}`, async function () {
        if (this.readyState == 4 && this.status == 204) {
            alert("Sucesso\nSenha alterada com êxito!");
            if (email) {
                dto.email = email;
                if (await login(dto)) {
                    perfil();
                } else {
                    index();
                }
            } else {
                index();
            }

        } else {
            if (this.readyState == 4 && this.status == 401) {
                let errorMsg = "";
                let rj = JSON.parse(this.responseText);
                errorMsg = errorMsg + rj['error'] + ": \n" + errorMsg + rj['message'] + "\n\nSolicite outro link de recuperação";
                alert(errorMsg);
                index();
            } else {
                let rj = JSON.parse(this.responseText);
                errorHandler(rj);
            }
        }
    }, dto);

}

function fillDTO(data) {
    const value = Object.fromEntries(data.entries());
    delete value.csenha;
    return value;
}

function index() {
    window.location.replace(homeUrl);
}

function perfil() {
    window.location.replace("../perfil");
}

function makeRequest(method, url, onloadend, data) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, baseUrl + url, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    if (data) {
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }
    xhr.onloadend = onloadend;
}
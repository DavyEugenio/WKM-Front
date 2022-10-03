let baseUrl = "http://localhost:8080",
    homeUrl = "../../",
    editForm = document.getElementById("dataForm");

editForm.onreset = login;

editForm.onsubmit = async function (e) {
    e.preventDefault();
    const data = new FormData(e.target);
    makeRequest("POST", `/auth/forgot`, async function () {
        if (this.readyState == 4 && this.status == 204) {
            alert("Um link foi enviado ao e-mail informado\npara que se possa redefinir a senha");
            editForm.reset();
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

function login() {
    window.location.replace("../");
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
let url = new URL(window.location.href),
    baseUrl = "http://localhost:8080",
    homeUrl = "../../",
    addForm = document.getElementById("dataForm");

verifyUser(homeUrl);

addForm.onreset = categorias;

addForm.onsubmit = function (e) {
    e.preventDefault();
    const data = new FormData(e.target);
    makeRequest("POST", "/categorias", async function () {
        let rj = JSON.parse(this.responseText);
        if (this.readyState == 4 && this.status == 201) {
            addForm.reset();
            admins();
        } else {
            errorHandler(rj);
        }
    }, fillDTO(data));
}

function fillDTO(data) {
    const value = Object.fromEntries(data.entries());
    return value;
}

function categorias() {
    window.location.replace("../categorias");
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
let url = new URL(window.location.href),
    id = url.searchParams.get("id"),
    baseUrl = "http://localhost:8080",
    homeUrl = "../../",
    editForm = document.getElementById("dataForm"),
    categoria = {};

verifyUser(homeUrl);
if (id) {
    getCategoria();
} else {
    alert("Selecione uma categoria!");
    questoes();
}

function getCategoria() {
    makeRequest("GET", `/categorias/${id}`, async function () {
        let rj = JSON.parse(this.responseText);
        if (this.readyState == 4 && this.status == 200) {
            categoria = rj;
            fillForm();
        } else {
            errorHandler(rj);
        }
    });
}

function fillForm() {
    for(let prop in categoria){
        if(editForm.elements.namedItem(prop)){
            editForm.elements.namedItem(prop).value = categoria[prop];
        }
    }
}

editForm.onreset = categorias;

editForm.onsubmit = function (e) {
    e.preventDefault();
    const data = new FormData(e.target);
    makeRequest("PUT", `/categorias/${categoria.id}`, async function () {
        if (this.readyState == 4 && this.status == 204) {
            editForm.reset();
            categorias();
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
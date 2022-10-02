let url = new URL(window.location.href),
    baseUrl = "http://localhost:8080",
    homeUrl = "../../",
    addForm = document.getElementById("dataForm"),
    categorias = [];

//verifyUser(homeUrl);

getCategorias();

function getCategorias() {
    makeRequest("GET", "/categorias", async function () {
        let rj = JSON.parse(this.responseText);
        if (this.readyState == 4 && this.status == 200) {
            categorias = rj;
            fillSelectCategorias();
        } else {
            errorHandler(JSON.parse(this.responseText));
        }
    });
}

function fillSelectCategorias() {
    let select = addForm.elements.namedItem("categoriaId");
    select.innerHTML = "";
    for (cat of categorias) {
        let option = document.createElement("OPTION");
        option.id = "optCat" + cat.id;
        option.value = cat.id;
        option.text = cat.nome;
        select.appendChild(option);
    }
}

addForm.onreset = questoes;

addForm.onsubmit = function (e) {
    e.preventDefault();
    const data = new FormData(e.target);
    makeRequest("POST", "/questoes", async function () {
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
    value.alternativas = [];
    for(let i = 1; i<=4;i++){
        let alt = {};
        alt.texto = value["alt" + i];
        alt.correta = value.correta == "alt" + i;
        value.alternativas.push(alt);
        delete value["alt" + i];
    }
    delete value.correta;
    return value;
}

function questoes() {
    window.location.replace("../questoes");
}

function makeRequest(method, url, onloadend, data) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, baseUrl + url, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    //xhr.setRequestHeader('Authorization', JSON.parse(localStorage.localUser).token);
    if (data) {
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }
    xhr.onloadend = onloadend;
}
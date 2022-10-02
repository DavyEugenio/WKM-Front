let url = new URL(window.location.href),
    id = url.searchParams.get("id"),
    baseUrl = "http://localhost:8080",
    homeUrl = "../../",
    editForm = document.getElementById("dataForm"),
    questao = {};

verifyUser(homeUrl);
if (id) {
    getCategorias();
} else {
    alert("Selecione uma questao!");
    questoes();
}

function getCategorias() {
    makeRequest("GET", "/categorias", async function () {
        let rj = JSON.parse(this.responseText);
        if (this.readyState == 4 && this.status == 200) {
            categorias = rj;
            fillSelectCategorias();
            getQuestao();
        } else {
            errorHandler(JSON.parse(this.responseText));
        }
    });
}

function fillSelectCategorias() {
    let select = editForm.elements.namedItem("categoriaId");
    select.innerHTML = "";
    for (cat of categorias) {
        let option = document.createElement("OPTION");
        option.id = "optCat" + cat.id;
        option.value = cat.id;
        option.text = cat.nome;
        select.appendChild(option);
    }
}

function getQuestao() {
    makeRequest("GET", `/questoes/${id}`, async function () {
        let rj = JSON.parse(this.responseText);
        if (this.readyState == 4 && this.status == 200) {
            questao = rj;
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
    for(let prop in questao){
        if(editForm.elements.namedItem(prop)){
            editForm.elements.namedItem(prop).value = questao[prop];
        } else if(prop == "alternativas") {
            let i = 1;
            for(let alt of questao[prop]) {
                editForm.elements.namedItem("alt"+i).value = alt.texto;
                if(alt.correta) {
                    editForm.elements.namedItem("correta").value = "alt"+i;
                }
                i++;
            }
        }
    }
}

editForm.onreset = questoes;

editForm.onsubmit = function (e) {
    e.preventDefault();
    const data = new FormData(e.target);
    makeRequest("PUT", `/questoes/${questao.id}`, async function () {
        if (this.readyState == 4 && this.status == 204) {
            editForm.reset();
            questoes();
        } else {
            let rj = JSON.parse(this.responseText);
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
    xhr.setRequestHeader('Authorization', JSON.parse(localStorage.localUser).token);
    if (data) {
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }
    xhr.onloadend = onloadend;
}
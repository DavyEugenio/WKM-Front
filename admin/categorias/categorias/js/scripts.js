let url = new URL(window.location.href),
    baseUrl = "http://localhost:8080",
    homeUrl = "../../",
    tableBody = document.getElementById("tableBody"),
    categorias = [];

verifyUser(homeUrl);
getCategorias();
function index() {
    window.location.replace("../");
}

function getCategorias() {
    makeRequest("GET", "/categorias", function () {
        if (this.readyState == 4 && this.status == 200) {
            categorias = JSON.parse(this.responseText);
            fillTableRows();
        } else {
            let rj = JSON.parse(this.responseText);
            errorHandler(rj);
        }
    });
}

async function findCategoria(id) {
    let categoria;
    return new Promise((resolve, reject) => {
        makeRequest("GET", `/categorias/${id}`, async function () {
            let rj = JSON.parse(this.responseText);
            if (this.readyState == 4 && this.status == 200) {
                categoria = rj;
                resolve(categoria);
            } else {
                errorHandler(rj);
                reject(false);
            }
        });
    });
}

async function fillTableRows() {
    let rowModel = tableBody.children[0];
    console.log(rowModel);
    for (let categoria of categorias) {
        let newRow = rowModel.cloneNode(true);
        newRow.id = "categoria" + categoria.id;
        newRow.children[0].innerHTML = categoria.id;
        newRow.children[1].innerHTML = categoria.nome;
        newRow.children[2].children[0].href = `../edit-categoria/?id=${categoria.id}`;
        newRow.children[2].children[1].onclick = () => { deleteQuestao(categoria) };
        newRow.classList.remove("d-none");
        tableBody.append(newRow);
    }
}

function deleteQuestao(categoria) {
    if (confirm(`Está certo em apagar a categoria ${categoria.texto} - ${categoria.id} ?`)) {
        makeRequest("DELETE", "/categorias/" + categoria.id, function () {
            if (this.readyState == 4 && this.status == 204) {
                alert("Categoria apagada com sucesso!");
                document.getElementById("categoria" + categoria.id).remove();
            } else {
                let rj = JSON.parse(this.responseText);
                errorHandler(rj);
            }
        });
    }
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
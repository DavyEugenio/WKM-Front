let url = new URL(window.location.href),
    baseUrl = "http://localhost:8080",
    homeUrl = "../../",
    tableBody = document.getElementById("tableBody");
questoes = [];

//verifyUser(homeUrl);
getQuestoes();
function index() {
    window.location.replace("../");
}

function getQuestoes() {
    makeRequest("GET", "/questoes", function () {
        if (this.readyState == 4 && this.status == 200) {
            questoes = JSON.parse(this.responseText);
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
    for (let questao of questoes) {
        let newRow = rowModel.cloneNode(true);
        newRow.id = "questao" + questao.id;
        newRow.children[0].innerHTML = questao.id;
        newRow.children[1].innerHTML = questao.texto;
        newRow.children[2].innerHTML = questao.nivel;
        let categoria = await findCategoria(questao.categoriaId);
        newRow.children[3].innerHTML = categoria.nome;
        newRow.children[4].children[0].href = `../edit-questao/?id=${questao.id}`;
        newRow.children[4].children[1].onclick = () => { deleteQuestao(questao) };
        newRow.classList.remove("d-none");
        tableBody.append(newRow);
    }
}

function deleteQuestao(questao) {
    if (confirm(`Está certo em apagar a questão ${questao.texto} - ${questao.id} ?`)) {
        makeRequest("DELETE", "/questoes/" + questao.id, function () {
            if (this.readyState == 4 && this.status == 204) {
                alert("Questão apagada com sucesso!");
                document.getElementById("questao" + questao.id).remove();
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
    //xhr.setRequestHeader('Authorization', JSON.parse(localStorage.localUser).token);
    if (data) {
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }
    xhr.onloadend = onloadend;
}
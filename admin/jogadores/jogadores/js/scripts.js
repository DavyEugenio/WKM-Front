let url = new URL(window.location.href),
    baseUrl = "http://localhost:8080",
    homeUrl = "../../",
    tableBody = document.getElementById("tableBody");
    jogadores = [];

verifyUser(homeUrl);
getJogadores();
function index() {
    window.location.replace("../");
}

function getJogadores() {
    makeRequest("GET", "/jogadores", function () {
        if (this.readyState == 4 && this.status == 200) {
            jogadores = JSON.parse(this.responseText);
            console.log(jogadores);
            fillTableRows();
        } else {
            let rj = JSON.parse(this.responseText);
            errorHandler(rj);
        }
    });
}

function fillTableRows(){
    let rowModel = tableBody.children[0];
    console.log(rowModel);
    for(let jogador of jogadores){
        let newRow = rowModel.cloneNode(true);
        console.log(newRow);
        newRow.id = "jogador"+jogador.id;
        newRow.children[0].innerHTML = jogador.id;
        newRow.children[1].innerHTML = jogador.nome;
        newRow.children[2].innerHTML = jogador.nomeUsuario;
        newRow.children[3].innerHTML = jogador.email;
        newRow.children[4].children[0].href = `../edit-jogador/?id=${jogador.id}`;
        newRow.children[4].children[1].onclick = () =>{deleteJogador(jogador)} ;
        newRow.classList.remove("d-none");
        tableBody.append(newRow);
    }
}

function deleteJogador(jogador) {
    if (confirm(`Está certo em apagar o jogador. ${jogador.nome} - ${jogador.id} ?`)) {
        makeRequest("DELETE", "/jogadores/" + jogador.id, function () {
            if (this.readyState == 4 && this.status == 204) {
                alert("Jogador apagado com sucesso!");
                document.getElementById("jogador"+jogador.id).remove();
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
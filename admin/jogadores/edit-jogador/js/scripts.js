let url = new URL(window.location.href),
    id = url.searchParams.get("id"),
    baseUrl = "http://localhost:8080",
    homeUrl = "../../",
    editForm = document.getElementById("dataForm"),
    jogador = {};

//verifyUser(homeUrl);
if (id) {
    getJogador();
} else {
    alert("Selecione um jogador!");
    jogadores();
}

function getJogador() {
    makeRequest("GET", `/jogadores/${id}`, async function () {
        let rj = JSON.parse(this.responseText);
        if (this.readyState == 4 && this.status == 200) {
            jogador = rj;
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
    for(let prop in jogador){
        if(editForm.elements.namedItem(prop)){
            editForm.elements.namedItem(prop).value = jogador[prop];
        }
    }
}

editForm.onreset = jogadores;

editForm.onsubmit = function (e) {
    e.preventDefault();
    const data = new FormData(e.target);
    makeRequest("PUT", `/jogadores/${jogador.id}`, async function () {
        if (this.readyState == 4 && this.status == 204) {
            editForm.reset();
            jogadores();
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

function jogadores() {
    window.location.replace("../jogadores");
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
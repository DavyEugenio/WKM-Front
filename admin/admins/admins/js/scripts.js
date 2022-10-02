let url = new URL(window.location.href),
    baseUrl = "http://localhost:8080",
    homeUrl = "../../",
    tableBody = document.getElementById("tableBody");
    admins = [], 
    admin = {};

verifyUser(homeUrl);
getUser();
async function getUser() {
    try {
        admin = await findLoggedUser();
        fillForm();
    } catch {
        login();
    }
}

getAdmins();
function index() {
    window.location.replace("../");
}

function getAdmins() {
    makeRequest("GET", "/admins", function () {
        if (this.readyState == 4 && this.status == 200) {
            admins = JSON.parse(this.responseText);
            console.log(admins);
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
    for(let admin of admins){
        let newRow = rowModel.cloneNode(true);
        console.log(newRow);
        newRow.id = "admin"+admin.id;
        newRow.children[0].innerHTML = admin.id;
        newRow.children[1].innerHTML = admin.nome;
        newRow.children[2].innerHTML = admin.nomeUsuario;
        newRow.children[3].innerHTML = admin.email;
        newRow.children[4].children[0].href = `../edit-admin/?id=${admin.id}`;
        newRow.children[4].children[1].onclick = () =>{deleteAdmin(admin)} ;
        newRow.classList.remove("d-none");
        tableBody.append(newRow);
    }
}

function deleteAdmin(admin) {
    if (confirm(`Está certo em apagar o admin. ${admin.nome} - ${admin.id} ?`)) {
        makeRequest("DELETE", "/admins/" + admin.id, function () {
            if (this.readyState == 4 && this.status == 204) {
                alert("Administrador apagado com sucesso!");
                document.getElementById("admin"+admin.id).remove();
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
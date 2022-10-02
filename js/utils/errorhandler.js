function errorHandler(errorObj) {
    switch (errorObj.status) {
        case 401:
            this.handle401();
            break;
        case 403:
            this.handle403();
            break;
        case 422:
            this.handle422(errorObj);
            break;

        case 500:
            this.handle500(errorObj);
            break;

        default:
            this.handleDefaultError(errorObj);
            break;
    }
}

function handle403() {
    localStorage.setItem('localUser', null);
}

function handle401() {
    alert("Erro 401: Falha de autenticação\n Credenciais incorretas");
}

function handle422(errorObj) {
    let s = 'Erro 422: Validação';
    for (msg of errorObj.errors) {
        switch(msg.fieldName) {
            case "novaSenha" :
                msg.fieldName = "Nova Senha"
                break;
                case "senha" :
                    msg.fieldName = "Senha"
                    break;
        } 
        s += '\n' + msg.fieldName + ': ' + msg.message;
    }
    alert(s);
}

function handle500(errorObj) {
    let s = 'Erro 500: Erro interno \n' + errorObj.error + ': \n' + errorObj.message;
    alert(s);
}

function handleDefaultError(errorObj) {
    alert("Erro " + errorObj.status + ":\n" + errorObj.error);
}
async function verifyUser(homeUrl) {
    try {
        await refreshToken();
    } catch (error) {
        logout(homeUrl);
    }
}

function login(data) {
    return new Promise((resolve, reject) => {
        makeRequests("POST", "/login", async function() {
            if (this.readyState == 4 && this.status == 200) {
                let localUser = {};
                localUser.email = data.email;
                localUser.token = this.getResponseHeader("Authorization");
                localStorage.setItem('localUser', JSON.stringify(localUser));
                try {
                    await findLoggedUser();
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            } else {
                let rj = JSON.parse(this.responseText);
                reject(rj);
            }
        }, data);
    });
}

function refreshToken() {
    return new Promise((resolve, reject) => {
        if (localStorage.localUser) {
            let us = JSON.parse(localStorage.localUser);
            if (us && us.email) {
                makeRequests("POST", "/auth/refreshToken", function() {
                    if (this.readyState == 4 && this.status == 204) {
                        let localUser = JSON.parse(localStorage.localUser);
                        localUser.token = this.getResponseHeader("Authorization");
                        localStorage.setItem('localUser', JSON.stringify(localUser));
                        resolve(true);
                    } else {
                        reject(false);
                    }
                });
            } else {
                localStorage.setItem('localUser', null);
                reject(false);
            }
        } else {
            localStorage.setItem('localUser', null);
            reject(false);
        }
    });
}

function findLoggedUser() {
    return new Promise((resolve, reject) => {
        makeRequests("GET", "/admins/email?value=" + JSON.parse(localStorage.localUser).email, function() {
            let resp = JSON.parse(this.responseText);
            if (this.readyState == 4 && this.status == 200) {
                resolve(resp);
            } else {
                reject(resp);
            }
        });
    });
}

function makeRequests(method, url, onloadend, data) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, "http://localhost:8080" + url, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    if (data) {
        xhr.send(JSON.stringify(data));
    } else {
        let lu = JSON.parse(localStorage.localUser);
        xhr.setRequestHeader('Authorization', lu.token);
        xhr.send();
    }
    xhr.onloadend = onloadend;
}

function logout(homeUrl) {
    localStorage.setItem('localUser', null);
    window.location.replace(homeUrl);
}
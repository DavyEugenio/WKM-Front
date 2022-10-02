let form = document.getElementById("dataForm");

async function verifyIsLogged() {
    try {
        await refreshToken();
        window.location.replace("admin");
    } catch {
    }
}

form.onsubmit = async function (e) {
    e.preventDefault();
    const data = new FormData(e.target);
    try {
        await login(fillDTO(data));
        form.reset();
        window.location.replace("admin");
    } catch (error) {
        errorHandler(error);
        logout("");
    }
}

function fillDTO(data) {
    const value = Object.fromEntries(data.entries());
    return value;
}
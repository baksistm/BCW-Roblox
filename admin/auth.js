async function login() {
const user = document.getElementById('user').value;
const pass = document.getElementById('pass').value;
const data = await getUsers();


const found = data.find(u => u['Usuário'] === user && u['Senha'] === pass);


if (!found) {
document.getElementById('alert').style.display = 'block';
return;
}


sessionStorage.setItem('auth', 'true');
sessionStorage.setItem('nome', found['Nome Social']);

sessionStorage.setItem('username', username); // 'username' é a variável do campo de input do usuário
window.location.href = 'loading.html';
}


function protect() {
if (sessionStorage.getItem('auth') !== 'true') {
alert('⚠️ Você deve realizar o login');
window.location.href = 'login.html';
}
}

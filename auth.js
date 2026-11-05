document.addEventListener('DOMContentLoaded', () => {
    inicializarBaseDatos();
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
});

function inicializarBaseDatos() {
    if (!localStorage.getItem('copaci_usuarios')) {
        const usuariosIniciales = [
            { id: 'USR-001', nombre: 'Administrador Principal', correo: 'admin@copaci.mx', direccion: 'Oficina COPACI', password: 'admin', rol: 'admin' },
            { id: 'USR-002', nombre: 'Carlos Mendoza', correo: 'vecino@copaci.mx', direccion: 'Calle Jacarandas #12', password: 'admin', rol: 'vecino' }
        ];
        localStorage.setItem('copaci_usuarios', JSON.stringify(usuariosIniciales));
    }
    if (!localStorage.getItem('copaci_tramites')) localStorage.setItem('copaci_tramites', JSON.stringify([]));
    if (!localStorage.getItem('copaci_reportes')) localStorage.setItem('copaci_reportes', JSON.stringify([]));
}

function validarEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

function mostrarAlerta(mensaje, tipo = 'error') {
    const alertBox = document.getElementById('authAlert');
    if (!alertBox) return;
    alertBox.textContent = mensaje;
    alertBox.className = `alert alert-${tipo}`;
    alertBox.classList.remove('hidden');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!validarEmail(email)) return mostrarAlerta('Correo inválido.');

    const usuarios = JSON.parse(localStorage.getItem('copaci_usuarios')) || [];
    const user = usuarios.find(u => u.correo.toLowerCase() === email.toLowerCase() && u.password === password);

    if (user) {
        sessionStorage.setItem('copaci_sesion', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        mostrarAlerta('Credenciales incorrectas.');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const nombre = document.getElementById('regName').value.trim();
    const correo = document.getElementById('regEmail').value.trim();
    const direccion = document.getElementById('regAddress').value.trim();
    const password = document.getElementById('regPassword').value;

    if (!validarEmail(correo)) return mostrarAlerta('Correo inválido.');
    if (password.length < 6) return mostrarAlerta('La contraseña debe tener mínimo 6 caracteres.');

    const usuarios = JSON.parse(localStorage.getItem('copaci_usuarios')) || [];
    if (usuarios.some(u => u.correo.toLowerCase() === correo.toLowerCase())) return mostrarAlerta('El correo ya existe.');

    const nuevoUsuario = { id: `USR-${Date.now().toString().slice(-4)}`, nombre, correo, direccion, password, rol: 'vecino' };
    usuarios.push(nuevoUsuario);
    localStorage.setItem('copaci_usuarios', JSON.stringify(usuarios));

    mostrarAlerta('Cuenta creada. Iniciando...', 'success');
    setTimeout(() => {
        sessionStorage.setItem('copaci_sesion', JSON.stringify(nuevoUsuario));
        window.location.href = 'dashboard.html';
    }, 1000);
}

function checkSession() {
    const raw = sessionStorage.getItem('copaci_sesion');
    return raw ? JSON.parse(raw) : null;
}

function logout() {
    sessionStorage.removeItem('copaci_sesion');
    window.location.href = 'index.html';
}
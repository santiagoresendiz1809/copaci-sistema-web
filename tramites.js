document.addEventListener('DOMContentLoaded', () => {
    const constanciaForm = document.getElementById('constanciaForm');
    if (constanciaForm) constanciaForm.addEventListener('submit', generarConstancia);
});

function generarConstancia(e) {
    e.preventDefault();
    const sesion = checkSession();
    if (!sesion) return alert('Debes iniciar sesión.');

    const curp = document.getElementById('tramiteCurp').value.trim().toUpperCase();
    if (curp.length !== 18) return alert('El CURP debe tener 18 caracteres.');

    const nuevoTramite = {
        folio: `CR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        usuarioId: sesion.id,
        nombre: document.getElementById('tramiteNombre').value.trim(),
        direccion: sesion.direccion,
        curp: curp,
        tiempoResidencia: document.getElementById('tramiteTiempo').value,
        motivo: document.getElementById('tramiteMotivo').value.trim(),
        fechaSolicitud: new Date().toLocaleDateString('es-MX'),
        estatus: 'Pendiente'
    };

    const tramites = JSON.parse(localStorage.getItem('copaci_tramites')) || [];
    tramites.push(nuevoTramite);
    localStorage.setItem('copaci_tramites', JSON.stringify(tramites));

    desplegarAcuse(nuevoTramite);
}

function desplegarAcuse(tramite) {
    const container = document.getElementById('comprobanteContainer');
    document.getElementById('comprobanteBody').innerHTML = `
        <div class="receipt-box">
            <div class="receipt-header">
                <h3>CONSEJO DE PARTICIPACIÓN CIUDADANA</h3>
                <h4>Acuse de Solicitud de Constancia de Residencia</h4>
            </div>
            <div class="receipt-row"><strong>Folio:</strong> <span>${tramite.folio}</span></div>
            <div class="receipt-row"><strong>Fecha:</strong> <span>${tramite.fechaSolicitud}</span></div>
            <div class="receipt-row"><strong>Solicitante:</strong> <span>${tramite.nombre}</span></div>
            <div class="receipt-row"><strong>CURP:</strong> <span>${tramite.curp}</span></div>
            <div class="receipt-row"><strong>Domicilio:</strong> <span>${tramite.direccion}</span></div>
            <div class="receipt-row"><strong>Estatus:</strong> <span class="status-badge status-Pendiente">${tramite.estatus}</span></div>
        </div>
    `;
    container.classList.remove('hidden');
}
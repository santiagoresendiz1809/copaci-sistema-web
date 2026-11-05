document.addEventListener('DOMContentLoaded', () => {
    const lumForm = document.getElementById('luminariaForm');
    const bachForm = document.getElementById('bacheoForm');

    if (lumForm) lumForm.addEventListener('submit', (e) => handleReporte(e, 'Luminaria'));
    if (bachForm) bachForm.addEventListener('submit', (e) => handleReporte(e, 'Bacheo'));
});

function handleReporte(e, categoria) {
    e.preventDefault();
    const sesion = checkSession();
    if (!sesion) return;

    let detalle = '';
    let ubicacion = '';

    if (categoria === 'Luminaria') {
        ubicacion = document.getElementById('lumUbicacion').value.trim();
        detalle = `Falla: ${document.getElementById('lumProblema').value} | Poste: ${document.getElementById('lumPoste').value.trim() || 'N/A'}`;
    } else {
        ubicacion = document.getElementById('bachUbicacion').value.trim();
        detalle = `Dimensión: ${document.getElementById('bachDimension').value} | Ref: ${document.getElementById('bachReferencia').value.trim() || 'N/A'}`;
    }

    const nuevoReporte = {
        folio: `${categoria === 'Luminaria' ? 'LUM' : 'BAC'}-${Date.now().toString().slice(-5)}`,
        categoria,
        usuarioId: sesion.id,
        ciudadano: sesion.nombre,
        ubicacion,
        detalle,
        fechaReporte: new Date().toLocaleDateString('es-MX'),
        estatus: 'Pendiente'
    };

    const reportes = JSON.parse(localStorage.getItem('copaci_reportes')) || [];
    reportes.push(nuevoReporte);
    localStorage.setItem('copaci_reportes', JSON.stringify(reportes));

    alert(`Reporte de ${categoria} enviado con éxito. Folio: ${nuevoReporte.folio}`);
    e.target.reset();
}
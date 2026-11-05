function inicializarAdmin() {
    renderizarTablasAdmin();
    actualizarMetricas();
}

function renderizarTablasAdmin() {
    const tramites = JSON.parse(localStorage.getItem('copaci_tramites')) || [];
    const reportes = JSON.parse(localStorage.getItem('copaci_reportes')) || [];

    const tBody = document.querySelector('#tablaTramitesAdmin tbody');
    const rBody = document.querySelector('#tablaReportesAdmin tbody');

    tBody.innerHTML = tramites.map(t => `
        <tr>
            <td><strong>${t.folio}</strong></td>
            <td>${t.fechaSolicitud}</td>
            <td>${t.nombre}</td>
            <td><code>${t.curp}</code></td>
            <td>${t.tiempoResidencia}</td>
            <td><span class="status-badge status-${t.estatus.replace(/\s+/g, '')}">${t.estatus}</span></td>
            <td>
                <select onchange="cambiarEstatus('tramites', '${t.folio}', this.value)">
                    <option value="">Cambiar...</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Atendido">Aprobar</option>
                    <option value="Rechazado">Rechazar</option>
                </select>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="7">No hay trámites.</td></tr>';

    rBody.innerHTML = reportes.map(r => `
        <tr>
            <td><strong>${r.folio}</strong></td>
            <td><span class="badge ${r.categoria === 'Luminaria' ? 'badge-vecino' : 'badge-admin'}">${r.categoria}</span></td>
            <td>${r.ubicacion}</td>
            <td>${r.detalle}</td>
            <td>${r.ciudadano}</td>
            <td><span class="status-badge status-${r.estatus.replace(/\s+/g, '')}">${r.estatus}</span></td>
            <td>
                <select onchange="cambiarEstatus('reportes', '${r.folio}', this.value)">
                    <option value="">Cambiar...</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Atendido">Atendido</option>
                </select>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="7">No hay reportes.</td></tr>';
}

function cambiarEstatus(tipo, folio, nuevoEstatus) {
    if (!nuevoEstatus) return;
    const key = tipo === 'tramites' ? 'copaci_tramites' : 'copaci_reportes';
    let data = JSON.parse(localStorage.getItem(key)) || [];
    const item = data.find(x => x.folio === folio);
    if (item) {
        item.estatus = nuevoEstatus;
        localStorage.setItem(key, JSON.stringify(data));
        renderizarTablasAdmin();
        actualizarMetricas();
    }
}

function actualizarMetricas() {
    const tramites = JSON.parse(localStorage.getItem('copaci_tramites')) || [];
    const reportes = JSON.parse(localStorage.getItem('copaci_reportes')) || [];

    document.getElementById('metricTramites').textContent = tramites.length;
    document.getElementById('metricLuminarias').textContent = reportes.filter(r => r.categoria === 'Luminaria').length;
    document.getElementById('metricBacheo').textContent = reportes.filter(r => r.categoria === 'Bacheo').length;
}
export const formateFecha = (fecha) => {
    let nuevaFecha = new Date(fecha);
    return nuevaFecha.toLocaleString('es-ES',{
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });
}
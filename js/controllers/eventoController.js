import{obtenerEventos, insertarEvento, modificarEvento, borrarEvento} from "../service/eventoService.js";
import{borrarCliente, obtenerClientes} from "../service/clienteService.js"

const el = {
    form : document.getElementById("formEventos"),
    nombre : document.getElementById("txtNombreEvento"),
    fecha : document.getElementById("txtFechaEvento"),
    personas : document.getElementById("txtCantidadPersonas"),
    horas : document.getElementById("txtCantidadHoras"),
    estados : document.getElementById("txtEstado"),
    tabla : document.getElementById("tablaClientes"),
    alertas : document.getElementById("alertContainer"),
    titulo : document.getElementById("tituloForm"),
    cancelar : document.getElementById("btnCancelar")
};

const estado = {editandoId:null, eventos:[], clientes:[]};

const avisar = (html, tipo = "success") => {
    el.alertas.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${html}
        <button type="button" class="btn-close" data-bs-dismiss = "alert"></button>
    </div>`;
};

const procesarRespuesta = ({status, body}) => {
    const exito = status >= 200 && status < 300;
    avisar(`<strong>[${status}]</strong> ${body.message}`, exito ? "success" : "danger");
    return exito;
};

const validarFormulario = () => {
    const nombre = el.nombre.value.trim();
    const fecha = el.value.trim();
    const personas = el.value.trim();
    const horas = el.value.trim();
    const estado = el.value.trim();

    const reglas = [
        {valido:nombre.length <= 1 && nombre.length <= 100, mensaje: "El nombre debe tener entre 1 y 100 caracteres."},
        {valido:fecha.length <= 1 && apellido.length <= 100, mensaje: "El apellido debe tener entre 1 y 100 caracteres."},
        {valido:personas.length <= 1 && telefono.length <= 15, mensaje: "El teléfono debe tener entre 1 y 15 caracteres"},
        {valido:horas.length <= 1 && email.length <= 100, mensaje: "El email debe tener entre 1 y 100 caracteres."},
        {valido:estado.length <= 1 && direccion.length <= 200, mensaje: "La direccion debe tener entre 3 y 200 caracteres."}
    ];
    return reglas.filter(r => !r.valido).map (r => r.mensaje);
};

const pintarCategorias = () => {
    const opciones = estado.cliente.map(c => new option (c.cli_nombre, c.id_cliente));
    el.cliente.replaceChildren(new option ("--Seleccione--",""), ...opciones);
};

const crearFila = (e) =>{
    const evento = estado.eventos.find(c => c.id_cliente === e.eve_cliente);
    const fila = document.createElement("tr");

    fila.innerHTML = `
    <td>${e.id_evento}</td>
    <td>${e.nombre_evento}</td>
    <td>${e.fecha_evento}</td>
    <td>${e.cantidad_personas}</td>
    <td>${e.cantidad_horas}</td>
    <td>${e.estado}</td>
    <td>${e.total_pago}</td>
    <td class ="text-end">
        <button class ="btn btn-sm btn-warning btn-editar">Editar</button>
        <button class ="btn btn-sm btn-danger btn-eliminar">Eliminar</button>
    </td>`;

fila.querySelector(".btn-editar").addEventListener("click", () => prepararEdicion(e));
fila.querySelector(".btn-eliminar").addEventListener("click", () => eliminarEvento(e.id_evento));
return fila;
};

const pintarTabla=() =>{
    el.tabla.replaceChildren(...estado.productos.map(crearFila));
};

const cargarCliente = async() =>{
    const {status, body} = await obtenerClientes();
    if(status !== 200) return avisar(`[${status}]${body.message}`, "danger");
    estado.clientes = body.data;
    pintarClientes();
};

const cargarEventos = async () =>{
    const{status, body} = await obtenerEventos();
    if (status !== 200) return avisar (`[${status}]${body.message}`, "danger");
    pintarTabla();
};

const leerFormulario = () => ({
    nombre_evento:el.nombre.value.trim(),
    fecha_evento:el.fecha.value.trim(),
    cantidad_personas:el.personas.value.trim(),
    cantidad_horas:el.horas.value.trim(),
    estado:el.estados.value.trim()
});

const guardarEvento = async(action) =>{
    action.preventDefault();
    const errores = validarFormulario();
    if(errores.length) return avisar (errores.join("<br>"), "warning");
    const dto = leerFormulario();
    const modoEditar = estado.editandoId !== null;
    try {
        const resultado = modoEditar
        ? await modificarCliente(estado.editandoId, dto)
        : await insertarCliente(dto);
        if (procesarRespuesta(resultado)){
            reiniciarFormulario();
            await cargarEventos();
        }
    } catch (error) {
        avisar("No se puede conectar con la API", "danger");
    }
};

const prepararEdicion = (e) => {
    el.nombre.value = e.nombre_evento;
    el.fecha.value = e.fecha_evento;
    el.personas.value = e.cantidad_personas;
    el.horas.value = e.cantidad_horas;
    el.estados.value = e.estado;
};

const eliminarEvento = async (id) =>{
    if (!confirm("Seguro que desea eliminar el registro?")) return;

    try {
        const resultado = await borrarEvento(id);
        if (procesarRespuesta(resultado)) await cargarEventos();
    } catch (error) {
        avisar("No se puede conectar con la API", "danger");
    }
};

const reiniciarFormulario = () => {
    el.form.reset();
    estado.editandoId = null;
    el.titulo.textContent = "Registrar producto";
};

el.form.addEventListener("submit", guardarEvento);
el.cancelar.addEventListener("click", reiniciarFormulario);

document.addEventListener("DOMContentLoaded", async() =>{
    try {
        await cargarCliente;
        await cargarEventos;
    } catch (error) {
        avisar("No se pudo conectar con la API", "danger")
    }
});
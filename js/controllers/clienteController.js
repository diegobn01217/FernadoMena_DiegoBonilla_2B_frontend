import{obtenerClientes, insertarCliente, modificarCliente, borrarCliente} from "../service/clienteService.js";
import{obtenerEventos} from "../service/eventoService.js"

const el = {
    form : document.getElementById("formClientes"),
    nombre : document.getElementById("txtNombre"),
    apellido : document.getElementById("txtApellido"),
    telefono : document.getElementById("txtTelefono"),
    email : document.getElementById("txtEmail"),
    direccion : document.getElementById("txtDireccion"),
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
    const apellido = el.value.trim();
    const telefono = el.value.trim();
    const email = el.value.trim();
    const direccion = el.value.trim();

    const reglas = [
        {valido:nombre.length <= 1 && nombre.length <= 100, mensaje: "El nombre debe tener entre 1 y 100 caracteres."},
        {valido:apellido.length <= 1 && apellido.length <= 100, mensaje: "El apellido debe tener entre 1 y 100 caracteres."},
        {valido:telefono.length <= 1 && telefono.length <= 15, mensaje: "El teléfono debe tener entre 1 y 15 caracteres"},
        {valido:email.length <= 1 && email.length <= 100, mensaje: "El email debe tener entre 1 y 100 caracteres."},
        {valido:direccion.length <= 1 && direccion.length <= 200, mensaje: "La direccion debe tener entre 3 y 200 caracteres."}
    ];
    return reglas.filter(r => !r.valido).map (r => r.mensaje);
};

const pintarCategorias = () => {
    const opciones = estado.cliente.map(c => new option (c.cli_nombre, c.id_cliente)); // <- Revisar bien estos nombres, poner los de evento
    el.cliente.replaceChildren(new option ("--Seleccione--",""), ...opciones);
};

//const crearFila = (p) =>{
    //const cliente = estado.clientes.find(c => c.id_cliente === p.)
//}
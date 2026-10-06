const URL_BASE = "http://localhost:8080/api/eventos";

async function solicitar(url, metodo = "GET", datos = null){
    const opciones = {method:metodo};

    if(datos){
        opciones.headers={"Content-Type": "application/json"};
        opciones.body = JSON.stringify(datos);
    }

    const respueta = await fetch(url,opciones);
    const body = await respuesta.json();
    return{status:respueta.status,body};
};

export const obtenerEventos = () => solicitar(URL_BASE);
export const insertarEvento = () => solicitar(URL_BASE, "POST", dto);
export const modificarEvento = (id, dto) => solicitar(`${id}`, "PUT", dto);
export const borrarEvento = (id) => solicitar(`${URL_BASE}/${id}`, "DELETE");
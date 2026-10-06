const URL_BASE = "http://localhost:8080/api/clientes";

async function solicitar(url, metodo = "GET", datos = null){
    const opciones = {method:metodo};

    if(datos){
        opciones.headers={"Content-Type": "application/json"};
        opciones.body = JSON.stringify(datos);
    }

    const respueta = await fetch(url,opciones);
    const body = await respuesta.json();
    return{status:respueta.status,body
    };
};

export const obtenerSalones = () => solicitar(URL_BASE);
//export const insertarSalon = () => solicitar(URL_BASE, "POST", dto);
//export const modificarSalon = (id, dto) => solicitar(`${URL_base}/${id}`, "PUT", dto);
//export const borrarSalon = (id) => solicitar(`${URL_BASE}/${id}`, "DELETE")
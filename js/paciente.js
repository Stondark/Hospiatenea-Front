const url = "http://localhost:8080";
const table = document.getElementById("table-pacientes");
const add_btn = document.getElementById("add-btn");



function convertDate(fecha_in){
    const fecha = new Date(fecha_in);

    const dia = fecha.getDate();
    const mes = fecha.toLocaleString('default', { month: 'long' }); // 'long' para el nombre completo del mes
    const año = fecha.getFullYear();
    return `${dia} ${mes} ${año}`;
}


add_btn.addEventListener("click", async () => {
    await Swal.fire({
      title: "Añadir paciente",
      html:
        '<input id="cedula" class="swal2-input" placeholder="Cédula">' + 
        '<input id="name" class="swal2-input" placeholder="Nombre">' +
        '<input id="apellido" class="swal2-input" placeholder="Apellido">' + 
        '<input id="fecha" type="date"  class="swal2-input" placeholder="Fecha nacimiento">' + 
        '<input id="telefono" class="swal2-input" placeholder="telefono">',
      focusConfirm: false,
      preConfirm: async () =>{
        let cedula = document.getElementById('cedula').value;
        let name = document.getElementById('name').value;
        let apellido = document.getElementById('apellido').value;
        let fecha = new Date(document.getElementById('fecha').value);
        let telefono = document.getElementById('telefono').value;
        console.log(fecha,fecha.toISOString() )

        let bodyContent = JSON.stringify({
                "cedula": Number(cedula),
                "nombre": name,
                "apellido": apellido,
                "fechaNacimiento": fecha.toISOString(),
                "telefono": telefono
        });
        
        try {
          await insertPaciente(bodyContent);
          location.reload();
        } catch (error) {
          await Swal.fire('Ocurrió un error al insertar', '', 'error');
        }

      }
    });
});


async function insertPaciente(bodyContent){
    try {
        let end_point = "paciente";

        let headersOpt = {
            "Content-Type": "application/json"  
        }

       const response = await fetch(`${url}/${end_point}`, {
            method: "POST",
            body: bodyContent,
            headers: headersOpt
       })

       const data = await response.json();
    return data;
    } catch (error) {
        throw error;
    }
}



async function deletePacienteById(id){
    try {
        let end_point = "paciente";

       const response = await fetch(`${url}/${end_point}/${id}`, {
            method: "DELETE"
       })

       const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

async function getAllPacientes(){
    try {
        let end_point = "paciente";

       const response = await fetch(`${url}/${end_point}`, {
            method: "GET",
       })

       const data = await response.json();
        return data._embedded.paciente;
    } catch (error) {
        throw error;
    }
}


async function addAllPacientes() {
    let medicos = await getAllPacientes();
    medicos.forEach((data) => {
      const fila = table.insertRow();
      fila.insertCell().innerText = data.cedula;
      fila.insertCell().innerText = data.nombre;
      fila.insertCell().innerText = data.apellido;
      fila.insertCell().innerText = convertDate(data.fechaNacimiento);
      fila.insertCell().innerText = data.telefono;
  
      let eliminarBtn = document.createElement('button');
      eliminarBtn.innerText = 'Eliminar';
      eliminarBtn.setAttribute('class', 'btn btn-danger btn-sm');
      eliminarBtn.addEventListener('click', () => {
        deletePacienteById(data.cedula).then((data) =>{
            location.reload();
        }).catch(error => {})
      });
      
      fila.insertCell().appendChild(eliminarBtn);
  
    });

  }

// Crear tabla
addAllPacientes().then((data) =>{}).catch(error => {})
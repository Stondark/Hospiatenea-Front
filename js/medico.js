const url = "http://localhost:8080";
const table = document.getElementById("table-medicos");
const add_btn = document.getElementById("add-btn");


function poblateSelect(json, field) {
  let field_id = document.getElementById(field);
  json.forEach((data) => {
    let option_clasificacion = document.createElement("option");
    option_clasificacion.value = Number(data.idEspecialidad);
    option_clasificacion.text = data.nombre;
    field_id.appendChild(option_clasificacion);
  });
}

add_btn.addEventListener("click", async () => {
    let end_point = "especialidad";

    let url_espec = `${url}/${end_point}`
  await Swal.fire({
    title: "Añadir médico",
    html:
      '<input id="cedula" class="swal2-input" placeholder="Cédula">' +
      '<input id="name" class="swal2-input" placeholder="Nombre">' +
      '<input id="apellido" class="swal2-input" placeholder="Apellido">' +
      '<input id="consultorio" class="swal2-input" placeholder="Consultorio">' +
      '<input id="correo" class="swal2-input" placeholder="Correo">' +
      '<select id="especialidad" class="swal2-select" ><option value="" disabled="" selected>Seleccione una especialidad</option></select>',
    focusConfirm: false,
    didOpen: async () => {
      const getClas = await getAllEspecialidad();
      poblateSelect(getClas, "especialidad");
    },
    preConfirm: async () => {
      let cedula = document.getElementById("cedula").value;
      let name = document.getElementById("name").value;
      let apellido = document.getElementById("apellido").value;
      let consultorio = document.getElementById("consultorio").value;
      let correo = document.getElementById("correo").value;
      let especialidad = document.getElementById("especialidad").value;
      let especialidadEntity = `${url_espec}/${especialidad}`;
      let bodyContent = JSON.stringify({
          cedula: Number(cedula),
          nombre: name,
          apellido: apellido,
          consultorio: consultorio,
          correo: correo,
          idEspecialidad: especialidadEntity,
      });

      try {
        await insertMedico(bodyContent);
        location.reload();
      } catch (error) {
        await Swal.fire("Ocurrió un error al insertar", "", "error");
      }
    },
  });
});

async function insertMedico(bodyContent) {
  try {
    let end_point = "medico";

    let headersOpt = {
      "Content-Type": "application/json",
    };

    const response = await fetch(`${url}/${end_point}`, {
      method: "POST",
      headers: headersOpt,
      body: bodyContent,
    });

    const data = await response.json();

    return data.data;
  } catch (error) {
    throw error;
  }
}

async function getAllEspecialidad() {
  try {
    let end_point = "especialidad";

    const response = await fetch(`${url}/${end_point}`, {
      method: "GET",
    });

    const data = await response.json();
    return data._embedded.especialidad;
  } catch (error) {
    throw error;
  }
}

async function deleteMedicoById(id) {
  try {
    let end_point = "medico";

    let headersOpt = {
      "Content-Type": "application/json",
    };

    const response = await fetch(`${url}/${end_point}/${id}`, {
      method: "DELETE",
      headers: headersOpt,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

async function getAllMedicos() {
  try {
    let end_point = "medico";

    let headersOpt = {
      "Content-Type": "application/json",
    };

    const response = await fetch(`${url}/${end_point}`, {
      method: "GET",
      headers: headersOpt,
    });

    const data = await response.json();
    console.log(data)
    return data._embedded.medico;
  } catch (error) {
    throw error;
  }
}

async function addAllMedicos() {
  let medicos = await getAllMedicos();
  medicos.forEach((data) => {
    const fila = table.insertRow();
    fila.insertCell().innerText = data.cedula;
    fila.insertCell().innerText = data.nombre;
    fila.insertCell().innerText = data.apellido;
    fila.insertCell().innerText = data.consultorio;
    fila.insertCell().innerText = data.correo;
    fila.insertCell().innerText = data.idEspecialidad.nombre;

    let eliminarBtn = document.createElement("button");
    eliminarBtn.innerText = "Eliminar";
    eliminarBtn.setAttribute("class", "btn btn-danger btn-sm");
    eliminarBtn.addEventListener("click", () => {
      deleteMedicoById(data.cedula)
        .then((data) => {
          location.reload();
        })
        .catch((error) => {});
    });

    fila.insertCell().appendChild(eliminarBtn);
  });
}

// Crear tabla
addAllMedicos()
  .then((data) => {})
  .catch((error) => {});

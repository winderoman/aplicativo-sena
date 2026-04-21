const tabla = document.getElementById("tablaDocumentos");
const loader = document.getElementById("loader");

// 🚀 Cargar documentos
async function cargarDocumentos() {
  loader.classList.remove("d-none");
  tabla.innerHTML = "";

  const res = await api.get("/documentos");
  

  loader.classList.add("d-none");

  if (!res || !res.data) return;

  if(res.data.documentos.length === 0){
    tabla.innerHTML = `
      <tr>
        <td colspan="3" class="text-center">No hay documentos disponibles</td>
        </tr>
    `;
    return;
  }

  res.data.documentos.forEach((doc, index) => {
    tabla.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${doc.nombre_documento}</td>
        <td>
          <a href="${doc.url}" target="_blank" class="btn btn-sm btn-primary">
            Descargar
          </a>
        </td>
      </tr>
    `;
  });
}

// 📤 Subir documento
document.getElementById("formDocumento").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre_documento").value;
  const archivo = document.getElementById("archivo").files[0];

  if (!archivo) return;

  loader.classList.remove("d-none");

  const formData = new FormData();
  formData.append("nombre_documento", nombre);
  formData.append("archivo", archivo);

  const token = getToken();

  try {
    const response = await fetch("http://localhost:3000/api/documentos/subir", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();

    loader.classList.add("d-none");

    if (!response.ok) {
      alertControl("danger", data.message || "Error al subir");
      return;
    }

    alertControl("success", "Documento subido correctamente");

    // cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalDocumento"));
    modal.hide();

    // reset form
    e.target.reset();

    // 🔄 recargar tabla
    cargarDocumentos();

  } catch (error) {
    loader.classList.add("d-none");
    console.error(error);
    alertControl("danger", "Error al subir archivo");
  }
});

// 🔥 INIT
cargarDocumentos();
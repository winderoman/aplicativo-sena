const tabla = document.getElementById("tablaDocumentos");
const loader = document.getElementById("loader");
let API_BASE = api.API_BASE;

function previewArchivo(url) {
  const iframe = document.getElementById("previewFrame");
  const img = document.getElementById("previewImg");

  iframe.classList.add("d-none");
  img.classList.add("d-none");

  if (url.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
    img.src = url;
    img.classList.remove("d-none");
  } else {
    iframe.src = url;
    iframe.classList.remove("d-none");
  }

  const modal = new bootstrap.Modal(document.getElementById("modalPreview"));
  modal.show();
}

async function descargarArchivo(url, nombre) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = nombre; // 🔥 fuerza descarga
    link.click();

    window.URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error(error);
    alertControl("danger", "Error al descargar archivo");
  }
}

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
    // si es tipo docx no mostrar vista previa, solo descargar
    let onclick = "";
    if ( doc.url_publica.match(/\.(doc|docx)$/i) ) {
      onclick = "disabled";
    } else {
      onclick = "";
    }
    
    tabla.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${doc.nombre_documento}</td>
        <td>${doc.mime_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'docx' : doc.mime_type }</td>
        <td>${(doc.tamanio_bytes / 1024).toFixed(2)} KB</td>
        <td>${new Date(doc.created_at).toLocaleDateString()}</td>
        <td class="d-flex gap-2">

          <button class="btn btn-sm btn-secondary"
            onclick="previewArchivo('${doc.url_publica}')"
            ${onclick}>
            <i class="bx bx-show"></i>
          </button>
          <button class="btn btn-sm btn-primary"
            onclick="descargarArchivo('${doc.url_publica}', '${doc.nombre_documento}')">
            <i class="bx bx-download"></i>
          </button>

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
    const response = await fetch(`${API_BASE}/documentos/subir`, {
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
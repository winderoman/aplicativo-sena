function alertControl(type, message, time = 3000){

  const container = document.getElementById("toastContainer");

  const toastId = "toast-" + Date.now();

  const toastHTML = `
  <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0 mb-2" role="alert">
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  </div>
  `;

  container.insertAdjacentHTML("beforeend", toastHTML);

  const toastElement = document.getElementById(toastId);

  const toast = new bootstrap.Toast(toastElement,{
    delay: time
  });

  toast.show();

  toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove();
  });

}
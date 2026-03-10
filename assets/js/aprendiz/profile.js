function main(){
    if (!checkAuth()) return;

    let profileAPI = api.get('/auth/profile',true);
    profileAPI.then(response => {
        if(response.success){
            let dtaStudent = document.getElementById('dataStudentCard');
            dtaStudent.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${response.data.perfil.nombre_aprendiz}</h5>
                    <p class="card-text">
                        <strong>Email:</strong> ${response.data.user.email} <br>
                        <strong>Rol:</strong> ${response.data.user.role} <br>
                        <strong>Ficha </strong>: ${response.data.perfil.ficha ? response.data.perfil.ficha : 'No asignada'} <br>
                        <strong>Programa de formación:</strong> ${response.data.perfil.programa_formacion ? response.data.perfil.programa_formacion : 'No asignado'} <br>
                        <strong>Tipo de documento:</strong> ${response.data.perfil.tipo_documento ? response.data.perfil.tipo_documento : 'No asignado'} <br>
                        <strong>Número de documento:</strong> ${response.data.perfil.numero_documento ? response.data.perfil.numero_documento : 'No asignado'} <br>
                        <strong>Teléfono:</strong> ${response.data.perfil.telefono ? response.data.perfil.telefono : 'No asignado'} <br>
                        <strong>Fecha inicio etapa </strong>: ${response.data.perfil.fecha_inicio_etapa ? new Date(response.data.perfil.fecha_inicio_etapa).toLocaleDateString() : 'No asignada'} <br>
                        <strong>Fecha fin etapa </strong>: ${response.data.perfil.fecha_fin_etapa ? new Date(response.data.perfil.fecha_fin_etapa).toLocaleDateString() : 'No asignada'} <br>
                    </p>
                </div>
            </div>
            `;
    
            document.getElementById('name_user').textContent = response.data.perfil.nombre_aprendiz;
            document.getElementById('role_user').textContent = response.data.user.role;
    
            console.log(response.data);
        }
    }).catch(error => {
        alertControl('danger',error.message || 'Error al cargar el perfil del aprendiz.');
        console.error(error);
        window.location.href = "index.html";
    });
}


main();
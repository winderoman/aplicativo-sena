'use strict';

async function registerStudent() {
    console.log("clikc");
    
    const formRegisterStudent = document.getElementById('formRegisterStudent');
    const formData = new FormData(formRegisterStudent);
    const data = Object.fromEntries(formData.entries());
    
    const { nombre_aprendiz, email, password } = data;
    // validar los campos
    if (!nombre_aprendiz || !email || !password) {
        alertControl('danger','Por favor, completa todos los campos.');
        return;
    }

    try {
        const response = await api.post('/auth/register', data);
        if(response.success == false){
            // mostrar mensaje de error, de express validator
            for (const key in response.errors) {
                if (response.errors.hasOwnProperty(key)) {
                    const error = response.errors[key];
                    alertControl('danger',error.message);
                    return;
                }
            }
            
        }
        setToken(response.data.accessToken);
        alertControl('success',response.message);
        setTimeout(() => {
            window.location.href = "profile.html";
        }, 1400);
    } catch (error) {
        alertControl('danger',error.message || 'Error al registrar el aprendiz.');
    }
    
    // limpiar inputs de la modal
    formRegisterStudent.reset();
    $("#modalRegistroAprendiz").modal('hide');
}

async function loginStudent() {
    const formLoginStudent = document.getElementById('FormLoginStudent');
    const formData = new FormData(formLoginStudent);
    const data = Object.fromEntries(formData.entries());
    const { email, password } = data;
    console.log(data);
    if (!email || !password) {
        alertControl('danger','Por favor, completa todos los campos.');
        return;
    }

    try {
        const response = await api.post('/auth/login', data);
        if(response.success == false){
            alertControl('danger',response.message);
            return;
        }

        setToken(response.data.accessToken);
        alertControl('success',response.message);
        // setTimeout(() => {
        //     window.location.href = "profile.html";
        // }, 1400);
    } catch (error) {
        alertControl('danger',error.message || 'Error al iniciar sesión.');
    }
    // limpiar inputs de la modal
    formLoginStudent.reset();
    $("#modalLoginAprendiz").modal('hide');
}

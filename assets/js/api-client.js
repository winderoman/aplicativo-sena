const api = {
 async request(url, options = {}){

    try{
      let dataAPI = null;
      if(options.body){
        dataAPI = JSON.parse(options.body);
      }else{
        dataAPI = null;
      }

      const token = getToken();

      options.headers = {
      "Content-Type": "application/json",
      ...options.headers
      };

      if(token){
        options.headers["Authorization"] = `Bearer ${token}`;
      }

      console.log("💡API URL: ",url);
      console.log("💡API DATA: ", dataAPI );
      API_BASE = "https://aplicativo-sena-api.onrender.com/api/v1";
      const response = await fetch(API_BASE + url, options);
      let responseAPI = await response.json();
      
      if(response.status === 401){
        if(responseAPI.message == "Token requerido. Incluye: Authorization: Bearer <token>"){
          console.warn("Sesión expirada");

          logout();

          return;
        }
      }

      if(!response.ok){
        //let responseAPI = await response.json();
        console.error("💡API Error: ",responseAPI);
        return responseAPI;
      }
      
      //let data =  await response.json();
      console.log("💡API Response: ",responseAPI);
      return responseAPI;

    }catch(error){

      alertControl('danger',"Error de conexión con el servidor");

      console.error(error);

    }

 },

 get(url){
  return this.request(url);
 },

 post(url,data){
   return this.request(url,{
     method:'POST',
     body:JSON.stringify(data)
   });
 },

 put(url,data){
   return this.request(url,{
     method:'PUT',
     body:JSON.stringify(data)
   });
 },

 delete(url){
   return this.request(url,{
     method:'DELETE'
   });
 }

}
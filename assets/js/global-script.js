function setToken(token){
   localStorage.setItem("token", token);
}

function getToken(){
   return localStorage.getItem("token");
}

function logout(){
    localStorage.removeItem("token");
    window.location.href = "index.html";
}


function togglePassword(element) {
  const input = element.parentElement.querySelector("input");
  const icon = element.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("bx-hide");
    icon.classList.add("bx-show");
  } else {
    input.type = "password";
    icon.classList.remove("bx-show");
    icon.classList.add("bx-hide");
  }
}

function checkAuth(){
  const token = getToken();

  if (!token) {
    window.location.href = "/index.html";
    return false;
  }

  return true;
}
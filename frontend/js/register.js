console.log("Register.js loaded");

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

togglePassword.addEventListener("click", () => {

    if(password.type === "password"){
        password.type = "text";
        togglePassword.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    }else{
        password.type = "password";
        togglePassword.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }

});

toggleConfirmPassword.addEventListener("click", () => {

    if(confirmPassword.type === "password"){
        confirmPassword.type = "text";
        toggleConfirmPassword.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    }else{
        confirmPassword.type = "password";
        toggleConfirmPassword.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }

});
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

const message = document.getElementById("passwordMessage");

confirmPassword.addEventListener("keyup", () => {

    if(password.value === confirmPassword.value){

        message.innerHTML = "✔ Passwords match";
        message.classList.remove("text-danger");
        message.classList.add("text-success");

    }else{

        message.innerHTML = "✖ Passwords do not match";
        message.classList.remove("text-success");
        message.classList.add("text-danger");

    }

});

const form = document.getElementById("registerForm");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    if (password.value !== confirmPassword.value) {

        alert("Passwords do not match!");
        return;

    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const email = document.getElementById("email").value;

    // Check if email already exists
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {

        alert("This email is already registered!");
        return;

    }

    const newUser = {

        name: document.getElementById("fullName").value,

        email: email,

        phone: document.getElementById("phone").value,

        password: password.value

    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration Successful!");

    form.reset();

    window.location.href = "login.html";

});
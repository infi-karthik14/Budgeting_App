document.addEventListener("DOMContentLoaded", () => {

    // Add Transaction Button

    const addBtn = document.querySelector(".add-btn");

    addBtn.addEventListener("click", () => {

        alert("Add Transaction feature will be connected with backend.");

    });

    // Highlight sidebar

    const menuItems = document.querySelectorAll(".menu li");

    menuItems.forEach(item => {

        item.addEventListener("click", () => {

            menuItems.forEach(i => i.classList.remove("active"));

            item.classList.add("active");

        });

    });

    // Edit Button

    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach(btn => {

        btn.addEventListener("click", () => {

            alert("Edit Transaction");

        });

    });

    // Delete Button

    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach(btn => {

        btn.addEventListener("click", () => {

            if(confirm("Delete this transaction?")){

                btn.closest("tr").remove();

            }

        });

    });

});
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

const ctx = document.getElementById("transactionChart");

if (ctx) {
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [{
                label: "Transactions",
                data: [15, 20, 18, 25, 30, 28]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}

const profileImage = localStorage.getItem("profileImage");
const userName = localStorage.getItem("userName");

if(profileImage){
    document.getElementById("profileImage").src = profileImage;
}

if(userName){
    document.getElementById("userName").textContent = userName;
}
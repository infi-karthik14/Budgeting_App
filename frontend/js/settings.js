document.addEventListener("DOMContentLoaded", function () {

    const darkModeToggle = document.getElementById("darkModeToggle");
    const emailToggle = document.getElementById("emailToggle");
    const budgetAlertToggle = document.getElementById("budgetAlertToggle");
    const autoSaveToggle = document.getElementById("autoSaveToggle");

    const currency = document.getElementById("currency");
    const language = document.getElementById("language");

    const saveBtn = document.getElementById("saveBtn");
    const resetBtn = document.getElementById("resetBtn");


    /* ================================
       LOAD SAVED SETTINGS
    ================================= */

    const savedSettings =
        JSON.parse(localStorage.getItem("budgetSettings")) || {};


    if (savedSettings.darkMode === true) {
        darkModeToggle.checked = true;
        document.body.classList.add("dark-mode");
    }

    if (savedSettings.emailNotifications !== undefined) {
        emailToggle.checked = savedSettings.emailNotifications;
    }

    if (savedSettings.budgetAlerts !== undefined) {
        budgetAlertToggle.checked = savedSettings.budgetAlerts;
    }

    if (savedSettings.autoSave !== undefined) {
        autoSaveToggle.checked = savedSettings.autoSave;
    }

    if (savedSettings.currency) {
        currency.value = savedSettings.currency;
    }

    if (savedSettings.language) {
        language.value = savedSettings.language;
    }


    /* ================================
       DARK MODE
    ================================= */

    darkModeToggle.addEventListener("change", function () {

    document.body.classList.toggle("dark-mode", this.checked);

    const settings =
        JSON.parse(localStorage.getItem("budgetSettings")) || {};

    settings.darkMode = this.checked;

    localStorage.setItem(
        "budgetSettings",
        JSON.stringify(settings)
    );

});


    /* ================================
       SAVE SETTINGS
    ================================= */

    saveBtn.addEventListener("click", function (e) {

    e.preventDefault();

        const settings = {

            darkMode: darkModeToggle.checked,

            emailNotifications:
                emailToggle.checked,

            budgetAlerts:
                budgetAlertToggle.checked,

            autoSave:
                autoSaveToggle.checked,

            currency:
                currency.value,

            language:
                language.value

        };


        localStorage.setItem(
            "budgetSettings",
            JSON.stringify(settings)
        );


        showMessage("Settings saved successfully!");
    });


    /* ================================
       RESET SETTINGS
    ================================= */

    resetBtn.addEventListener("click", function (e) {

    e.preventDefault();

        const confirmReset =
            confirm("Are you sure you want to reset all settings?");


        if (!confirmReset) {
            return;
        }


        darkModeToggle.checked = false;

        emailToggle.checked = true;

        budgetAlertToggle.checked = true;

        autoSaveToggle.checked = true;

        currency.value = "INR";

        language.value = "English";


        document.body.classList.remove("dark-mode");


        localStorage.removeItem("budgetSettings");


        showMessage("Settings have been reset.");

    });


    /* ================================
       SUCCESS MESSAGE
    ================================= */

    function showMessage(message) {

        const oldMessage =
            document.querySelector(".settings-message");

        if (oldMessage) {
            oldMessage.remove();
        }


        const messageBox =
            document.createElement("div");

        messageBox.className =
            "settings-message";

        messageBox.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            <span>${message}</span>
        `;


        document.body.appendChild(messageBox);


        setTimeout(function () {

            messageBox.classList.add("hide");

            setTimeout(function () {
                messageBox.remove();
            }, 300);

        }, 2500);

    }

});
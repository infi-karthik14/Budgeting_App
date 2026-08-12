document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("contactStatus");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    status.textContent = "";
    status.style.color = "";

    const name = document.getElementById("contactName").value.trim();

    const email = document.getElementById("contactEmail").value.trim();

    const subject = document.getElementById("contactSubject").value.trim();

    const message = document.getElementById("contactMessage").value.trim();

    if (!name || !email || !subject || !message) {
      status.textContent = "Please fill in all required fields.";

      status.style.color = "#dc3545";

      return;
    }

    const contactMessage = {
      id: Date.now(),

      name: name,

      email: email,

      subject: subject,

      message: message,

      createdAt: new Date().toISOString(),
    };

    const messages = JSON.parse(localStorage.getItem("contactMessages")) || [];

    messages.push(contactMessage);

    localStorage.setItem("contactMessages", JSON.stringify(messages));

    status.textContent = "Your message has been sent successfully!";

    status.style.color = "#198754";

    form.reset();
  });
});

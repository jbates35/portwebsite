document.addEventListener("DOMContentLoaded", async function () {
  // We want the contact card link in the header bar to open up the business card info
  const contact_card_link = document.getElementById("contact-card-link");
  contact_card_link.addEventListener("click", function () {
    document.querySelectorAll(".contact-show-state").forEach((el) => {
      el.classList.add("show");
    });
  });

  // If they click the rest of the screen, we want to close the business card info
  const whole_screen = document.getElementById("whole-screen");
  whole_screen.addEventListener("click", function () {
    document.querySelectorAll(".contact-show-state").forEach((el) => {
      el.classList.remove("show");
    });
  });

  // The banner should be a link to the main home page
  const home_direct = document.querySelectorAll(".home-direct");
  home_direct.forEach((home_link) => {
    home_link.addEventListener("click", function () {
      window.location.href = "./";
    });
  });
});

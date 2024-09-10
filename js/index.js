document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const closeButton = document.getElementById("close-button");
  const sidebar = document.getElementById("sidebar");
  const contentWrapper = document.getElementById("content-wrapper");

  hamburger.addEventListener("click", function () {
    sidebar.classList.add("open");
    hamburger.style.display = "none";
    closeButton.style.display = "block";
    contentWrapper.classList.add("sidebar-open");
  });

  closeButton.addEventListener("click", function () {
    sidebar.classList.remove("open");
    hamburger.style.display = "block";
    closeButton.style.display = "none";
    contentWrapper.classList.remove("sidebar-open");
  });
});

async function loadFooter() {
  const res = await fetch("./partials/footer.html");
  const html = await res.text();

  document.getElementById("footer-container").innerHTML = html;

  document.getElementById("year").textContent =
    new Date().getFullYear();
}

loadFooter();

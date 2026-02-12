document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const toast = document.getElementById("formToast");

  if (!form) return;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    toast.setAttribute("aria-hidden", "false");

    setTimeout(() => {
      toast.classList.remove("is-visible");
      toast.setAttribute("aria-hidden", "true");
    }, 2500);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // 🚫 stop redirect

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const formData = new FormData(form);

      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        form.reset(); // clears inputs
        showToast("Message sent");
      } else {
        showToast("Something went wrong. Please try again.");
      }
    } catch (err) {
      showToast("Network error. Please try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  const phoneInput = document.getElementById("phoneInput");

  if (phoneInput) {

    phoneInput.addEventListener("input", formatPhoneNumber);

    function formatPhoneNumber(e) {

      let digits = e.target.value.replace(/\D/g, "");

      // limit to 10 digits
      digits = digits.substring(0, 10);

      let formatted = "";

      if (digits.length > 0) {
        formatted = "(" + digits.substring(0, 3);
      }

      if (digits.length >= 4) {
        formatted += ") " + digits.substring(3, 6);
      }

      if (digits.length >= 7) {
        formatted += "-" + digits.substring(6, 10);
      }

      e.target.value = formatted;
    }

  }
});


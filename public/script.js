const form = document.getElementById("reviewForm");
const result = document.getElementById("result");
const subject = document.getElementById("subject");
const content = document.getElementById("content");
const statusText = document.getElementById("status");
const copyButton = document.getElementById("copyButton");

form.addEventListener("submit", async event => {
  event.preventDefault();

  statusText.textContent = "Membuat permohonan...";
  result.classList.add("hidden");

  const username = document.getElementById("username").value.trim().replace(/^@/, "");
  const email = document.getElementById("email").value.trim();
  const reason = document.getElementById("reason").value;

  try {
    const response = await fetch("/api/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        email,
        reason
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Gagal membuat permohonan.");
    }

    subject.textContent = `Subject: ${data.data.subject}`;
    content.value = data.data.content;

    result.classList.remove("hidden");
    statusText.textContent = "Permohonan berhasil dibuat.";
  } catch (error) {
    statusText.textContent = error.message;
  }
});

copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(content.value);
  copyButton.textContent = "Copied!";

  setTimeout(() => {
    copyButton.textContent = "Copy Permohonan";
  }, 1500);
});

const form = document.getElementById("reviewForm");
const result = document.getElementById("result");
const subject = document.getElementById("subject");
const platformResult = document.getElementById("platformResult");
const content = document.getElementById("content");
const statusText = document.getElementById("status");

const evidence = document.getElementById("evidence");
const previewBox = document.getElementById("previewBox");
const previewImage = document.getElementById("previewImage");
const fileName = document.getElementById("fileName");
const removeImage = document.getElementById("removeImage");

const copyButton = document.getElementById("copyButton");
const emailButton = document.getElementById("emailButton");

let reviewData = null;
let imageUrl = null;

evidence.addEventListener("change", () => {
  const file = evidence.files[0];

  if (!file) return;

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  if (!allowedTypes.includes(file.type)) {
    evidence.value = "";
    statusText.textContent = "Format foto harus JPG, PNG, JPEG atau WEBP.";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    evidence.value = "";
    statusText.textContent = "Ukuran foto maksimal 5 MB.";
    return;
  }

  if (imageUrl) {
    URL.revokeObjectURL(imageUrl);
  }

  imageUrl = URL.createObjectURL(file);

  previewImage.src = imageUrl;
  fileName.textContent = file.name;
  previewBox.classList.remove("hidden");
  statusText.textContent = "Foto siap dilampirkan.";
});

removeImage.addEventListener("click", () => {
  evidence.value = "";

  if (imageUrl) {
    URL.revokeObjectURL(imageUrl);
    imageUrl = null;
  }

  previewImage.removeAttribute("src");
  fileName.textContent = "";
  previewBox.classList.add("hidden");
  statusText.textContent = "Foto dihapus.";
});

form.addEventListener("submit", async event => {
  event.preventDefault();

  statusText.textContent = "Membuat permohonan...";
  result.classList.add("hidden");

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const platform = document.getElementById("platform").value;
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
        platform,
        reason
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Gagal membuat permohonan.");
    }

    reviewData = data.data;

    subject.textContent = `Subject: ${reviewData.subject}`;
    platformResult.textContent = `Platform: ${reviewData.platform}`;
    content.value = reviewData.content;

    result.classList.remove("hidden");
    statusText.textContent = "Permohonan berhasil dibuat.";
  } catch (error) {
    statusText.textContent = error.message;
  }
});

copyButton.addEventListener("click", async () => {
  if (!reviewData) return;

  await navigator.clipboard.writeText(reviewData.content);

  copyButton.textContent = "✓ Tersalin";

  setTimeout(() => {
    copyButton.textContent = "📋 Copy Teks";
  }, 1500);
});

emailButton.addEventListener("click", () => {
  if (!reviewData) return;

  const targetEmail = "instagram-android@meta.com";

  const mailto =
    `mailto:${targetEmail}` +
    `?subject=${encodeURIComponent(reviewData.subject)}` +
    `&body=${encodeURIComponent(reviewData.content)}`;

  window.location.href = mailto;

  statusText.textContent = "Aplikasi email sedang dibuka.";
});

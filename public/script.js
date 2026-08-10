const form = document.getElementById("reviewForm");
const result = document.getElementById("result");
const subject = document.getElementById("subject");
const platformResult = document.getElementById("platformResult");
const content = document.getElementById("content");
const statusText = document.getElementById("status");

const platformPicker = document.getElementById("platformPicker");
const reasonPicker = document.getElementById("reasonPicker");

const platformInput = document.getElementById("platform");
const reasonInput = document.getElementById("reason");

const platformTitle = document.getElementById("platformTitle");
const platformSub = document.getElementById("platformSub");

const reasonTitle = document.getElementById("reasonTitle");
const reasonSub = document.getElementById("reasonSub");

const pickerOverlay = document.getElementById("pickerOverlay");
const sheetTitle = document.getElementById("sheetTitle");
const sheetSubtitle = document.getElementById("sheetSubtitle");
const pickerOptions = document.getElementById("pickerOptions");
const closePicker = document.getElementById("closePicker");

const evidence = document.getElementById("evidence");
const previewBox = document.getElementById("previewBox");
const previewImage = document.getElementById("previewImage");
const fileName = document.getElementById("fileName");
const removeImage = document.getElementById("removeImage");

const copyButton = document.getElementById("copyButton");
const emailButton = document.getElementById("emailButton");

let reviewData = null;
let imageUrl = null;
let activePicker = null;

const platforms = [
  {
    value: "android",
    icon: "🤖",
    title: "Android",
    sub: "Aplikasi Instagram"
  },
  {
    value: "ios",
    icon: "",
    title: "iPhone / iOS",
    sub: "Aplikasi Instagram"
  },
  {
    value: "web",
    icon: "🌐",
    title: "Web / Browser",
    sub: "Instagram melalui browser"
  }
];

const reasons = [
  {
    value: "disabled",
    icon: "🔒",
    title: "Akun Dinonaktifkan",
    sub: "Account disabled"
  },
  {
    value: "suspended",
    icon: "⛔",
    title: "Akun Ditangguhkan",
    sub: "Account suspended"
  },
  {
    value: "login",
    icon: "🔑",
    title: "Tidak Bisa Login",
    sub: "Mengalami masalah saat login"
  },
  {
    value: "other",
    icon: "💬",
    title: "Masalah Lainnya",
    sub: "Masalah akun lainnya"
  }
];

function openPicker(type) {
  activePicker = type;

  const data = type === "platform" ? platforms : reasons;

  sheetTitle.textContent =
    type === "platform" ? "Pilih Perangkat" : "Masalah Akun";

  sheetSubtitle.textContent =
    type === "platform"
      ? "Pilih perangkat yang digunakan"
      : "Pilih kondisi akun kamu";

  pickerOptions.innerHTML = "";

  data.forEach(item => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "option";

    const currentValue =
      type === "platform"
        ? platformInput.value
        : reasonInput.value;

    if (currentValue === item.value) {
      button.classList.add("selected");
    }

    button.innerHTML = `
      <span class="option-icon">${item.icon}</span>
      <span class="option-info">
        <strong>${item.title}</strong>
        <small>${item.sub}</small>
      </span>
    `;

    button.addEventListener("click", () => {
      selectOption(type, item);
    });

    pickerOptions.appendChild(button);
  });

  pickerOverlay.classList.remove("hidden");
}

function selectOption(type, item) {
  if (type === "platform") {
    platformInput.value = item.value;
    platformTitle.textContent = item.title;
    platformSub.textContent = item.sub;
  } else {
    reasonInput.value = item.value;
    reasonTitle.textContent = item.title;
    reasonSub.textContent = item.sub;
  }

  closePickerModal();
}

function closePickerModal() {
  pickerOverlay.classList.add("hidden");
  activePicker = null;
}

platformPicker.addEventListener("click", () => {
  openPicker("platform");
});

reasonPicker.addEventListener("click", () => {
  openPicker("reason");
});

closePicker.addEventListener("click", closePickerModal);

pickerOverlay.addEventListener("click", event => {
  if (event.target === pickerOverlay) {
    closePickerModal();
  }
});

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
    statusText.textContent = "Format foto tidak didukung.";
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

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!platformInput.value) {
    statusText.textContent = "Silakan pilih perangkat.";
    openPicker("platform");
    return;
  }

  if (!reasonInput.value) {
    statusText.textContent = "Silakan pilih masalah akun.";
    openPicker("reason");
    return;
  }

  statusText.textContent = "Membuat permohonan...";
  result.classList.add("hidden");

  try {
    const response = await fetch("/api/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        email,
        platform: platformInput.value,
        reason: reasonInput.value
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

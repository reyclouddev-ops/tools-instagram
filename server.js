const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    name: "ReyCloud IG Review",
    version: "1.0.0",
    status: "online"
  });
});

app.post("/api/review", (req, res) => {
  const { username, email, reason } = req.body;

  if (!username || !email || !reason) {
    return res.status(400).json({
      success: false,
      message: "Username, email, dan alasan wajib diisi."
    });
  }

  const reasons = {
    disabled: "My Instagram account has been disabled.",
    suspended: "My Instagram account has been suspended.",
    login: "I am experiencing an issue accessing my Instagram account.",
    other: "I am experiencing an issue with my Instagram account."
  };

  const issue = reasons[reason] || reasons.other;

  const message = `Hello Instagram Support,

I am requesting a review of my Instagram account.

Username: @${username}
Email: ${email}

Issue:
${issue}

I believe my account should be reviewed. If there has been a mistake, I kindly request that my account access be restored.

I am willing to provide any additional information required to verify ownership of the account.

Thank you for your time and assistance.

Regards,
ReyCloud`;

  res.json({
    success: true,
    message: "Permohonan berhasil dibuat.",
    data: {
      username,
      email,
      subject: `Instagram Account Review - @${username}`,
      content: message
    }
  });
});

app.listen(PORT, () => {
  console.log(`ReyCloud IG Review running on port ${PORT}`);
});

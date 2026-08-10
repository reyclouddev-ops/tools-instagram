module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const { username, email, reason, platform } = req.body || {};

    if (!username || !email || !reason || !platform) {
      return res.status(400).json({
        success: false,
        message: "Semua data wajib diisi."
      });
    }

    const platforms = {
      android: "Android",
      ios: "iPhone / iOS",
      web: "Web / Browser"
    };

    const reasons = {
      disabled: "My Instagram account has been disabled.",
      suspended: "My Instagram account has been suspended.",
      login: "I am experiencing an issue accessing my Instagram account.",
      other: "I am experiencing an issue with my Instagram account."
    };

    const cleanUsername = String(username)
      .replace(/^@/, "")
      .trim();

    const selectedPlatform = platforms[platform] || "Web / Browser";
    const issue = reasons[reason] || reasons.other;

    const subject = `Instagram Account Review - @${cleanUsername}`;

    const content = `Hello Instagram Support,

I am requesting a review of my Instagram account.

Username: @${cleanUsername}
Email: ${email}
Platform: ${selectedPlatform}

Issue:
${issue}

I believe my account should be reviewed. If there has been a mistake, I kindly request that my account access be restored.

I am willing to provide any additional information required to verify ownership of the account.

Thank you for your time and assistance.

Regards,
ReyCloudShop`;

    return res.status(200).json({
      success: true,
      data: {
        username: cleanUsername,
        email,
        platform: selectedPlatform,
        subject,
        content
      }
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

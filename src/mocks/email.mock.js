async function sendEmail(email, pdfPath, score) {
  console.log("[MOCK EMAIL] → To:", email);
  console.log("[MOCK EMAIL] → Score:", score + "/100");
  console.log("[MOCK EMAIL] → Report:", pdfPath);

  return {
    status: "mock_sent",
    messageId: "MOCK_EMAIL_" + Date.now(),
  };
}

module.exports = { sendEmail };

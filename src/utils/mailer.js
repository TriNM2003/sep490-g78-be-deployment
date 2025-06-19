// src/utils/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (to, token) => {
  const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: `"PawShelter" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Xác thực email của bạn",
    html: `
      <h3>Xin chào!</h3>
      <p>Vui lòng nhấn vào link bên dưới để xác thực tài khoản:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `,
  });
};

module.exports = { sendVerificationEmail };

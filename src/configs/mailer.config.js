const nodemailer = require("nodemailer");

// Cấu hình SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


async function sendEmail(to, subject = "[Skrumio] No subject", body = "No content") {
    subject = "[Skrumio] "+ subject;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: body,
    };

    return transporter.sendMail(mailOptions);
}

// Export module
module.exports = { sendEmail };
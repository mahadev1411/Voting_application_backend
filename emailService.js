const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, message) => {
    try {
        await transporter.sendMail({
            from: `"Voting System" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: `<p>${message}</p>`
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendEmail;

const nodemailer = require("nodemailer");
const sendEmail = async (mailOption) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true for 465, false for other ports (587 uses STARTTLS)
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
        let info = await transporter.sendMail(mailOption);
        console.log(`Message sent: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("Email sending error:", error);
        throw error;
    }
}
module.exports = sendEmail;

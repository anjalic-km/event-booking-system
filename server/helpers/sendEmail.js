const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email Send Successfully");
  } catch (error) {
    console.log("Email Sending Error:", error);
    return error;
  }
};

module.exports = sendEmail;
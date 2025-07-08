import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.SENDGRID_EMAIL || !process.env.SENDGRID_API_KEY) {
  throw new Error("Missing sendGrid config in env file");
}

const transporter = nodemailer.transporter({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

export const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("❌ Email send failed:", error.response?.body || error);
    throw new Error("Email send failed");
  }
};

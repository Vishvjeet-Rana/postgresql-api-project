import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

if (!process.env.SENDGRID_EMAIL || !process.env.SENDGRID_API_KEY) {
  throw new Error("Missing sendGrid config in env file");
}

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendMail = async ({ to, subject, html }: SendMailOptions) => {
  try {
    await transporter.sendMail({
      from: process.env.SENDGRID_EMAIL,
      to,
      subject,
      html,
    });
  } catch (error: any) {
    console.error("❌ Email send failed:", error.response?.body || error);
    throw new Error("Email send failed");
  }
};

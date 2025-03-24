import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Hardcoded credentials (not recommended for production)
const EMAIL_USER = "arcticdefense@gmail.com"; // Replace with your Gmail address
const EMAIL_PASS = "qsbm resa trmc bukp";    // Replace with your App Password

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const { username, subject, message } = await request.json();

    // Validate incoming data
    if (!username || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    const mailOptions = {
      from: EMAIL_USER,
      to: "plugsaver7@gmail.com", // Replace with the recipient email
      subject: "New Support Ticket",
      text: `
        You received a new support ticket:
        
        From: ${username}
        Subject: ${subject}
        Message: ${message}
        
        Please respond to this ticket as soon as possible.
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "Ticket submitted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send email." },
      { status: 500 }
    );
  }
}
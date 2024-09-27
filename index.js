require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/send-email', (req, res) => {
  const { to } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'smtp.gmail.com',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "Thank You For Being a Beta Tester!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Custom Email</title>
        <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .email-header {
            background-color: #333;
            color: #ffffff;
            padding: 10px;
            text-align: center;
        }
        .email-content {
            padding: 20px;
            font-size: 16px;
            line-height: 1.5;
        }
        .email-footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777;
        }
        </style>
      </head>
      <body>
        <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; color: #333;">
          <h1 style="background-color: #333; color: white; padding: 10px; text-align: center;">Welcome to Master List Generator!</h1>
          <p>Hello, thank you for signing up to be a beta tester! Our team will reach out once the application is completed.</p>
          <!-- More content -->
        </div>
      </body>
      </html>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
    }
    res.status(200).json({ success: true, message: 'Email sent successfully', info });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors());

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
    subject: "Welcome to the Beta Program of Nucleus!",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nucleus - Welcome</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica', Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
          }
          .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .email-header {
            background-color: #8338EC;
            color: #ffffff;
            padding: 20px;
            text-align: center;
          }
          .email-content {
            padding: 20px;
            font-size: 16px;
            line-height: 1.6;
            color: #555;
          }
          .email-content h2 {
            color: #333;
          }
          .email-footer {
            text-align: center;
            padding: 15px;
            background-color: #f4f4f4;
            font-size: 12px;
            color: #999;
          }
          a {
            color: #8338EC;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>Welcome to Nucleus!</h1>
          </div>
          <div class="email-content">
            <p>Dear Beta Tester,</p>
            <p>Thank you for joining the beta program for <strong>Nucleus</strong>, an exciting platform designed to help students stay organized and on top of their academic workload.</p>
            <h2>What is Nucleus?</h2>
            <p>Our platform allows students to upload their course syllabi and automatically generate a complete list of all their deadlines, including assignments, exams, and projects. No more missing due dates!</p>
            <p>With Nucleus, you can:</p>
            <ul>
              <li>Upload your syllabus directly to the platform.</li>
              <li>Automatically organize and track all your upcoming deadlines.</li>
              <li>Receive reminders and never miss an assignment again.</li>
            </ul>
            <p>We appreciate your help in making this tool the best it can be. Our team will reach out to you soon with more details on how to get started and provide feedback on the platform.</p>
            <p>Best regards,</p>
            <p><strong>The Nucleus Team</strong></p>
          </div>
          <div class="email-footer">
            <p>If you have any questions, feel free to reach out to our support team at <a href="mailto:leekayne22@gmail.com">leekayne22@gmail.com</a>.</p>
            <p>&copy; 2024 Nucleus. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
  

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log(error)
      return res.status(500).json({ success: false, message: 'Failed to send email'});

    }
    res.status(200).json({ success: true, message: 'Email sent successfully'});
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
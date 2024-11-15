const nodemailer = require('nodemailer');
const cors = require('cors');

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://team-mc.vercel.app']
  : ['https://team-mc.vercel.app', 'http://localhost:3000'];

const handler = async (req, res) => {
  if (req.method === 'OPTIONS') {
    // Handle preflight
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { to } = req.body;

  if (!to) {
    return res.status(400).json({ error: 'Recipient email (to) is required' });
  }

  const transporter = nodemailer.createTransport({
    service: 'smtp.gmail.com',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Welcome to the Beta Program of Nucleus!',
    html: `<!-- Your email HTML template here -->`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
};

// Apply CORS middleware
const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
});

export default function (req, res) {
  return corsMiddleware(req, res, () => handler(req, res));
}

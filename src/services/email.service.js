import nodemailer from "nodemailer";
import { google } from "googleapis";

const createTransporter = async () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground",
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const { token } = await oauth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: token,
    },
  });

  await transporter.verify();

  return transporter;
};

const sendEmail = async (to, subject, text, html) => {
  try {
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email Sent Successfully");
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);
    console.log("Response:", info.response);
  } catch (error) {
    console.error("❌ Error sending email");
    console.error(error);
  }
};

const sendRegistrationEmail = async (userEmail, name) => {
  const subject = "🎉 Welcome to Backend Ledger";

  const text = `
Hello ${name},

Welcome to Backend Ledger!

Your account has been created successfully.

You can now:

• Manage your accounts
• Track your transactions
• Monitor your financial dashboard
• Securely manage your data

Thank you for joining us.

Backend Ledger Team
`;

  const html = `
              <!DOCTYPE html>
              <html>

              <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">

              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">

              <tr>

              <td align="center">

              <table width="620" cellpadding="0" cellspacing="0"
              style="background:#ffffff;border:1px solid #e5e7eb;">

              <tr>

              <td
              style="background:#2563eb;
              padding:40px;
              text-align:center;">

              <h1
              style="margin:0;
              font-size:34px;
              color:white;">
              Backend Ledger
              </h1>

              <p
              style="margin-top:10px;
              color:#dbeafe;
              font-size:16px;">
              Secure • Fast • Reliable
              </p>

              </td>

              </tr>

              <tr>

              <td style="padding:40px;">

              <h2
              style="margin-top:0;
              color:#111827;">
              Hello ${name} 👋
              </h2>

              <p
              style="font-size:16px;
              line-height:28px;
              color:#4b5563;">
              Welcome to
              <b>Backend Ledger</b>.

              We're thrilled to have you with us!
              </p>

              <p
              style="font-size:16px;
              line-height:28px;
              color:#4b5563;">
              Your account has been created successfully.
              You're now ready to start managing your finances securely.
              </p>

              <table
              width="100%"
              cellpadding="14"
              cellspacing="0"
              style="
              background:#f9fafb;
              border:1px solid #e5e7eb;
              margin-top:30px;
              margin-bottom:30px;">

              <tr>
              <td>🔐 Secure Authentication</td>
              </tr>

              <tr>
              <td>💳 Track Transactions</td>
              </tr>

              <tr>
              <td>📊 Financial Dashboard</td>
              </tr>

              <tr>
              <td>📈 Reports & Analytics</td>
              </tr>

              </table>

              <table
              align="center"
              cellpadding="0"
              cellspacing="0">

              <tr>

              <td
              align="center"
              bgcolor="#2563eb"
              style="
              padding:15px 30px;">

              <a
              href="https://faixal.vercel.app/"
              style="
              font-size:16px;
              font-weight:bold;
              color:white;
              text-decoration:none;">
              Open Dashboard →
              </a>

              </td>

              </tr>

              </table>

              <p
              style="
              margin-top:40px;
              font-size:14px;
              line-height:24px;
              color:#6b7280;">

              If you didn't create this account,
              please ignore this email or contact our support team immediately.

              </p>

              </td>

              </tr>

              <tr>

              <td
              align="center"
              style="
              padding:30px;
              background:#f9fafb;
              border-top:1px solid #e5e7eb;">

              <p
              style="
              margin:0;
              font-size:13px;
              color:#6b7280;">

              © 2026 Backend Ledger

              <br><br>

              Built with ❤️ using Node.js, Express, MongoDB & React

              </p>

              </td>

              </tr>

              </table>

              </td>

              </tr>

              </table>

              </body>

              </html>
`;

  await sendEmail(userEmail, subject, text, html);
};

export default sendRegistrationEmail;

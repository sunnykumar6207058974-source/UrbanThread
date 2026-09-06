const nodemailer = require('nodemailer');

/**
 * Creates and returns Nodemailer transporter using Gmail
 */
const getTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user.trim(),
      pass: pass.trim().replace(/\s+/g, '') // remove any spaces in 16-character app password
    }
  });
};

/**
 * Sends a Login Alert Email to the user whenever they log in
 *
 * @param {Object} details
 * @param {string} details.toEmail - User's email address
 * @param {string} details.userName - User's display name
 * @param {string} details.deviceType - '💻 Laptop / Desktop' | '📱 Mobile Phone' | '📱 Tablet'
 * @param {string} details.os - Operating System (e.g. macOS, iOS, Windows, Android)
 * @param {string} details.browser - Browser name (e.g. Safari, Chrome)
 * @param {string} details.ip - Client IP address
 * @param {string} details.time - Formatted timestamp
 */
const sendLoginAlert = async ({ toEmail, userName, deviceType, os, browser, ip, time }) => {
  const loginTime = time || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'medium' });
  const cleanIp = (ip || 'Unknown').replace('::ffff:', '');

  console.log(`\n🔔 [LOGIN ALERT DETECTED]`);
  console.log(`   ➜ User: ${userName} (${toEmail})`);
  console.log(`   ➜ Device: ${deviceType} | OS: ${os} | Browser: ${browser}`);
  console.log(`   ➜ IP: ${cleanIp} | Time: ${loginTime}`);

  const transporter = getTransporter();

  if (!transporter) {
    console.log(`ℹ️ [EMAIL NOTICE] EMAIL_USER / EMAIL_PASS not yet configured in backend/.env. Simulated login alert logged above.`);
    return { success: true, simulated: true };
  }

  const isMobile = deviceType.includes('Mobile') || deviceType.includes('Phone');
  const deviceBadgeColor = isMobile ? '#3b82f6' : '#10b981';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Security Alert: New Login to UrbanThread</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="580" style="max-width: 580px; background: #1e293b; border: 1px solid #334155; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #ff3f6c 0%, #ff6b8b 100%); padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">URBANTHREAD</h1>
                  <p style="margin: 6px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 500;">Account Security Notification</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 32px 28px;">
                  <h2 style="margin: 0 0 12px 0; font-size: 20px; color: #ffffff; font-weight: 700;">Hello, ${userName}!</h2>
                  <p style="margin: 0 0 24px 0; color: #94a3b8; font-size: 15px; line-height: 1.6;">
                    A new sign-in was detected on your UrbanThread account. Here are the login session details:
                  </p>

                  <!-- Session Card -->
                  <div style="background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                    <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px;">
                      <tr>
                        <td width="35%" style="color: #64748b; font-weight: 600;">Device:</td>
                        <td style="color: #ffffff; font-weight: 700;">
                          <span style="display: inline-block; padding: 3px 10px; border-radius: 9999px; background: ${deviceBadgeColor}20; color: ${deviceBadgeColor}; font-size: 13px;">
                            ${deviceType}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600;">Operating System:</td>
                        <td style="color: #e2e8f0; font-weight: 600;">${os || 'Unknown OS'}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600;">Web Browser:</td>
                        <td style="color: #e2e8f0; font-weight: 600;">${browser || 'Web Browser'}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600;">Date & Time:</td>
                        <td style="color: #e2e8f0; font-weight: 600;">${loginTime} (IST)</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600;">IP Address:</td>
                        <td style="color: #94a3b8; font-family: monospace;">${cleanIp}</td>
                      </tr>
                    </table>
                  </div>

                  <!-- Security Advisory -->
                  <div style="background: #0f172a; border-left: 4px solid #10b981; padding: 14px 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
                    <p style="margin: 0; color: #10b981; font-weight: 700; font-size: 14px;">✅ Was this you?</p>
                    <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px; line-height: 1.5;">
                      If you just signed in on this device, you can safely ignore this security alert.
                    </p>
                  </div>

                  <div style="background: #450a0a; border-left: 4px solid #ef4444; padding: 14px 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
                    <p style="margin: 0; color: #f87171; font-weight: 700; font-size: 14px;">⚠️ Don't recognize this activity?</p>
                    <p style="margin: 4px 0 0 0; color: #fca5a5; font-size: 13px; line-height: 1.5;">
                      If this wasn't you, please change your password immediately or contact our support team.
                    </p>
                  </div>

                  <p style="margin: 0; color: #64748b; font-size: 12px; text-align: center;">
                    UrbanThread Luxury Retail Private Limited • New Delhi, India<br>
                    This is an automated security notification sent to ${toEmail}.
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

  try {
    const info = await transporter.sendMail({
      from: `"UrbanThread Security" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `🔒 Security Alert: New login from ${deviceType} (${os})`,
      html: htmlContent
    });
    console.log(`✅ [LOGIN EMAIL SENT] Message ID: ${info.messageId} to ${toEmail}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ [EMAIL ERROR] Failed to send email to ${toEmail}:`, err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  sendLoginAlert
};

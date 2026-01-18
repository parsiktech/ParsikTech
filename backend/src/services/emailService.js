const { Resend } = require('resend');

// Create Resend client lazily
let resend = null;

const getResend = () => {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
};

const sendEmail = async ({ to, subject, html, text }) => {
  // Skip sending if no API key configured
  if (!process.env.RESEND_API_KEY) {
    console.log('Resend API not configured, skipping send to:', to);
    console.log('Subject:', subject);
    return { success: true, skipped: true };
  }

  try {
    const client = getResend();
    const { data, error } = await client.emails.send({
      from: process.env.EMAIL_FROM || 'Parsik Tech <noreply@parsiktechgroup.com>',
      to: [to],
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('Email sent:', data.id);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

const sendInviteEmail = async ({ to, companyName, inviteUrl, expiresAt }) => {
  const subject = `You're invited to join ${companyName} on Parsik Tech`;

  const expiresDate = new Date(expiresAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>You're Invited</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
      </style>
      <![endif]-->
    </head>
    <body style="margin: 0 !important; padding: 0 !important; background-color: #0a0a0f; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
      <!-- Background wrapper -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0a0a0f; margin: 0; padding: 0; width: 100% !important;">
        <tr>
          <td align="center" style="padding: 40px 16px; background-color: #0a0a0f;">
            <!-- Content container -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">
              <!-- Logo -->
              <tr>
                <td align="center" style="padding-bottom: 30px;">
                  <h1 style="margin: 0; font-size: 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #ffffff;">
                    Parsik<span style="color: #6366F1;">Tech</span>
                  </h1>
                </td>
              </tr>

              <!-- Main Card -->
              <tr>
                <td style="background-color: #12121a; border-radius: 16px; border: 1px solid #1e1e2e; padding: 32px 24px;">
                  <!-- Icon -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="padding-bottom: 24px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="width: 64px; height: 64px; background-color: #6366F1; background-color: rgba(99, 102, 241, 0.15); border-radius: 32px; text-align: center; vertical-align: middle;">
                              <span style="font-size: 28px; line-height: 64px;">&#9993;</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #ffffff; text-align: center;">
                    You're Invited!
                  </h2>

                  <p style="margin: 0 0 8px 0; font-size: 16px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #9ca3af; text-align: center;">
                    You've been invited to access your client portal.
                  </p>
                  <p style="margin: 0 0 8px 0; font-size: 16px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #9ca3af; text-align: center;">
                    Inside, you'll find updates, deliverables, and important information related to your account.
                  </p>
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #9ca3af; text-align: center;">
                    Click below to set up your access and get started.
                  </p>

                  <!-- Button -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="padding: 16px 0;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td align="center" style="background-color: #6366F1; border-radius: 8px;">
                              <a href="${inviteUrl}" target="_blank" style="display: inline-block; background-color: #6366F1; color: #ffffff; font-size: 16px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; text-decoration: none; padding: 14px 32px; border-radius: 8px;">
                                Activate Your Account
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Expiry Notice -->
                  <p style="margin: 24px 0 0 0; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #6b7280; text-align: center;">
                    This invitation expires on ${expiresDate}
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding-top: 30px;">
                  <p style="margin: 0 0 8px 0; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #6b7280; text-align: center;">
                    If the button doesn't work, copy and paste this link:
                  </p>
                  <p style="margin: 0; font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #4b5563; text-align: center; word-break: break-all;">
                    <a href="${inviteUrl}" style="color: #6366F1;">${inviteUrl}</a>
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding-top: 40px;">
                  <p style="margin: 0; font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #4b5563; text-align: center;">
                    &copy; ${new Date().getFullYear()} Parsik Tech. All rights reserved.
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

  const text = `
You're Invited to ${companyName}!

You've been invited to access the ${companyName} client portal on Parsik Tech.

Click here to activate your account: ${inviteUrl}

This invitation expires on ${expiresDate}.

If you didn't expect this invitation, you can safely ignore this email.

© ${new Date().getFullYear()} Parsik Tech
  `;

  return sendEmail({ to, subject, html, text });
};

const sendPasswordResetEmail = async ({ to, resetUrl, expiresAt }) => {
  const subject = 'Reset Your Parsik Tech Password';

  const expiresDate = new Date(expiresAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0f; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">
              <!-- Logo -->
              <tr>
                <td align="center" style="padding-bottom: 30px;">
                  <h1 style="margin: 0; font-size: 28px; color: #ffffff;">
                    Parsik<span style="color: #6366F1;">Tech</span>
                  </h1>
                </td>
              </tr>

              <!-- Main Card -->
              <tr>
                <td style="background-color: #12121a; border-radius: 16px; border: 1px solid #1e1e2e; padding: 40px;">
                  <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #ffffff; text-align: center;">
                    Reset Your Password
                  </h2>

                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #9ca3af; text-align: center;">
                    We received a request to reset your password. Click the button below to create a new password.
                  </p>

                  <!-- Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 16px 0;">
                        <a href="${resetUrl}" style="display: inline-block; background-color: #6366F1; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px;">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Expiry Notice -->
                  <p style="margin: 24px 0 0 0; font-size: 14px; color: #6b7280; text-align: center;">
                    This link expires on ${expiresDate}
                  </p>

                  <p style="margin: 16px 0 0 0; font-size: 14px; color: #6b7280; text-align: center;">
                    If you didn't request this, you can safely ignore this email.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding-top: 30px;">
                  <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; text-align: center;">
                    If the button doesn't work, copy and paste this link:
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #4b5563; text-align: center; word-break: break-all;">
                    <a href="${resetUrl}" style="color: #6366F1;">${resetUrl}</a>
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding-top: 40px;">
                  <p style="margin: 0; font-size: 12px; color: #4b5563; text-align: center;">
                    &copy; ${new Date().getFullYear()} Parsik Tech. All rights reserved.
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

  const text = `
Reset Your Parsik Tech Password

We received a request to reset your password.

Click here to reset your password: ${resetUrl}

This link expires on ${expiresDate}.

If you didn't request this, you can safely ignore this email.

© ${new Date().getFullYear()} Parsik Tech
  `;

  return sendEmail({ to, subject, html, text });
};

module.exports = {
  sendEmail,
  sendInviteEmail,
  sendPasswordResetEmail,
};

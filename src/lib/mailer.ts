import mailjet from 'node-mailjet';

const mailjetClient = mailjet.apiConnect(
  process.env.MAILJET_API_KEY || '',
  process.env.MAILJET_SECRET_KEY || ''
);

export const sendEmail = async ({ to, subject, html }: { to: string, subject: string, html: string }) => {
  if (!process.env.MAILJET_API_KEY) {
    console.warn("MAILJET_API_KEY is not defined. Email suppressed:", { to, subject });
    return;
  }
  
  const senderEmail = process.env.MAILJET_SENDER_EMAIL || 'noreply@venecos.com';

  const request = mailjetClient.post("send", { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: senderEmail,
          Name: "Venecos Platform"
        },
        To: [
          {
            Email: to,
          }
        ],
        Subject: subject,
        HTMLPart: html,
      }
    ]
  });

  try {
    const result = await request;
    console.log("Email successfully sent via Mailjet to: ", to);
    return result.body;
  } catch (err) {
    console.error("Mailjet send error:", err);
    throw err;
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyLink = `${process.env.NEXTAUTH_URL}/en/verify-email?token=${token}`;
  
  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h1>Welcome to Venecos!</h1>
      <p>Thank you for signing up. Please verify your email address to activate your account.</p>
      <a href="${verifyLink}" style="display: inline-block; padding: 10px 20px; background-color: #D4AF37; color: #1a1a1a; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Verify Email</a>
      <p style="margin-top: 20px; color: #666; font-size: 14px;">If you did not request this, please ignore this email.</p>
    </div>
  `;
  
  await sendEmail({ to: email, subject: "Verify Your Venecos Account", html });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXTAUTH_URL}/en/reset-password?token=${token}`;
  
  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h1>Password Reset Request</h1>
      <p>We received a request to reset your password. Click the button below to set a new one:</p>
      <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #D4AF37; color: #1a1a1a; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Reset Password</a>
      <p style="margin-top: 20px; color: #666; font-size: 14px;">If you did not request a password reset, you can safely ignore this email. The link will expire in 1 hour.</p>
    </div>
  `;

  await sendEmail({ to: email, subject: "Reset Your Venecos Password", html });
};

export const sendAccountSetupEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXTAUTH_URL}/en/reset-password?token=${token}`;
  
  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h1>Welcome to Venecos!</h1>
      <p>Congratulations! Your application has been accepted and an account has been created for you.</p>
      <p>Please click the button below to set up your password and access your new Employee Dashboard:</p>
      <a href="\${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #D4AF37; color: #1a1a1a; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Set Password</a>
      <p style="margin-top: 20px; color: #666; font-size: 14px;">The link will expire in 1 hour.</p>
    </div>
  `;

  await sendEmail({ to: email, subject: "Welcome to Venecos - Set up your password", html });
};

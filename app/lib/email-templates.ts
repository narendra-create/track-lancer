// ─── 1. OTP / Account Verification Template ──────────────────────────────
export const getVerificationEmailHtml = (otp: string, name: string = "there") => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verify your email</title>
</head>
<body style="background-color: #0f0f0f; color: #e8e3d8; font-family: Arial, sans-serif; margin: 0; padding: 40px 0;">
  <div style="max-width: 480px; margin: 0 auto; background-color: #161616; border: 1px solid #2a2a2a; padding: 40px; text-align: center;">
    
    <p style="font-family: monospace; font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase; color: #c8a96e; margin-bottom: 24px;">
      — Track Lancer
    </p>

    <h1 style="font-family: Georgia, serif; font-size: 24px; color: #e8e3d8; margin: 0 0 16px 0; font-weight: normal;">
      Verify your email.
    </h1>
    
    <p style="font-size: 14px; color: #7a7570; line-height: 1.6; margin: 0 0 32px 0;">
      Hi ${name},<br>Use the 6-digit code below to verify your email address and finish creating your account.
    </p>

    <div style="background-color: #0f0f0f; border: 1px solid #2a2a2a; padding: 24px; margin-bottom: 32px;">
      <p style="font-family: monospace; font-size: 32px; letter-spacing: 8px; color: #c8a96e; margin: 0; font-weight: bold;">
        ${otp}
      </p>
    </div>

    <p style="font-size: 12px; color: #7a7570; margin: 0;">
      This code will expire in 10 minutes.<br>If you didn't request this, you can safely ignore this email.
    </p>

  </div>
</body>
</html>
`;

// ─── 2. Forgot Password Template ─────────────────────────────────────────
export const getForgotPasswordEmailHtml = (otp: string, name: string = "there") => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset your password</title>
</head>
<body style="background-color: #0f0f0f; color: #e8e3d8; font-family: Arial, sans-serif; margin: 0; padding: 40px 0;">
  <div style="max-width: 480px; margin: 0 auto; background-color: #161616; border: 1px solid #2a2a2a; padding: 40px; text-align: center;">
    
    <p style="font-family: monospace; font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase; color: #c8a96e; margin-bottom: 24px;">
      — Password Reset
    </p>

    <h1 style="font-family: Georgia, serif; font-size: 24px; color: #e8e3d8; margin: 0 0 16px 0; font-weight: normal;">
      Reset your password.
    </h1>
    
    <p style="font-size: 14px; color: #7a7570; line-height: 1.6; margin: 0 0 32px 0;">
      Hi ${name},<br>We received a request to reset your Track Lancer password. Enter the code below on the reset page.
    </p>

    <div style="background-color: #0f0f0f; border: 1px solid #2a2a2a; padding: 24px; margin-bottom: 32px;">
      <p style="font-family: monospace; font-size: 32px; letter-spacing: 8px; color: #c8a96e; margin: 0; font-weight: bold;">
        ${otp}
      </p>
    </div>

    <p style="font-size: 12px; color: #7a7570; margin: 0;">
      This code will expire in 10 minutes.<br>If you didn't request a password reset, please ignore this email. Your password will not be changed.
    </p>

  </div>
</body>
</html>
`;
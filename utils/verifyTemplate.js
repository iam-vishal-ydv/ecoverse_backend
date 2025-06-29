function verifyTemplate(name, email, otpType, otp) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; color: #333; max-width: 600px; margin: 0 auto;">
      <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50;">Hello ${name},</h2>
        <p style="font-size: 16px;">You requested to ${otpType === "verify" ? "verify your email" : "reset your password"
    } for <strong>${email}</strong></p>

        <div style="background: #f0f7ff; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #555;">Your one-time OTP is:</p>
          <div style="font-size: 28px; font-weight: bold; letter-spacing: 3px; color: #00c853; margin: 10px 0;">${otp}</div>
          <p style="margin: 0; font-size: 12px; color: #777;">(Valid for 10 minutes)</p>
        </div>

        <p style="font-size: 14px; color: #555;">Enter this OTP in the app to continue.</p>

        <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          <p style="font-size: 13px; color: #777;">If you didn't request this, you can safely ignore this email.</p>
          <p style="font-size: 14px; margin-top: 20px;">Thanks,<br>The Ecover Team</p>
        </div>
      </div>
    </div>
  `;
}

export default verifyTemplate

function verifyTemplate(name, email, id, otp) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; color: #333; max-width: 600px; margin: 0 auto;">
      <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50;">Welcome to Ecover, ${name}!</h2>
        <p style="font-size: 16px;">Thank you for signing up with the email: <strong>${email}</strong></p>
        
        <div style="background: #f0f7ff; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #555;">Your verification OTP is:</p>
          <div style="font-size: 28px; font-weight: bold; letter-spacing: 3px; color: #00c853; margin: 10px 0;">${otp}</div>
          <p style="margin: 0; font-size: 12px; color: #777;">(Valid for 10 minutes)</p>
        </div>

        <p style="font-size: 15px;">Or click below to verify your email:</p>
        <a href="https://ecover-se.vercel.app/email-verify-otp?id=${id}" 
           style="display: inline-block; padding: 12px 25px; background-color: #00c853; color: white; 
                  text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 0;">
           Verify Email
        </a>

        <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          <p style="font-size: 13px; color: #777;">If you didn't request this, please ignore this email.</p>
          <p style="font-size: 14px; margin-top: 20px;">Thanks,<br>The Ecover Team</p>
        </div>
      </div>
    </div>
  `;
}

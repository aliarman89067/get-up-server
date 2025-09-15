interface VerificationTemplateProps {
  code: string;
}

export const VerificationTemplate = ({ code }: VerificationTemplateProps) => {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); overflow: hidden;">
          <tr>
      <img src="https://vhbhgobpxemioycqhbgp.supabase.co/storage/v1/object/public/urls/Group%20191.png" alt="Logo" style="width: 70px; height:70px; object-fit: contain;" />
          </tr>
          <tr>
            <td style="padding: 0 40px;">
              <h2 style="color: #333333;">Verify Your Email Address</h2>
              <p style="font-size: 16px; color: #555555; line-height: 1.6;">
                Thank you for signing up. Please use the verification code below to complete your registration.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; background-color: #f0f0f0; color: #111111; font-size: 24px; letter-spacing: 4px; padding: 15px 25px; border-radius: 6px; font-weight: bold;">
                  ${code}
                </span>
              </div>
              <p style="font-size: 14px; color: #999999;">
                This code will expire in 10 minutes. If you did not request this, please ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px 40px 40px; text-align: center;">
              <p style="font-size: 12px; color: #aaaaaa;">
                &copy; ${new Date().getFullYear()} Get Up. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `;
};

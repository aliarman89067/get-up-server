interface TaskReminderTemplateProps {
  taskName: string;
}

export const TaskReminderTemplate = ({
  taskName,
}: TaskReminderTemplateProps) => {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 30px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); overflow: hidden;">
            <tr>
              <td style="text-align: center; padding-top: 30px;">
                <img src="https://vhbhgobpxemioycqhbgp.supabase.co/storage/v1/object/public/urls/Group%20191.png" alt="Logo" style="width: 70px; height: 70px; object-fit: contain;" />
              </td>
            </tr>
            <tr>
              <td style="padding: 0 40px;">
                <h2 style="color: #333333;">⏰ Task Reminder</h2>
                <p style="font-size: 16px; color: #555555; line-height: 1.6;">
                  This is a quick reminder for the following task:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <div style="display: inline-block; background-color: #f0f0f0; color: #111111; font-size: 20px; padding: 12px 20px; border-radius: 6px; font-weight: bold;">
                    ${taskName}
                  </div>
                </div>
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

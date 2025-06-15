export const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Static Template</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
  </head>
  <body style="margin: 0; font-family: 'Poppins', sans-serif; background: #ffffff; font-size: 14px;">
    <div style="max-width: 680px; margin: 0 auto; padding: 45px 30px 60px; background: #f4f7ff; background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner); background-repeat: no-repeat; background-size: 800px 452px; background-position: top center; font-size: 14px; color: #434343;">
      <header>
        <table style="width: 100%;">
          <tbody>
            <tr style="height: 0;">
              <td>
                <img alt="" src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1663574980688_114990/archisketch-logo" height="30px" />
              </td>
              <td style="text-align: right;">
                <span style="font-size: 16px; line-height: 30px; color: #ffffff;">12 Nov, 2021</span>
              </td>
            </tr>
          </tbody>
        </table>
      </header>

      <main>
        <div style="margin: 0; margin-top: 70px; padding: 92px 30px 115px; background: #ffffff; border-radius: 30px; text-align: center;">
          <div style="width: 100%; max-width: 489px; margin: 0 auto;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 500; color: #1f1f1f;">Your OTP</h1>
            <p style="margin: 0; margin-top: 17px; font-size: 16px; font-weight: 500;">Hey %name%,</p>
            <p style="margin: 0; margin-top: 17px; font-weight: 500; letter-spacing: 0.56px;">
              Thank you for choosing Archisketch Company. Use the following OTP to complete the procedure to change your email address. OTP is valid for <span style="font-weight: 600; color: #1f1f1f;">5 minutes</span>. Do not share this code with others, including Archisketch employees.
            </p>
            <p style="margin: 0; margin-top: 60px; font-size: 40px; font-weight: 600; letter-spacing: 25px; color: #ba3d4f;">%number%</p>
          </div>
        </div>

        <p style="max-width: 400px; margin: 0 auto; margin-top: 90px; text-align: center; font-weight: 500; color: #8c8c8c;">
          Need help? Ask at <a href="mailto:archisketch@gmail.com" style="color: #499fb6; text-decoration: none;">archisketch@gmail.com</a> or visit our <a href="" target="_blank" style="color: #499fb6; text-decoration: none;">Help Center</a>
        </p>
      </main>

      <footer style="width: 100%; max-width: 490px; margin: 20px auto 0; text-align: center; border-top: 1px solid #e6ebf1;">
        <p style="margin: 0; margin-top: 40px; font-size: 16px; font-weight: 600; color: #434343;">Archisketch Company</p>
        <p style="margin: 0; margin-top: 8px; color: #434343;">Address 540, City, State.</p>
        <div style="margin: 0; margin-top: 16px;">
          <a href="" target="_blank" style="display: inline-block;">
            <img width="36px" alt="Facebook" src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook" />
          </a>
          <a href="" target="_blank" style="display: inline-block; margin-left: 8px;">
            <img width="36px" alt="Instagram" src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram" />
          </a>
          <a href="" target="_blank" style="display: inline-block; margin-left: 8px;">
            <img width="36px" alt="Twitter" src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter" />
          </a>
          <a href="" target="_blank" style="display: inline-block; margin-left: 8px;">
            <img width="36px" alt="Youtube" src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube" />
          </a>
        </div>
        <p style="margin: 0; margin-top: 16px; color: #434343;">Copyright © 2022 Company. All rights reserved.</p>
      </footer>
    </div>
  </body>
</html>
`;

// template 2
// <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; background-color: #fff;">
//   <!--Subject: Login Verification Required for Your Notepott Account-->
//   <div style="margin: 0 auto; width: 100%; max-width: 600px; padding: 0 0px; padding-bottom: 10px; border-radius: 5px; line-height: 1.8;">
//     <div style="border-bottom: 1px solid #eee;">
//       <a style="font-size: 1.4em; color: #000; text-decoration: none; font-weight: 600;">Prove Your Notepott Identity</a>
//     </div>
//     <br />
//     <strong>Dear %name%,</strong>
//     <p>
//       We have received a login request for your [App Name] account. For
//       security purposes, please verify your identity by providing the
//       following One-Time Password (OTP).
//       <br />
//       <b>Your One-Time Password (OTP) verification code is:</b>
//     </p>
//     <h2 style="background: linear-gradient(to right, #00bc69 0, #00bc88 50%, #00bca8 100%); margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">%number%</h2>
//     <p style="font-size: 0.9em">
//       <strong>One-Time Password (OTP) is valid for 3 minutes.</strong>
//       <br />
//       <br />
//       If you did not initiate this login request, please disregard this
//       message. Please ensure the confidentiality of your OTP and do not share
//       it with anyone.<br />
//       <strong>Do not forward or give this code to anyone.</strong>
//       <br />
//       <br />
//       <strong>Thank you for using Notepott.</strong>
//       <br />
//       <br />
//       Best regards,
//       <br />
//       <strong>Xelinq</strong>
//     </p>

//     <hr style="border: none; border-top: 0.5px solid #131111;" />
//     <div style="color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300;">
//       <p>This email can't receive replies.</p>
//       <p>
//         For more information about Notepott and your account, visit
//         <strong>[Name]</strong>
//       </p>
//     </div>
//   </div>
//   <div style="text-align: center;">
//     <div style="color: #666666; font-weight: 400; font-size: 13px; line-height: 18px; padding-bottom: 6px;">
//       <span>
//         This email was sent to
//         <a href="mailto:{Email Address}" style="text-decoration: none; color: #00bc69;">{Email Address}</a>
//       </span>
//     </div>
//     <div style="color: #666666; font-weight: 400; font-size: 13px; line-height: 18px; padding-bottom: 6px;">
//       <a href="/" style="text-decoration: none; color: #00bc69;">Xelinq</a> | [Address]
//       | [Address] - [Zip Code/Pin Code], [Country Name]
//     </div>
//     <div style="color: #666666; font-weight: 400; font-size: 13px; line-height: 18px; padding-bottom: 6px;">
//       &copy; 2023 Xelinq. All rights
//       reserved.
//     </div>
//   </div>
// </body>
// <!-- This template is made by Redwan from Ocoxe. -->
// <!-- https://www.ocoxe.com -->
// </html>
// `;

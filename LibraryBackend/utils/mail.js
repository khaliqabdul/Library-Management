const nodeMailer = require("nodemailer");
require("dotenv").config();

// for sending mail
exports.mailTransport = () =>
  nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.adminMail,
      pass: process.env.adminMailPassword,
    },
  });

// Generate OTP
exports.generateOTP = () => {
  let otp = "";
  for (let i = 0; i <= 3; i++) {
    const randVal = Math.round(Math.random() * 9);
    otp = otp + randVal;
  }
  return otp;
};
// for sending mail
exports.verificationMail = async (name, email, user_id, OTP) => {
  try {
    const mailTransporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.adminMail,
        pass: process.env.adminMailPassword,
      },
    });

    const mailOptions = {
      from: process.env.adminMail,
      to: email,
      subject: "For Email verification",
      html: generateEmailTemplate(
        OTP,
        name,
        "Please verify your email",
        "Please verify your email to continue..",
        "Verification Code is."
      ),
    };

    mailTransporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent:-", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};
// email verification template
exports.generateEmailTemplate = (OTP, name, heading, text1, text2) => {
  return `
  <!DOCTYPE html>
<html
  lang="en"
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <meta charset="utf-8" />
    <!-- utf-8 works for most cases -->
    <meta name="viewport" content="width=device-width" />
    <!-- Forcing initial-scale shouldn't be necessary -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- Use the latest (edge) version of IE rendering engine -->
    <meta name="x-apple-disable-message-reformatting" />
    <!-- Disable auto-scale in iOS 10 Mail entirely -->
    <title></title>
    <!-- The title tag shows in email notifications, like Android 4.4. -->

    <link
      href="https://fonts.googleapis.com/css?family=Lato:300,400,700"
      rel="stylesheet"
    />
    <style>
      /* What it does: Remove spaces around the email design added by some email clients. */
      /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
      html,
      body {
        margin: 0 auto !important;
        padding: 0 !important;
        height: 100% !important;
        width: 100% !important;
        background: #f1f1f1;
      }

      /* What it does: Stops email clients resizing small text. */
      * {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }

      /* What it does: Centers email on Android 4.4 */
      div[style*="margin: 16px 0"] {
        margin: 0 !important;
      }
      /* What it does: Fixes webkit padding issue. */
      table {
        border-spacing: 0 !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
        margin: 0 auto !important;
      }

      /* What it does: A work-around for email clients meddling in triggered links. */
      *[x-apple-data-detectors],  /* iOS */
.unstyle-auto-detected-links *,
.aBn {
        border-bottom: 0 !important;
        cursor: default !important;
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }

      /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
      .a6S {
        display: none !important;
        opacity: 0.01 !important;
      }

      /* What it does: Prevents Gmail from changing the text color in conversation threads. */
      .im {
        color: inherit !important;
      }

      /* If the above doesn't work, add a .g-img class to any image in question. */
      img.g-img + div {
        display: none !important;
      }

      /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
      /* Create one of these media queries for each additional viewport size you'd like to fix */

      /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
      @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
        u ~ div .email-container {
          min-width: 320px !important;
        }
      }
      /* iPhone 6, 6S, 7, 8, and X */
      @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
        u ~ div .email-container {
          min-width: 375px !important;
        }
      }
      /* iPhone 6+, 7+, and 8+ */
      @media only screen and (min-device-width: 414px) {
        u ~ div .email-container {
          min-width: 414px !important;
        }
      }
    </style>
    <!-- CSS Reset : END -->
    <style>
      .primary {
        background: #30e3ca;
      }
      .bg_white {
        background: #ffffff;
      }
      .bg_light {
        background: #fafafa;
      }
      .bg_black {
        background: #000000;
      }
      .bg_dark {
        background: rgba(0, 0, 0, 0.8);
      }
      .email-section {
        padding: 2.5em;
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-family: "Lato", sans-serif;
        color: #000000;
        margin-top: 0;
        font-weight: 400;
      }

      body {
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: 15px;
        line-height: 1.8;
        color: rgba(0, 0, 0, 0.4);
      }

      a {
        color: #30e3ca;
      }
      .logo h1 {
        margin: 0;
      }
      .logo h1 a {
        color: #30e3ca;
        font-size: 24px;
        font-weight: 700;
        font-family: "Lato", sans-serif;
      }

      /*HERO*/
      .hero {
        position: relative;
        z-index: 0;
      }

      .hero .text {
        color: rgba(0, 0, 0, 0.3);
      }
      .hero .text h2 {
        color: #000;
        font-size: 40px;
        margin-bottom: 0;
        font-weight: 400;
        line-height: 1.4;
      }
      .hero .text h3 {
        font-size: 24px;
        font-weight: 200;
      }
      .hero .text h2 span {
        font-weight: 600;
        color: #30e3ca;
      }
    </style>
  </head>
  <body
    width="100%"
    style="margin: 0; padding: 0 !important; background-color: #f1f1f1"
  >
    <div style="max-width: 600px; margin: 0 auto" class="email-container">
      <!-- BEGIN BODY -->
      <table
        role="presentation"
        cellspacing="0"
        cellpadding="0"
        width="100%"
        style="margin: auto"
      >
        <tr>
          <td valign="top" class="bg_white" style="padding: 1em 2.5em 0 2.5em">
            <table
              role="presentation"
              cellpadding="0"
              cellspacing="0"
              width="100%"
            >
              <tr>
                <td class="logo" style="text-align: center">
                  <h1><a href="#">Welcome ${name}</a></h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- end tr -->
        <tr>
          <td
            valign="middle"
            class="hero bg_white"
            style="padding: 2em 0 4em 0"
          >
            <table>
              <tr>
                <td>
                  <div
                    class="text"
                    style="padding: 0 2.5em; text-align: center"
                  >
                    <h2>${heading}</h2>
                    <h3>${text1}</h3>
                    <h3>${text2}</h3>
                    <h1>${OTP}</h1>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
  `;
};
// password reset template
exports.passwordResetTemplate = (link, name, heading, text1) => {
  return `
    <!DOCTYPE html>
<html
  lang="en"
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <meta charset="utf-8" />
    <!-- utf-8 works for most cases -->
    <meta name="viewport" content="width=device-width" />
    <!-- Forcing initial-scale shouldn't be necessary -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- Use the latest (edge) version of IE rendering engine -->
    <meta name="x-apple-disable-message-reformatting" />
    <!-- Disable auto-scale in iOS 10 Mail entirely -->
    <title></title>
    <!-- The title tag shows in email notifications, like Android 4.4. -->

    <link
      href="https://fonts.googleapis.com/css?family=Lato:300,400,700"
      rel="stylesheet"
    />
    <style>
      /* What it does: Remove spaces around the email design added by some email clients. */
      /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
      html,
      body {
        margin: 0 auto !important;
        padding: 0 !important;
        height: 100% !important;
        width: 100% !important;
        background: #f1f1f1;
      }

      /* What it does: Stops email clients resizing small text. */
      * {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }

      /* What it does: Centers email on Android 4.4 */
      div[style*="margin: 16px 0"] {
        margin: 0 !important;
      }
      /* What it does: Fixes webkit padding issue. */
      table {
        border-spacing: 0 !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
        margin: 0 auto !important;
      }

      /* What it does: A work-around for email clients meddling in triggered links. */
      *[x-apple-data-detectors],  /* iOS */
.unstyle-auto-detected-links *,
.aBn {
        border-bottom: 0 !important;
        cursor: default !important;
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }

      /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
      .a6S {
        display: none !important;
        opacity: 0.01 !important;
      }

      /* What it does: Prevents Gmail from changing the text color in conversation threads. */
      .im {
        color: inherit !important;
      }

      /* If the above doesn't work, add a .g-img class to any image in question. */
      img.g-img + div {
        display: none !important;
      }

      /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
      /* Create one of these media queries for each additional viewport size you'd like to fix */

      /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
      @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
        u ~ div .email-container {
          min-width: 320px !important;
        }
      }
      /* iPhone 6, 6S, 7, 8, and X */
      @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
        u ~ div .email-container {
          min-width: 375px !important;
        }
      }
      /* iPhone 6+, 7+, and 8+ */
      @media only screen and (min-device-width: 414px) {
        u ~ div .email-container {
          min-width: 414px !important;
        }
      }
    </style>
    <!-- CSS Reset : END -->
    <style>
      .primary {
        background: #30e3ca;
      }
      .bg_white {
        background: #ffffff;
      }
      .bg_light {
        background: #fafafa;
      }
      .bg_black {
        background: #000000;
      }
      .bg_dark {
        background: rgba(0, 0, 0, 0.8);
      }
      .email-section {
        padding: 2.5em;
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-family: "Lato", sans-serif;
        color: #000000;
        margin-top: 0;
        font-weight: 400;
      }

      body {
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: 15px;
        line-height: 1.8;
        color: rgba(0, 0, 0, 0.4);
      }

      a {
        color: #30e3ca;
      }
      .logo h1 {
        margin: 0;
      }
      .logo h1 a {
        color: #30e3ca;
        font-size: 24px;
        font-weight: 700;
        font-family: "Lato", sans-serif;
      }

      /*HERO*/
      .hero {
        position: relative;
        z-index: 0;
      }

      .hero .text {
        color: rgba(0, 0, 0, 0.3);
      }
      .hero .text h2 {
        color: #000;
        font-size: 40px;
        margin-bottom: 0;
        font-weight: 400;
        line-height: 1.4;
      }
      .hero .text h3 {
        font-size: 24px;
        font-weight: 200;
      }
      .hero .text h2 span {
        font-weight: 600;
        color: #30e3ca;
      }
    </style>
  </head>
  <body
    width="100%"
    style="margin: 0; padding: 0 !important; background-color: #f1f1f1"
  >
    <div style="max-width: 600px; margin: 0 auto" class="email-container">
      <!-- BEGIN BODY -->
      <table
        role="presentation"
        cellspacing="0"
        cellpadding="0"
        width="100%"
        style="margin: auto"
      >
        <tr>
          <td valign="top" class="bg_white" style="padding: 1em 2.5em 0 2.5em">
            <table
              role="presentation"
              cellpadding="0"
              cellspacing="0"
              width="100%"
            >
              <tr>
                <td class="logo" style="text-align: center">
                  <h1><a href="#">Welcome ${name}</a></h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- end tr -->
        <tr>
          <td
            valign="middle"
            class="hero bg_white"
            style="padding: 2em 0 4em 0"
          >
            <table>
              <tr>
                <td>
                  <div
                    class="text"
                    style="padding: 0 2.5em; text-align: center"
                  >
                    <h2>${heading}</h2>
                    <h3>${text1}</h3>
                    <h3><a href="${link}">Press to open reset password page</a></h3>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
  `;
};

exports.contactUsTemplate = (heading, fullName, query, email) => {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive Email Template</title>
</head>
<body style="font-family: 'Poppins', Arial, sans-serif">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center" style="padding: 20px;">
                <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                    <!-- Header -->
                    <tr>
                        <td class="header" style="background-color: #345C72; padding: 40px; text-align: center; color: white; font-size: 24px;">
                        ${heading}
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td class="body" style="padding: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                        Hello, ${heading} <br>
                        AOA! My name is <b>${fullName}</b>, Here is my query please!.
                        <br><br>
                        <b>${query}</b>           
                        </td>
                    </tr>

                    <!-- Call to action Button -->
                    <tr>
                        <td style="padding: 0px 40px 0px 40px; text-align: center;">
                            <!-- CTA Button -->
                            <table cellspacing="0" cellpadding="0" style="margin: auto;">
                                <tr>
                                    <td align="center" style="background-color: #345C72; padding: 10px 20px; border-radius: 5px;">
                                        <a href="${email}" target="_blank" style="color: #ffffff; text-decoration: none; font-weight: bold;">My email address</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="body" style="padding: 40px; text-align: center; font-size: 16px; line-height: 1.6;">
                            ${email}             
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td class="footer" style="background-color: #333333; padding: 40px; text-align: center; color: white; font-size: 14px;">
                        Copyright &copy; 2024 | Your brand name
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
};

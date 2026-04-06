import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const getMailOptions = (toEmail, url, subject) => ({
  from: process.env.EMAIL_FROM,
  to: toEmail,
  subject: subject,
  html: `
    <h2>Welcome to our app!</h2>
    <p>Click the link below to verify your email:</p>
    <a href="${url}">Verify Email</a>
  `,
});

export const sendVerificationEmail = async (
  toEmail,
  url,
  subject = "Verify Your Email",
) => {
  try {
    await transporter.sendMail(getMailOptions(toEmail, url, subject));
    console.log("Verification email sent successfully!");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Email not sent");
  }
};

// working v1
// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// const getMailOptions = (to, token) => ({
//   from: process.env.EMAIL_FROM,
//   to: to,
//   subject: "Verify Your Email",
//   html: `
//     <h2>Welcome to our app!</h2>
//     <p>Click the link below to verify your email:</p>
//     <a href="http://127.0.0.1:3001/api/v1/auth/verify-email/${token}">Verify Email</a>
//   `,
// });

// export const sendVerificationEmail = async (userEmail, token) => {
//   try {
//     await transporter.sendMail(getMailOptions(userEmail, token));
//     console.log("Verification email sent successfully!");
//   } catch (error) {
//     console.error("Error sending verification email:", error);
//     throw new Error("Email not sent");
//   }
// };

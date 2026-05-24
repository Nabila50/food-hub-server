import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Food Hub" <foodhub@fh.com>', // sender address
          to: user.email, // list of recipients
          subject: "Food Hub Email Verification", // subject line
          text: "Welcome to Our Food Hub.", // plain text body

          html: `<!DOCTYPE html>
                  <html>
                    <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Email Verification</title>
                  </head>
                  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:40px 0;">
                      <tr>
                        <td align="center">
                          <table width="600" cellpadding="0" cellspacing="0" 
                            style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.1);">

                            <!-- Header -->
                            <tr>
                              <td align="center" 
                                style="background-color:#ff6b35; padding:30px; color:white;">
                                <h1 style="margin:0; font-size:28px;">🍔 Food Hub</h1>
                              </td>
                            </tr>

                            <!-- Content -->
                            <tr>
                              <td style="padding:40px 30px; color:#333333;">
                                <h2 style="margin-top:0;">hi ${user.name}</h2>

                                <p style="font-size:16px; line-height:1.6;">
                                  Welcome to <strong>Food Hub</strong>!  
                                  Thank you for signing up.
                                </p>

                                <p style="font-size:16px; line-height:1.6;">
                                  Please click the button below to verify your email address and activate your account.
                                </p>

                                <!-- Button -->
                                <table cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                    <td align="center" style="padding:30px 0;">
                                      <a href="${verificationUrl}"
                          style="
                            background-color:#ff6b35;
                            color:#ffffff;
                            text-decoration:none;
                            padding:14px 28px;
                            border-radius:6px;
                            font-size:16px;
                            font-weight:bold;
                            display:inline-block;
                          ">
                          Verify Email
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size:14px; color:#666666; line-height:1.6;">
                    If the button doesn't work, copy and paste this link into your browser:
                  </p>

                  <p style="word-break:break-all; font-size:14px; color:#ff6b35;">
                    ${verificationUrl}
                  </p>

                  <p style="font-size:14px; color:#666666; margin-top:30px;">
                    If you didn’t create an account, you can safely ignore this email.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center"
                  style="background-color:#f8f8f8; padding:20px; font-size:12px; color:#999999;">
                  © ${new Date().getFullYear()} Food Hub. All rights reserved.
                </td>
              </tr>

            </table>
              </td>
                </tr>
            </table>
              </body>
          </html>`,
        });

        console.log("Message sent: ", info.messageId);
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  },

  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline", 
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});

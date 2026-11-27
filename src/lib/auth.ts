import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins"
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "./email";
// import { sendEmail } from "./email"; // your email sending function

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    throw new Error("Unable to connect database")
}

const client = new MongoClient(mongoUri);

// Establish MongoDB connection
await client.connect();

const db = client.db("studio_space");



const githubClientID = process.env.GITHUB_CLIENT_ID;
const githubClientSECRET = process.env.GITHUB_CLIENT_SECRET;

const googleClientID = process.env.GOOGLE_CLIENT_ID;
const googleClientSECRET = process.env.GOOGLE_CLIENT_SECRET;

const authBaseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";


export const auth = betterAuth({

    baseURL: authBaseURL,

    database: mongodbAdapter(db, {
        client,
    }),

    //...other options
    emailAndPassword: {
        enabled: true,

        // Reset link expires after 15 minutes
        resetPasswordTokenExpiresIn: 15 * 60,

        // Revoke existing sessions after password reset
        revokeSessionsOnPasswordReset: true,

        sendResetPassword: async ({ user, url, token }, request) => {
            void sendEmail({
                to: user.email,
                subject: "Reset your StudioSpace password",
                html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Reset Your Password</title>
        </head>

        <body style="
          margin: 0;
          padding: 0;
          background-color: #f4f4f5;
          font-family: Arial, Helvetica, sans-serif;
        ">
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="background-color: #f4f4f5; padding: 40px 15px;"
          >
            <tr>
              <td align="center">

                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    max-width: 480px;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                  "
                >

                  <!-- Logo -->
                  <tr>
                    <td align="center" style="padding: 35px 30px 20px;">
                      <img
                        src="https://localhost:3000/images/studiospace-logo.png"
                        alt="StudioSpace"
                        width="160"
                        style="
                          display: block;
                          width: 160px;
                          max-width: 100%;
                          height: auto;
                          border: 0;
                        "
                      />
                    </td>
                  </tr>

                  <!-- Email Content -->
                  <tr>
                    <td style="padding: 10px 35px 35px;">

                      <h2 style="
                        margin: 0 0 18px;
                        color: #18181b;
                        font-size: 24px;
                        text-align: center;
                      ">
                        Reset Your Password
                      </h2>

                      <p style="
                        margin: 0 0 15px;
                        color: #52525b;
                        font-size: 15px;
                        line-height: 1.7;
                      ">
                        Hello ${user.name || "there"},
                      </p>

                      <p style="
                        margin: 0 0 25px;
                        color: #52525b;
                        font-size: 15px;
                        line-height: 1.7;
                      ">
                        We received a request to reset your StudioSpace
                        account password. Click the button below to create
                        a new password.
                      </p>

                      <!-- Reset Button -->
                      <table
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        align="center"
                        style="margin: 0 auto 25px;"
                      >
                        <tr>
                          <td
                            align="center"
                            bgcolor="#18181b"
                            style="border-radius: 6px;"
                          >
                            <a
                              href="${url}"
                              target="_blank"
                              style="
                                display: inline-block;
                                padding: 14px 28px;
                                color: #ffffff;
                                font-size: 15px;
                                font-weight: bold;
                                text-decoration: none;
                                border-radius: 6px;
                              "
                            >
                              Reset Password
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="
                        margin: 0 0 15px;
                        color: #71717a;
                        font-size: 13px;
                        line-height: 1.7;
                      ">
                        If the button doesn't work, copy and paste the
                        following link into your browser:
                      </p>

                      <p style="
                        margin: 0 0 25px;
                        word-break: break-all;
                        font-size: 12px;
                        line-height: 1.6;
                      ">
                        <a
                          href="${url}"
                          style="color: #2563eb; text-decoration: underline;"
                        >
                          ${url}
                        </a>
                      </p>

                      <p style="
                        margin: 0;
                        color: #71717a;
                        font-size: 13px;
                        line-height: 1.7;
                      ">
                        If you didn't request a password reset, you can
                        safely ignore this email. Your password will remain
                        unchanged.
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td
                      align="center"
                      style="
                        padding: 20px 30px;
                        background-color: #fafafa;
                        border-top: 1px solid #e4e4e7;
                      "
                    >
                      <p style="
                        margin: 0;
                        color: #a1a1aa;
                        font-size: 12px;
                        line-height: 1.6;
                      ">
                        © ${new Date().getFullYear()} StudioSpace.
                        All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>
        </body>
      </html>
    `
            });
        },
        onPasswordReset: async ({ user }, request) => {
            // your logic here
            console.log(`Password for user ${user.email} has been reset.`);
        },
    },
    socialProviders: {
        ...(githubClientID && githubClientSECRET
            ? {
                github: {
                    clientId: githubClientID,
                    clientSecret: githubClientSECRET
                }
            } : {}
        ),

        ...(googleClientID && googleClientSECRET
            ? {
                google: {
                    clientId: googleClientID,
                    clientSecret: googleClientSECRET
                }
            } : {}
        )
    },

    plugins: [
        jwt({
            disableSettingJwtHeader: true,
            jwt: {
                issuer: authBaseURL,
                audience: authBaseURL,
                // Express uses the signed subject, not profile data.
                definePayload: () => ({}),
            },
        }),
        nextCookies()
    ],

    session: {
        cookieCache: {
            enabled: true,
            strategy: "jwt",
            maxAge: 7 * 24 * 60 * 60,
        }
    }
});

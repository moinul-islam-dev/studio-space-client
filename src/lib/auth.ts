import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins"
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    throw new Error("Unable to connect database")
}

const client = new MongoClient(mongoUri);
const db = client.db("sport_nest_db");



const githubClientID = process.env.GITHUB_CLIENT_ID;
const githubClientSECRET = process.env.GITHUB_CLIENT_SECRET;

const googleClientID = process.env.GOOGLE_CLIENT_ID;
const googleClientSECRET = process.env.GOOGLE_CLIENT_SECRET;



export const auth = betterAuth({

    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000", //different from docs

    database: mongodbAdapter(db, {
        client,
    }),

    //...other options
    emailAndPassword: {
        enabled: true,
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
        jwt(),
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
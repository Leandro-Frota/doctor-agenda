import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import * as schema from "@/db/schema"; // your schema file
 
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural:true,
        schema // or "mysql", "sqlite"
    }),
    user: {
        modelName: "usersTable" // your user table name
    },
    session: {
        modelName: "sessionsTable" // your session table name
        // you can add more session options here
    },
    account: {
        modelName: "accountsTable" // your account table name
    },
    verification: {
        modelName: "verificationsTable" // your verification table name)
    },
    emailAndPassword: {
        enabled: true, // require email verification for email and password sign up
    }
});
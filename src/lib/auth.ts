import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
 
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural:true // or "mysql", "sqlite"
    }),
    users: {
        table: "usersTable" // your user table name
    },
    sessions: {
        table: "sessionsTable" // your session table name
        // you can add more session options here
    },
    accounts: {
        table: "accountsTable" // your account table name
    },
    verifications: {
        table: "verificationsTable" // your verification table name)
    },
});
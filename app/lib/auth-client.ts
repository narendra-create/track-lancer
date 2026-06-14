import { createAuthClient } from "better-auth/react";

if (!process.env.BETTER_AUTH_URL) {
    throw new Error("Need better auth url - frontend url")
}

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL
})
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

// Notice this is only an object, not a full Auth.js instance
let user = null;

export default {
    providers: [
        Credentials({
            authorize: async (credentials) => {

                console.log("hola")
                console.log(credentials)
                return credentials
            },
        }),
    ],
} satisfies NextAuthConfig
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// Add the allowed emails array
const allowedEmails = [
  "cochard.jeremy@gmail.com",    // Replace with your email
  "traqueanhh2602@gmail.com"  // Replace with your partner's email
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  })],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    // Add authorization callback
    authorized: ({ auth }) => {
      return allowedEmails.includes(auth?.user?.email ?? "")
    },
    // Prevent sign in if email not in allowed list
    signIn: ({ user }) => {
      return allowedEmails.includes(user.email ?? "")
    }
  }
})
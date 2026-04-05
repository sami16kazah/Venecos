import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email }).select('+password -__v');
        if (!user || (!user.password && user.provider !== 'credentials')) {
          throw new Error("Invalid credentials");
        }

        if (user.password) {
            const isMatch = await bcrypt.compare(credentials.password, user.password);
            if (!isMatch) {
              throw new Error("Invalid credentials");
            }
        }
        
        if (user.isEmailVerified === false) {
           throw new Error("Email not verified. Please check your inbox for the verification link.");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.roles[0],
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectToDatabase();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          // Redirect to signup with Google info pre-filled
          const email = encodeURIComponent(user.email || '');
          const name = encodeURIComponent(user.name || '');
          return `/signup?googleEmail=${email}&googleName=${name}`;
        }
        return true;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      
      // Always sync from DB to handle role updates without manual logout
      if (token?.email) {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.role = dbUser.roles[0] || "client";
          token.id = dbUser._id.toString();
          token.phoneNumber = dbUser.phoneNumber || "";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).phoneNumber = token.phoneNumber || "";
      }
      return session;
    }
  },
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

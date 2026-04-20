import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export type UserType = "admin" | "franchisee";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      userType: UserType;
    };
  }
  interface User {
    userType?: UserType;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
        userType: { label: "유형", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email as string;
        const password = credentials.password as string;
        const requestedType = (credentials.userType as string) || "admin";

        if (requestedType === "franchisee") {
          const user = await prisma.franchisee.findUnique({ where: { email } });
          if (!user) return null;
          const ok = await bcrypt.compare(password, user.password);
          if (!ok) return null;
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            userType: "franchisee" as const,
          };
        }

        // default: admin
        const user = await prisma.adminUser.findUnique({ where: { email } });
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: "admin" as const,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.userType = (user.userType ?? "admin") as UserType;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.userType = token.userType as UserType;
      }
      return session;
    },
  },
});

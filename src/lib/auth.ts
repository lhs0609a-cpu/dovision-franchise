import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export type UserType = "admin" | "franchisee";
export type AdminRole =
  | "SUPER_ADMIN"
  | "SUPERVISOR"
  | "SALES"
  | "EDUCATION"
  | "FINANCE"
  | "ADMIN";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      userType: UserType;
      role?: AdminRole;
      assignedRegions?: string[];
    };
  }
  interface User {
    userType?: UserType;
    role?: AdminRole;
    assignedRegions?: string[];
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

        const user = await prisma.adminUser.findUnique({ where: { email } });
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: "admin" as const,
          role: user.role as AdminRole,
          assignedRegions: user.assignedRegions ?? [],
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
        if (user.userType === "admin") {
          token.role = user.role ?? "ADMIN";
          token.assignedRegions = user.assignedRegions ?? [];
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.userType = token.userType as UserType;
        if (session.user.userType === "admin") {
          session.user.role = (token.role as AdminRole) ?? "ADMIN";
          session.user.assignedRegions =
            (token.assignedRegions as string[]) ?? [];
        }
      }
      return session;
    },
  },
});

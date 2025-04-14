import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "../../../lib/prisma"
import bcrypt from "bcryptjs"

// Add type augmentation for the User object
declare module "next-auth" {
  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    password?: string | null;
  }
  
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    }
  }
}

// Function to create a General folder for users
// Using a type-safe approach to avoid Prisma client typings issues
async function ensureGeneralFolder(userId: string) {
  // Check if the user already has a General folder
  const existingFolder = await prisma.$queryRaw`
    SELECT * FROM "Folder" 
    WHERE "userId" = ${userId} AND "name" = 'General' 
    LIMIT 1
  `;
  
  // If no folder exists, create one
  if (!Array.isArray(existingFolder) || existingFolder.length === 0) {
    await prisma.$executeRaw`
      INSERT INTO "Folder" ("id", "name", "description", "userId", "createdAt", "updatedAt") 
      VALUES (
        gen_random_uuid(), 
        'General', 
        'Default folder for your prompts', 
        ${userId},
        NOW(),
        NOW()
      )
    `;
    return { id: 'new-folder', name: 'General' };
  }
  
  return existingFolder[0];
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          throw new Error("Invalid email or password")
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Invalid email or password")
        }

        return user
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  events: {
    async createUser({ user }) {
      // Create a General folder for new users
      await ensureGeneralFolder(user.id);
    },
    async signIn({ user }) {
      // Ensure the user has a General folder
      await ensureGeneralFolder(user.id);
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/',
    error: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions)

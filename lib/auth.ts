/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "./prisma";


export const config: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Invalid credentials");
        }

        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        console.log("✅ User authenticated in authorize():", user); // <-- Must log
        return {
            id: user.id.toString(), // <-- Convert `_id` (ObjectId) to string
            email: user.email,
            name: user.name,
            image: user.image,
          };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
  },
  pages: {
    signIn: '/login',
    newUser: '/register',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { accounts: true },
          });
  
          if (existingUser) {
              // If the existing user does not have a Google account linked, update it
              if (!existingUser.googleId) {
                await prisma.user.update({
                  where: { email: user.email! },
                  data: { googleId: profile?.sub }, // Store Google ID
                });
              }
                // Check if the account already exists
              const googleAccount = existingUser.accounts.find(
                (acc) => acc.provider === "google"
              );

              if (!googleAccount) {
                // Create the missing account entry
                await prisma.account.create({
                  data: {
                    userId: existingUser.id,
                    provider: "google",
                    providerAccountId: account.providerAccountId, // Google's unique ID
                    type: "oauth",
                  },
                });
              }
          } else {
            // User does not exist, create user and account in one transaction
            await prisma.$transaction(async (prisma) => {
              const newUser = await prisma.user.create({
                data: {
                  name: user.name!,
                  email: user.email!,
                  googleId: profile?.sub,
                  image: profile?.picture,
                },
              });

              await prisma.account.create({
                data: {
                  userId: newUser.id,
                  provider: "google",
                  providerAccountId: account.providerAccountId,
                  type: "oauth",
                },
              });
            });
          }
      }
      return true;
    },
    async jwt({ user, trigger, session, token }: any) {
        if (user) {
          token.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
         }
        if (trigger === 'update' && session) {
          token.user = {
            ...token.user,
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
          }
        }
        return token
      },
    async session({ session, token, user }: any) {
        if (token) {
            session.user = token.user
        } else {
            session.user = {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
            }
        }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
  } = NextAuth(config);
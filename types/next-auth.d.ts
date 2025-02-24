import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: { 
        id?: string
        name?: string
        email?: string
        image?: string
    } & DefaultSession["user"];
  }

  export interface User extends DefaultUser {
    id?: string
    name?: string
    email?: string
    image?: string
  }
}
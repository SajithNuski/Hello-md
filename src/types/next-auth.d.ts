import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      login?: string;
      githubId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    login?: string;
    githubId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    encToken?: string;
    githubId?: string;
    login?: string;
  }
}

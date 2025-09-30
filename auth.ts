import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login, me, refresh } from "./services/actions/auth-actions";
import { UserInfo } from "./lib/definitions";
import { jwtDecode } from "jwt-decode";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const response = await login({
          email: credentials.email as string,
          password: credentials.password as string,
        });

        if (response.status === "error") {
          console.log("Invalid credentials.");
          return null;
        }
        const { access_token } = response.data;
        if (!access_token) {
          console.error("Token not found in response data");
          return null;
        }
        return { access_token: access_token };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      if (!isLoggedIn) {
        return false;
      }
      const pathname = nextUrl.pathname;
      const adminRoutes = sidebarLinks
        .filter((link) => link.role === "admin")
        .map((link) => link.url);

      const isAdminRoute = adminRoutes.some((route) =>
        pathname.startsWith(route)
      );
      if (isAdminRoute) {
        const roles: string[] =
          auth.user.user_info?.roles?.map((r) => r.name) ?? [];
        if (!roles.includes("admin")) {
          return Response.redirect(new URL("/", nextUrl));
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        console.log("User signed in.");
        token.access_token = user.access_token;
        const response = await me(token.access_token);
        if (response.status === "error") throw response;
        token.user_info = response.data;
        return token;
      }

      // Refresh
      const { exp } = jwtDecode(token.access_token);
      if (Date.now() < (exp ?? 0) * 1000) {
        // console.log("Valid access token .");
        return token;
      }
      const response = await refresh(token.access_token);
      if (response.status === "error") {
        // console.log("Invalid access token.");
        return { ...token, error: "RefreshAccessTokenError" };
      }
      console.log("Access token refreshed.");
      return { ...token, access_token: response.data.access_token };
    },
    async session({ session, token }) {
      session.user.error = token.error;
      session.user.access_token = token.access_token;
      session.user.user_info = token.user_info;
      return session;
    },
  },
});

declare module "next-auth" {
  interface User {
    access_token: string;
    error?: "RefreshAccessTokenError";
    user_info?: UserInfo;
  }

  interface Session {
    user: User;
  }
}
/* eslint-disable @typescript-eslint/no-unused-vars */
import { JWT } from "next-auth/jwt";
import { sidebarLinks } from "./lib/placeholder";
declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    error?: "RefreshAccessTokenError";
    user_info?: UserInfo;
  }
}

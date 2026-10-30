import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ token, req }) => {
      if (!token) return false;

      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token.role === "ADMIN";
      }

      if (req.nextUrl.pathname.startsWith("/client")) {
        return token.role === "CLIENT";
      }

      return true;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/client/:path*"],
};

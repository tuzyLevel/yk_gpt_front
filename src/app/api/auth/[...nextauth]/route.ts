// app/api/auth/[...nextauth]/route.js
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axiosInstance from "@/utils/axiosInstance";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      // 허용된 이메일인지 확인
      const { email } = user;
      if (!email) return false;

      try {
        const res = await axiosInstance.post("/user", { email });

        const data = await res.data;

        if (!data.existed) {
          console.error("API error:", data.message);
          return false; // 로그인 거부
        }
      } catch (error) {
        console.error("API error:", error);
        return false; // 로그인 거부
      }

      return true; // 로그인 허용
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

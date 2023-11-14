import { PrismaAdapter } from "@auth/prisma-adapter";
import nextAuth, { AuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";

import { prisma } from "@/db";

export const maxDuration = 150; 

export const authOptions: AuthOptions = {
	adapter: PrismaAdapter(prisma) as AuthOptions["adapter"],
	providers: [
		KakaoProvider({
			clientId: process.env.KAKAO_CLIENT_ID!,
			clientSecret: process.env.KAKAO_CLIENT_SECRET!,
		}),
	],
	pages: {
		signIn: "/landing",
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		session: ({ session, token }) => {
			return {
				...session,
				user: {
					...session.user,
					id: token.id,
					randomKey: token.randomKey,
				},
			};
		},
		jwt: ({ token, user }) => {
			if (user) {
				const u = user as unknown as any;
				return {
					...token,
					id: u.id,
					randomKey: u.randomKey,
				};
			}
			return token;
		},
	},
};

const handler = nextAuth(authOptions);

export { handler as GET, handler as POST };

import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { Backend_URL } from "@/lib/constants";

const backendAuthBaseUrl =
	process.env.BACKEND_URL_INTERNAL || Backend_URL || "";

async function refreshToken(token: JWT): Promise<JWT> {
	try {
		const res = await fetch(`${backendAuthBaseUrl}/auth/refresh`, {
			method: "POST",
			headers: {
				"x-refresh": `${token.backendTokens.refreshToken}`,
			},
		});

		if (!res.ok) {
			throw new Error("Failed to refresh token");
		}
		const response = await res.json();

		return {
			...token,
			backendTokens: response,
		};
	} catch {
		// throw new Error("Failed to refresh token");
		return {
			...token,
			error: "RefreshAccessTokenError",
			backendTokens: {
				accessToken: "",
				expiresIn: 0,
				refreshToken: "",
				message: "Failed to refresh token",
			},
		};
	}
}

export const authOptions: NextAuthOptions = {
	secret: process.env.AUTH_SECRET,
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/signin",
	},
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {},
				password: {},
			},
			async authorize(credentials, req) {
				try {
					if (!credentials?.email || !credentials?.password) return null;
					if (!backendAuthBaseUrl) return null;
					const { email, password } = credentials;
					const res = await fetch(`${backendAuthBaseUrl}/auth/login`, {
						method: "POST",
						body: JSON.stringify({
							email,
							password,
						}),
						headers: {
							"Content-Type": "application/json",
						},
					});

					if (res.status !== 200) {
						// let result = await res.json()
						// console.log('Login failed:', res);
						// console.error('Login failed:', credentials);
						// console.log('Login failed:', result);
						return null;
					}

					const user = await res.json();
					// console.log('User data:', user);

					return user;
				} catch {
					// console.error("Error during login:", error);
					return null;
				}
			},
		}),
	],

	callbacks: {
		async jwt({ token, user, session, trigger }) {
			if (trigger === "update") {
				token.user = {
					...token?.user,
					first_name: session?.user?.first_name,
					last_name: session?.user?.last_name,
					email: session?.user?.email,
				};
			}
			if (user) return { ...token, ...user };

			if (new Date().getTime() < token.backendTokens.expiresIn) return token;

			return await refreshToken(token);
		},

		async session({ token, session }) {
			session.user = token.user;
			session.backendTokens = token.backendTokens;
			return session;
		},
	},
};

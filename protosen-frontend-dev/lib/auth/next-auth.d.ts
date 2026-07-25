import NextAuth from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			email: string;
			first_name: string;
			last_name: string;
			role: string;
			organismId: string;
			accessGroupId: string;
			organism: {
				id: string;
				institutionType: string;
				code: string;
				libelle: string;
				service: string;
				status: string;
				createdAt: string;
				updatedAt: string;
			};
			accessGroup: {
				id: string;
				name: string;
				permissions: string[];
				createdAt: string;
				updatedAt: string;
			};
		};

		backendTokens: {
			accessToken: string;
			refreshToken: string;
			expiresIn: number;
			message: string;
		};
	}
}

import { type DefaultJWT, JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		user: {
			id: string;
			email: string;
			first_name: string;
			last_name: string;
			role: string;
			organismId: string;
			accessGroupId: string;
			organism: {
				id: string;
				institutionType: string;
				code: string;
				libelle: string;
				service: string;
				status: string;
				createdAt: string;
				updatedAt: string;
			};
			accessGroup: {
				id: string;
				name: string;
				permissions: string[];
				createdAt: string;
				updatedAt: string;
			};
		};
		error?: "RefreshAccessTokenError" | (string & {});
		backendTokens: {
			accessToken: string;
			refreshToken: string;
			expiresIn: number;
			message: string;
		};
	}
}

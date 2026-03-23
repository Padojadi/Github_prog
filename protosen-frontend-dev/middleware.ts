// export { default } from "next-auth/middleware";
// https://next-auth.js.org/configuration/nextjs#advanced-usage

import { NextResponse } from "next/server";
import { type NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { hasPermission } from "./lib/utils";

export default withAuth(
	// 'withAuth' augments your 'Request' with the user's token.

	function middleware(req: NextRequestWithAuth) {
		const isAdmin = req.nextauth.token?.user.role === "admin";
		const isSuperAdmin = req.nextauth.token?.user.role === "super_admin";
		const user = req.nextauth.token?.user;
		if (req.nextauth.token?.error === "RefreshAccessTokenError") {
			return NextResponse.redirect(new URL("/signin", req.nextUrl));
		}
		if (req.nextUrl.pathname.startsWith("/panel/users") && !isSuperAdmin) {
			return NextResponse.rewrite(new URL("/panel/unauthorized", req.nextUrl));
		}

		if (
			req.nextUrl.pathname.endsWith("/validate") &&
			!isAdmin &&
			!isSuperAdmin
		) {
			return NextResponse.rewrite(new URL("/panel/unauthorized", req.nextUrl));
		}

		if (
			req.nextUrl.pathname.includes("/panel/dashboard") &&
			!isAdmin &&
			!isSuperAdmin
		) {
			return NextResponse.rewrite(new URL("/panel/unauthorized", req.nextUrl));
		}

		if (
			req.nextUrl.pathname.startsWith("/panel/conferences") &&
			!hasPermission(user?.accessGroup.permissions || [], [
				"ACCESS_CONFERENCE_MODULE",
			])
		) {
			return NextResponse.rewrite(new URL("/panel/unauthorized", req.nextUrl));
		}

		if (
			req.nextUrl.pathname.startsWith("/panel/vip-lounge") &&
			!hasPermission(user?.accessGroup.permissions || [], [
				"ACCESS_VIP_LOUNGE_MODULE",
			])
		) {
			return NextResponse.rewrite(new URL("/panel/unauthorized", req.nextUrl));
		}

		if (
			req.nextUrl.pathname.startsWith("/panel/diplomatic") &&
			!hasPermission(user?.accessGroup.permissions || [], [
				"ACCESS_CARD_MODULE",
			])
		) {
			return NextResponse.rewrite(new URL("/panel/unauthorized", req.nextUrl));
		}

		if (
			req.nextUrl.pathname.startsWith("/panel/missions") &&
			!isAdmin &&
			!isSuperAdmin
		) {
			return NextResponse.rewrite(new URL("/panel/unauthorized", req.nextUrl));
		}

		if (req.nextUrl.pathname.startsWith("/panel/others") && !isSuperAdmin) {
			return NextResponse.rewrite(new URL("/panel/unauthorized", req.nextUrl));
		}

		if (req.nextUrl.pathname.startsWith("/panel/settings") && !isSuperAdmin) {
			return NextResponse.rewrite(new URL("/panel/unauthorized", req.nextUrl));
		}
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
	},
);

export const config = {
	matcher: [
		"/panel/dashboard",
		"/panel/users/:path*",
		"/panel/visas/:path*",
		"/panel/exemptions/:path*",
		"/panel/conferences/:path*",
		"/panel/vip-lounge/:path*",
		"/panel/registrations/:path*",
		"/panel/missions/:path*",
		"/panel/diplomatic/:path*",
		"/panel/others/:path*",
		"/panel/settings/:path*",
	],
};

import { createStore } from "@xstate/store";

const deployEnv: "dev" | "prod" =
	(process.env.NEXT_PUBLIC_DEPLOY_ENV as "dev" | "prod") || "prod";

export const featureFlagStore = createStore({
	context: {
		diplomaticCard: {
			key: "diplomatic-card",
			enabled: true,
			allowedUsers: [] as string[],
		},
		conferences: {
			key: "conferences",
			enabled: deployEnv === "dev",
			allowedUsers: [] as string[],
		},
	},
	on: {},
});

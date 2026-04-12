"use client";

import React from "react";
import IdCardBackRenewReturned from "./id-card-back-renew-returned";
import IdCardFrontRenewReturned from "./id-card-front-renew-returned";
import type { IPersonCardInfos, IPersonCardInfosRenew } from "@/lib/types";
import { SystemSettings } from "@/features/settings/system-settings/types";
import { useSystemSettingsClient } from "@/features/settings/system-settings/hooks/use-system-settings";

export default function IdCardSectionRenewReturned({
	person,
	personRenew,
}: {
	person: IPersonCardInfos;
	personRenew: IPersonCardInfosRenew;
	}) {
	const { data: systemSettings } = useSystemSettingsClient();

	const settings = systemSettings?.data as SystemSettings;
	return (
		<>
			<div className="grid grid-cols-3 gap-5">
				<div className="col-span-2">
					<IdCardFrontRenewReturned person={person} personRenew={personRenew} settings={settings} />
					<IdCardBackRenewReturned person={person} personRenew={personRenew} settings={settings} />
				</div>
			</div>
		</>
	);
}

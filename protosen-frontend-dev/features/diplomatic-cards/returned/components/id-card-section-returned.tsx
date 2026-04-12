"use client"
import type { IPersonCardInfos } from "@/lib/types";
import IdCardBackReturned from "./id-card-back-returned";
import IdCardFontReturned from "./id-card-front-returned";
import { SystemSettings } from "@/features/settings/system-settings/types";
import { useSystemSettingsClient } from "@/features/settings/system-settings/hooks/use-system-settings";

export default function IdCardSectionReturned({
	person,
	}: {
	person: IPersonCardInfos;
	}) {
	const { data: systemSettings } = useSystemSettingsClient();

	const settings = systemSettings?.data as SystemSettings;
	return (
		<div className="grid grid-cols-3 gap-5">
			<div className="col-span-2">
				<IdCardFontReturned person={person} settings={settings} />
				<IdCardBackReturned person={person} settings={settings} />
			</div>
		</div>
	);
}

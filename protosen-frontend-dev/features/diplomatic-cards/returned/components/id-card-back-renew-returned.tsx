import { QRCodeSVG } from "qrcode.react";
import { convertDate } from "@/components/utils/utils";
import type { IPersonCardInfos, IPersonCardInfosRenew } from "@/lib/types";
import { SystemSettings } from "@/features/settings/system-settings/types";

const IdCardBackRenew = ({
	person,
	personRenew,
	settings,
}: {
	person: IPersonCardInfos;
	personRenew: IPersonCardInfosRenew;
	settings: SystemSettings;
}) => {
	return (
		<div className="mt-5 flex justify-center">
			<div
				style={{ backgroundColor: personRenew?.color || "#AEFCAC" }}
				id="idCardBack"
				className={`p-4 text-black min-w-[487.5626px] min-h-[306.144px] max-w-[488px] max-h-[307px]`}
			>
				<div className="flex justify-between">
					<QRCodeSVG
						value={`${person.firstName} ${person.lastName}`}
						height={60}
						width={60}
						bgColor="#00000000"
					/>
					<div className="text-right text-sm w-1/2">
						<p className="text-xs">
							{settings?.protocolDirectionName || "Direction du Protocole, des Conférences et de la Traduction"}
						</p>
					</div>
				</div>
				<div className="grid grid-cols-2 my-2">
					<div className="flex flex-col gap-4">
						<div>
							<p className="font-bold text-xs">Date de délivrance</p>
							<p className="text-[10px]">
								{convertDate( personRenew?.issueDate, "fr") ?? ""}
							</p>
						</div>
						<div>
							<p className="font-bold text-xs">Date d'expiration</p>
							<p className="text-[10px]">
								{convertDate( personRenew?.validUntil, "fr") ??
									""}
							</p>
						</div>
						<div>
							<p className="font-bold text-[10px]">Nationalité</p>
							<p className="text-xs">{person?.citizenship}</p>
						</div>
					</div>
					<div className="flex justify-center items-center">
						<img
							className="max-w-[228px] max-h-[128px]"
							src={settings?.directorSignature || "/images/sign_prot2.png"}
						/>
					</div>
				</div>
				<div>
					<p className="text-[10px] text-center">
						{personRenew?.description}
					</p>
				</div>
			</div>
		</div>
	);
};

export default IdCardBackRenew;

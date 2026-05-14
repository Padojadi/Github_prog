import { QrCode } from "lucide-react";
import QRCode from "qrcode.react";
import React from "react";

interface ParticipantBadgeProps {
	firstname: string;
	lastname: string;
	gender: string;
	organisation: string;
	jobTitle: string;
	code: string;
	avatarUrl: string;
	participantId: string;
}

export function ParticipantBadge({
	firstname,
	lastname,
	gender,
	organisation,
	jobTitle,
	code,
	avatarUrl,
	participantId,
}: ParticipantBadgeProps) {
	const BASE_URL =
		process.env.NODE_ENV === "development"
			? "http://localhost:3000"
			: "https://protosendev.gouv.sn";
	const qrCodeUrl = `${BASE_URL}/conferences/verify-ticket?participant=${participantId}&code=${code}`;

	return (
		<div className="w-[297px] h-[420px] mx-auto relative">
			{/* A6 Badge Container */}
			<div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden border-4 badge-border p-1">
				<div className="w-full h-full badge-gradient rounded-xl p-6 flex flex-col">
					{/* Header with Organization */}
					<div className="text-center mb-4">
						<h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
							{organisation}
						</h3>
						<div className="w-16 h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 mx-auto mt-2 rounded-full"></div>
					</div>

					{/* Avatar Section */}
					<div className="flex justify-center mb-4">
						<div className="relative">
							<div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
								<img
									src={avatarUrl}
									alt={`${firstname} ${lastname}`}
									className="w-full h-full object-cover"
									// onError={(e) => {
									//   const target = e.target as HTMLImageElement;
									//   target.src = `https://ui-avatars.com/api/?name=${firstname}+${lastname}&background=random&size=96`;
									// }}
								/>
							</div>
							<div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full flex items-center justify-center">
								<span className="text-white text-xs font-bold">
									{gender.charAt(0).toUpperCase()}
								</span>
							</div>
						</div>
					</div>

					{/* Name Section */}
					<div className="text-center mb-4">
						<h1 className="text-2xl font-bold text-gray-900 mb-1">
							{lastname} {firstname}
						</h1>
						<p className="text-lg text-gray-700 font-medium">{jobTitle}</p>
					</div>

					{/* Badge Code */}
					<div className="text-center mb-4">
						<div className="inline-block bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full">
							<span className="text-sm font-open-sans font-bold text-gray-800">
								N°: {code}
							</span>
						</div>
					</div>

					{/* QR Code Section */}
					<div className="flex-1 flex items-end justify-center">
						<div className="bg-white p-3 rounded-xl shadow-lg">
							<div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
								<QRCode value={qrCodeUrl} size={64} className="w-full h-full" />
							</div>
							{/* <p className="text-xs text-gray-600 text-center mt-2 font-mono">
                Scan QR
              </p> */}
						</div>
					</div>

					{/* Decorative Elements */}
					<div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full opacity-60"></div>
					<div className="absolute top-8 right-8 w-2 h-2 bg-yellow-400 rounded-full opacity-50"></div>
					<div className="absolute bottom-4 left-4 w-2 h-2 bg-red-400 rounded-full opacity-40"></div>
				</div>
			</div>
		</div>
	);
}

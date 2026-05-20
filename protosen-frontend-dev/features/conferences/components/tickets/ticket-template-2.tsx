import { cn } from "@/lib/utils";
import QRCode, { QRCodeSVG } from "qrcode.react";

type TicketTemplate1Props = {
  id: string;
  name: string;
  conferenceId: string;
  date: string;
  description: string;
  username: string;
  price: number;
  zoom: boolean;
  participantId?: string;
  code?: string;
  userImage?: string;
};
export function TicketTemplate2({
  name,
  description,
  price,
  date,
  username,
  zoom,
  participantId,
  code,
  userImage,
}: TicketTemplate1Props) {
  const BASE_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://protosendev.gouv.sn";
  const qrCodeUrl = `${BASE_URL}/conferences/verify-ticket?participant=${participantId}&code=${code}`;
  return (
    <div
      style={
        zoom
          ? {
              zoom: "55%",
            }
          : {}
      }
      className={cn(
        "bg-[#159967] isolate min-w-[320px] w-[800px] max-h-[300px] flex relative",
        zoom ? "" : "ticket-zoom"
      )}
    >
      {/* pattern left */}
      <img
        src="/images/conferences/tickets/ticket-2-left-pattern.png"
        className="absolute h-full w-[40px] left-0 -z-1"
        alt="decorations"
      />
      <div className="flex-1 pl-10">
        <div className="flex">
          {/* Full infos */}
          <div className="p-6 relative flex-1">
            <div className="z-20 relative">
              <h2 className="text-4xl sm:text-5xl font-londrina-solid text-center font-medium text-[#2F1111] max-w-xs truncate">
                {name}
              </h2>
              {price > 0 && (
                <div className="text-3xl sm:text-4xl font-londrina-solid text-center font-medium text-white mb-4 truncate">
                  {price} FCFA
                </div>
              )}

              <p className="text-xl font-rubik text-center font-semibold text-[#2F1111] mb-4 truncate">
                {date}
              </p>

              <p className="text-sm text-center text-white mb-4 font-rubik max-w-56 mx-auto line-clamp-3">
                {description}
              </p>

              {/* <div className="font-londrina-solid text-center font-medium text-white max-w-xs truncate">
                https://protosen.gouv.sn
              </div> */}
            </div>
          </div>
          {/* image section */}
          <div className="h-[300px] w-[250px] relative isolate justify-self-end ml-auto">
            <img
              src="/images/conferences/tickets/ticket-2-flower.png"
              className="absolute h-full w-[180px] -left-[70px] z-[2]"
              alt="decorations"
            />
            <img
              src="/images/conferences/tickets/ticket-2-image-container.png"
              className="absolute h-[300px] w-full top-0 bottom-0 right-3 z-0"
              alt="decorations"
            />
            <div className="w-[250px] overflow-hidden h-full">
              <div className="h-[300px] w-full relative">
                <img
                  src={
                    userImage ??
                    "/images/conferences/tickets/ticket-2-woman-img.png"
                  }
                  className="absolute top-0 right-0 w-full object-cover h-[300px]"
                  style={{
                    maskImage:
                      "url('/images/conferences/tickets/ticket-2-image-container-shape.png')",
                    maskSize: "cover",
                    maskPosition: "center",
                    maskRepeat: "no-repeat",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* shapes deco */}
      <img
        src="/images/conferences/tickets/ticket-2-shapes.png"
        className="absolute w-[40%] left-[10%] inset-y-4 h-[90%] -z-[1]"
        alt="decorations"
      />
      {/* qr code section */}
      <div className="h-[300px] w-[180px] ml-auto justify-self-end relative pl-5 pt-8 pr-5 bg-[#E8AE42]">
        <img
          src="/images/conferences/tickets/ticket-2-dashed-border.png"
          className="absolute h-[300px] w-[2px] left-0 top-0 bottom-0 -z-1"
          alt="decorations"
        />
        <div className="flex flex-col h-full">
          <div className="text-[#D24C50] font-londrina-solid text-right uppercase max-w-[7em] truncate ml-auto">
            {username}
          </div>
          <div className="ml-auto">
            <h1 className="text-3xl font-londrina-solid font-medium text-right text-[#2F1111] mb-2 max-w-[7em] truncate">
              {name}
            </h1>
          </div>
          {participantId && (
            <div className="w-[120px] h-[120px] ml-auto">
              <QRCodeSVG value={qrCodeUrl} className="w-full h-full" />
            </div>
          )}
          {code && (
            <div className="ml-auto">
              <p className="text-xs text-[#2F1111] font-rubik mt-3">
                No. <span className="uppercase">{code}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

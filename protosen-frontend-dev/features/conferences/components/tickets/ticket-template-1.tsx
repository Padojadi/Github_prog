import { cn } from "@/lib/utils";
import QRCode from "qrcode.react";

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
export function TicketTemplate1({
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
        "bg-[#E8AE42] isolate min-w-[320px] w-[800px] max-h-[300px] flex relative",
        zoom ? "" : "ticket-zoom"
      )}
    >
      {/* shapes deco */}
      <img
        src="/images/conferences/tickets/ticket-1-shapes.png"
        className="absolute h-full w-[80%] left-[10%] right-[9%] -z-1"
        alt="decorations"
      />
      {/* qr code section */}
      <div className="h-full mr-auto justify-self-start relative pl-5 pt-8 pr-8">
        <img
          src="/images/conferences/tickets/ticket-1-dashed-border.png"
          className="absolute h-[300px] w-[2px] right-0 top-0 bottom-0 -z-1"
          alt="decorations"
        />
        <div className="max-w-52">
          <div className="text-[#D24C50] font-londrina-solid uppercase max-w-32 truncate">
            {username}
          </div>
          <h1 className="text-3xl font-londrina-solid font-medium text-[#2F1111] mb-2 max-w-32 truncate">
            {name}
          </h1>

          {/* <p className="text-sm text-[#2F1111] font-rubik mb-6 max-w-32 line-clamp-3">
            {description}
          </p> */}

          {participantId && (
            <div className="w-[100px] h-[100px]">
              <QRCode value={qrCodeUrl} className="w-full h-full" />
            </div>
          )}
          {code && (
            <p className="text-xs text-[#2F1111] font-rubik mt-10 text-center">
              No. <span className="uppercase">{code}</span>
            </p>
          )}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex">
          {/* image section */}
          <div className="ml-4 h-[300px] relative isolate">
            <img
              src="/images/conferences/tickets/ticket-1-flower.png"
              className="absolute h-full w-full inset-0 z-[2]"
              alt="decorations"
            />
            <img
              src="/images/conferences/tickets/ticket-1-image-container.png"
              className="absolute h-[250px] w-full top-[10%] bottom-[5%] z-0"
              alt="decorations"
            />
            <div className="w-[200px] overflow-hidden h-full">
              <div className="h-[200px] w-full relative my-auto">
                <img
                  src={
                    userImage ??
                    "/images/conferences/tickets/ticket-1-woman-img.png"
                  }
                  className="absolute top-[12%] left-[2%] w-[190px] object-cover h-[250px]"
                  style={{
                    maskImage:
                      "url('/images/conferences/tickets/ticket-1-image-container-shape.png')",
                    maskSize: "cover",
                    maskPosition: "center",
                    maskRepeat: "no-repeat",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Full infos */}
          <div className="p-6 md:p-8 relative grow">
            <div className="z-20 relative w-full">
              <h2 className="text-4xl sm:text-5xl font-londrina-solid text-center font-medium text-[#2F1111] truncate">
                {name}
              </h2>
              {price > 0 && (
                <div className="text-3xl sm:text-4xl font-londrina-solid text-center font-medium text-[#D24C50] mb-4 truncate">
                  {price} FCFA
                </div>
              )}

              <p className="text-xl font-rubik text-center font-semibold text-[#2F1111] mb-4 truncate">
                {date}
              </p>

              <p className="text-sm text-center font-rubik text-[#2F1111] mb-4 max-w-56 mx-auto line-clamp-3">
                {description}
              </p>

              {/* <div className="font-londrina-solid text-center font-medium text-[#2F1111] truncate">
                https://protosen.gouv.sn
              </div> */}
            </div>
          </div>
        </div>
      </div>
      {/* pattern right */}
      <img
        src="/images/conferences/tickets/ticket-1-right-pattern.png"
        className="absolute h-full w-[40px] right-0 -z-1"
        alt="decorations"
      />
    </div>
  );
}

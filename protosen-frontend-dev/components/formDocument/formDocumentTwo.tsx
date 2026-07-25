import { IFormSections, IPerson } from "@/lib/types";
import { convertDateToLocalString } from "../utils/utils";

export default function FormDocumentTwo({
  person,
  formSections,
}: {
  person: IPerson;
  formSections: IFormSections[];
}) {
  return (
    <div className="bg-white p-6 mx-auto shadow-lg rounded w-full">
      <div className="space-y-6">
        {formSections.map((section, index) => (
          <div key={index} className="mb-4">
            <h2 className="bg-gray-200 text-lg font-bold p-2 mb-2">
              {section.title}
            </h2>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                {section.data.map((item, itemIndex) => (
                  <div key={itemIndex} className="space-y-1">
                    <h3 className="font-semibold">{item.label}</h3>
                    <p key={itemIndex} className="text-md">
                      {item.type === "date"
                        ? convertDateToLocalString(person[item.name], true)
                        : person[item.name]}
                    </p>
                  </div>
                ))}
                {section.supportingText && (
                  <p className="text-xs italic">{section.supportingText}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="border-t pt-4">
          <div className="grid grid-cols-3 gap-4 items-end">
            <div>
              <h3 className="font-semibold mb-2">Signature du titulaire</h3>
              <div className="h-24 border" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                Signature du chef de Mission
              </h3>
              <div className="h-24 border" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Photographie récente</h3>
              <p className="text-xs mb-2">Format 35x40 à COLLER</p>
              <div className="h-24 border flex justify-center">
                {person.photoLink && (
                  <img
                    src={person.photoLink}
                    alt="photoLink"
                    style={{ height: "80px" }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Fait à</h3>
              <p className="text-gray-300">-</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Date</h3>
              <p className="text-gray-300">-</p>
            </div>
          </div>
        </div>
        <div className="border-t pt-4">
          <h3 className="mb-2">Cadre réservé au Protocole</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="font-semibold">Dossier N°</h3>
                <p className="text-gray-300">-</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Date de réception</h3>
                <p className="text-gray-300">-</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-xs mt-6">
        <p>
          Formulaire à télécharger au{" "}
          <a className="underline" href="#">
            Consulat
          </a>{" "}
          et à photographier/scanner et{" "}
          <a className="underline" href="#">
            télécharger
          </a>
          .
        </p>
        <p>
          Direction des Protocoles des Conférences et de la Traduction - 2 Place
          de l'Indépendance BP 404 Dakar, Sénégal
        </p>
      </div>
    </div>
  );
}

import { IFormSections, ISubmitAction } from "@/lib/types";
import { fetchHolderCardById } from "@/lib/actions/diplomaticCards/holders";
import { convertDateToLocalString } from "../utils/utils";
import { RelatedFiles } from "../relatedFiles";
import SubmitForm from "./submitForm";

export default async function ReviewData({
  person,
  formSections,
  personDiplomaticCardIdInputName,
  personDiplomaticCardFilesPropName,
  prefixFileKey,
  onSubmitAction,
  onRenewAction,
  onDuplicateAction,
  onCreateDuplicateAction,
  backLink,
}: {
  person: any;
  formSections: IFormSections[];
  personDiplomaticCardIdInputName: string;
  personDiplomaticCardFilesPropName: string;
  prefixFileKey: string;
  onSubmitAction: ISubmitAction;
  onRenewAction?: ISubmitAction;
  onDuplicateAction?: ISubmitAction;
  onCreateDuplicateAction?: any
  backLink: string;
}) {
  // check if person has "ownerDiplomaticCardId" and fetch the holder card by id
  const id = person.ownerDiplomaticCardId;
  if (id) {
    const res = await fetchHolderCardById(id);
    let holder = res.data;
    person = {
      ...person,
      holderTitle: holder?.title,
      holderFileNumber: holder?.id,
      holderFirstName: holder?.firstName,
      holderLastName: holder?.lastName,
      holderCitizenship: holder?.citizenship,
    };
  }

  return (
    <div className="bg-white p-6 mx-auto shadow-lg rounded w-full">
      <div className="mb-6">
        <div>
          <h1 className="text-lg font-bold">VERIFICATION DES INFORMATIONS</h1>
        </div>
      </div>
      {formSections.map((section, index) => (
        <div key={index} className="mb-4">
          <h2 className="bg-gray-200 text-lg font-bold p-2 mb-2">
            {section.title}
          </h2>
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-4">
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
            </div>
          </div>
        </div>
      ))}
      <h2 className="bg-gray-200 text-lg font-bold p-2 mb-2">
        Fichiers associés
      </h2>
      <RelatedFiles
        addDeleteFeature={false}
        person={person}
        personDiplomaticCardIdInputName={personDiplomaticCardIdInputName}
        personDiplomaticCardFilesPropName={personDiplomaticCardFilesPropName}
        prefixFileKey={prefixFileKey}
      />
      <SubmitForm
        id={person.id}
        submitAction={onSubmitAction}
        renewAction={onRenewAction}
        duplicateAction={onDuplicateAction}
        createDuplicateAction={onCreateDuplicateAction}
        backLink={backLink}
      />
    </div>
  );
}

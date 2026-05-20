import { BsFileEarmarkText } from "react-icons/bs";

const FileInput = ({
  onChange,
  name,
  label,
  filesCount,
  multiple = false,
  required = false,
  accept = "",
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  multiple?: boolean;
  filesCount?: number;
  required?: boolean;
  accept?: string;
}) => {
  return (
    <div>
      <label
        htmlFor={"id-" + name}
        className="block text-sm font-medium text-gray-700"
      >
        {label || "Télécharger le fichier"}{" "}
        {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="-1 flex items-center">
        <div className="relative flex h-12 w-12 rounded-md overflow-hidden justify-center items-center bg-gray-100">
          <div className="absolute top-0 right-0 bg-red-500 text-white w-[15px] h-[15px] text-[10px] font-bold flex justify-center items-center rounded-full">
            {filesCount || 0}
          </div>
          <BsFileEarmarkText size={32} />
        </div>
        <input
          id={"id-" + name}
          name={name}
          type="file"
          className="sr-only"
          multiple={multiple}
          onChange={onChange}
          required={required}
          accept={accept}
        />
        <label
          htmlFor={"id-" + name}
          className="cursor-pointer ml-5 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {multiple ? "Sélectionner les fichiers" : "Sélectionner le fichier"}
        </label>
      </div>
    </div>
  );
};

export default FileInput;

import Link from "next/link";
import { BsCheck2All, BsEye, BsPencil, BsTrash } from "react-icons/bs";
import BadgeStatusComponent from "../ui/badgeStatusComponent";
import DeleteButton from "../deleteButton";

interface SimpleTableComponentProps {
  className?: string;
  title: string;
  headers: { label: string; code: string }[];
  data: { [key: string]: any }[];
  actions?: {
    label: "details" | "edit" | "delete" | "validate";
    href: string;
    customAction?: (id: string) => Promise<any>;
  }[];
}

const TableActionsComponent = ({
  actions,
  item,
}: {
  actions: {
    label: string;
    href: string;
    customAction?: (id: string) => Promise<any>;
  }[];
  item: { [key: string]: any };
}) => {
  // define icon base on label
  const getIcon = (label: string) => {
    switch (label) {
      case "validate":
        return <BsCheck2All size={20} />;
      case "details":
        return <BsEye size={20} />;
      case "edit":
        return <BsPencil size={20} />;
      case "delete":
        return <BsTrash size={20} />;
      default:
        return <BsEye size={20} />;
    }
  };
  return (
    <div className="flex justify-center space-x-2">
      {actions.map((action, index) => {
        if (action.label == "delete" && action.customAction) {
          return (
            <DeleteButton
              key={index}
              onDeleteAction={action.customAction}
              isDisabled={item?.role && item.role == "super_admin"}
              id={item.id}
            />
          );
        } else {
          return (
            <Link
              href={
                action.href +
                item.id +
                (action.label === "edit"
                  ? "/edit"
                  : action.label === "validate"
                  ? "/validate"
                  : "")
              }
              key={index}
              className={`btn ${
                action.label === "validate"
                  ? "bg-green-500 hover:bg-green-600"
                  : action.label === "details"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : action.label === "edit"
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : action.label === "delete"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-indigo-500 hover:bg-indigo-600"
              } text-white`}
            >
              {getIcon(action.label)}
            </Link>
          );
        }
      })}
    </div>
  );
};

const SimpleTableComponent: React.FC<SimpleTableComponentProps> = ({
  title,
  headers,
  data,
  actions,
  className,
}) => {
  return (
    <div
      className={`col-span-full xl:col-span-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 ${className}`}
    >
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto"></div>
        <table className="table-auto w-full dark:text-slate-300">
          {/* Table header */}
          <thead className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm">
            <tr>
              <th className="p-2 text-left">N°</th>
              {headers.map((header) => (
                <th className="p-2 text-left" key={header.code}>
                  <div className="font-semibold ">{header.label}</div>
                </th>
              ))}
              {actions && (
                <th className="p-2 text-left" key={"actions"}>
                  <div className="font-semibold ">{"Actions"}</div>
                </th>
              )}
            </tr>
          </thead>
          {/* Table body */}
          <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700">
            {/* Rows */}
            {(data as []) &&
              data.map((item, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 !== 0 && "bg-slate-50 dark:bg-slate-700"
                  }`}
                >
                  <td className="p-2">{index + 1}</td>
                  {headers.map((header) => (
                    <td className="p-2" key={header.code}>
                      {header.code == "status" ||
                      header.code == "documentStage" ? (
                        <BadgeStatusComponent status={item[header.code]} />
                      ) : typeof item[header.code] == "boolean" ? (
                        item[header.code] ? (
                          "Oui"
                        ) : (
                          "Non"
                        )
                      ) : (
                        item[header.code]
                      )}
                    </td>
                  ))}
                  {actions && (
                    <td>
                      {<TableActionsComponent actions={actions} item={item} />}
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SimpleTableComponent;

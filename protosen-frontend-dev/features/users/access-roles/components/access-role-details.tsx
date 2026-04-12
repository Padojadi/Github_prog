import { AccessRole } from "../types";

interface AccessRoleDetailsProps {
  accessRole: AccessRole;
}

export function AccessRoleDetails({ accessRole }: AccessRoleDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Nom:</h3>
        <p className="font-semibold text-foreground">{accessRole.name}</p>
      </div>
      <div className="space-y-2">
        <h3 className="text-muted-foreground">Permission:</h3>
        <ul className="list-disc pl-5">
          {accessRole.permissions.map((observation, index) => (
            <li
              key={`observation-${index}`}
              className="font-semibold text-foreground"
            >
              {observation}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import ButtonBase from "@mui/material/ButtonBase";
import Avatar from "@/components/ui/Avatar";
import Empty from "@/components/ui/Empty";
import { Users } from "lucide-react";
import type { OrgPerson } from "@/utils/types";

type ViewAsPickerProps = { people: OrgPerson[]; onPick: (userId: string) => void };

const ViewAsPicker = ({ people, onPick }: ViewAsPickerProps) => {
  if (people.length === 0) return <Empty icon={Users} text="No people in this organization yet." />;
  return (
    <div className="-mx-2 flex max-h-96 flex-col overflow-y-auto">
      <p className="mx-2 mb-2 text-sm text-muted">
        You&apos;ll see exactly what this person sees. Changes you make are real.
      </p>
      {people.map(({ id, name, roleName }) => (
        <ButtonBase
          key={id}
          onClick={() => onPick(id)}
          className="flex justify-start gap-3 rounded-xl px-2 py-2 text-left hover:bg-subtle"
        >
          <Avatar name={name} />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{name}</span>
            <span className="block truncate text-xs text-muted">{roleName}</span>
          </span>
        </ButtonBase>
      ))}
    </div>
  );
};

export default ViewAsPicker;

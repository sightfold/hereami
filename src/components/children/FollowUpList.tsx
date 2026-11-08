import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Phone } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import { followUpAfter } from "@/constants/children";
import { missedRun } from "@/utils/childScore";
import { childName } from "@/utils/children";
import type { Child, ChildMark, Service } from "@/utils/types";

type FollowUpListProps = { childList: Child[]; services: Service[]; marks: ChildMark[] };

const FollowUpList = ({ childList, services, marks }: FollowUpListProps) => {
  const missing = childList
    .map((child) => ({ child, missed: missedRun(child, services, marks) }))
    .filter((item) => item.missed >= followUpAfter)
    .toSorted((a, b) => b.missed - a.missed);

  if (missing.length === 0) return null;

  return (
    <Card className="mt-6">
      <h2 className="text-sm font-semibold">Follow up</h2>
      <p className="mb-3 text-xs text-muted">Missed {followUpAfter} or more services in a row.</p>
      <ul className="divide-y divide-line">
        {missing.map(({ child, missed }) => (
          <li key={child.id} className="flex items-center gap-3 py-2">
            <Avatar name={childName(child)} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{childName(child)}</p>
              <p className="truncate text-xs text-muted">
                Missed {missed} · {child.parentName ?? "No parent on file"}
              </p>
            </div>
            {child.parentPhone && (
              <Tooltip title={`Call ${child.parentPhone}`} arrow>
                <IconButton
                  component="a"
                  size="small"
                  href={`tel:${child.parentPhone}`}
                  aria-label={`Call the parent of ${childName(child)}`}
                >
                  <Phone className="size-4" />
                </IconButton>
              </Tooltip>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default FollowUpList;

import Link from "next/link";
import routePath from "@/constants/route.json";
import type { User } from "@/utils/types";

type WholeTeamProps = { members: User[] };

const WholeTeam = ({ members }: WholeTeamProps) => (
  <div className="flex flex-col gap-1.5 text-sm">
    <p className="text-muted">
      {members.length > 0
        ? `No roles, so all ${members.length} members serve every service.`
        : "No roles and no members yet."}
    </p>
    {members.length > 0 && <p>{members.map((user) => user.name).join(", ")}</p>}
    <Link href={routePath.Admin.Settings} className="text-xs text-muted underline">
      Add roles to roster people one by one
    </Link>
  </div>
);

export default WholeTeam;

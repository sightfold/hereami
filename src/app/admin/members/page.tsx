"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import MemberForm from "@/components/admin/MemberForm";
import PageHeader from "@/components/layout/PageHeader";
import PersonCard, { type Pill } from "@/components/people/PersonCard";
import Button from "@/components/ui/Button";
import { useConfirm } from "@/components/ui/ConfirmProvider";
import Sheet from "@/components/ui/Sheet";
import { adminRoleId } from "@/constants/permissions";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectCurrentUser,
  selectDepartmentNames,
  selectOrgName,
  selectRoles,
  selectStandings,
  selectUsers,
} from "@/store/selectors";
import { addMember, removeMember, updateMember } from "@/store/thunks";
import { peopleCount } from "@/utils/count";
import type { MemberForm as MemberValues } from "@/utils/schemas";
import type { OrgRole, User } from "@/utils/types";

const pillFor = (user: User, role?: OrgRole): Pill => {
  if (user.isPrimaryAdmin) return { label: "Primary admin", dot: "bg-zinc-900" };
  if (!role) return { label: "No role" };
  if (role.id === adminRoleId) return { label: role.name, dot: "bg-zinc-900" };
  return { label: role.name, dot: role.permissions.length > 0 ? "bg-amber-500" : undefined };
};

const MembersPage = () => {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const currentUser = useAppSelector(selectCurrentUser);
  const users = useAppSelector(selectUsers);
  const roles = useAppSelector(selectRoles);
  const orgName = useAppSelector(selectOrgName);
  const standings = useAppSelector(selectStandings);
  const departmentNames = useAppSelector(selectDepartmentNames);
  const pointsOf = (userId: string) =>
    standings.find((standing) => standing.user.id === userId)?.points ?? 0;
  const [editing, setEditing] = useState<User | "new" | null>(null);

  const handleSave = async (values: MemberValues) => {
    if (editing === "new") await dispatch(addMember(values)).unwrap();
    else if (editing) await dispatch(updateMember({ ...editing, ...values })).unwrap();
    setEditing(null);
  };

  const canRemove = (user: User) => !user.isPrimaryAdmin && user.id !== currentUser?.id;

  const handleRemove = async (user: User) => {
    const isConfirmed = await confirm({
      title: `Remove ${user.name}?`,
      message: "Their attendance records and roster slots will be deleted too.",
      confirmLabel: "Remove",
      isDanger: true,
    });
    if (!isConfirmed) return;
    await dispatch(removeMember(user.id)).unwrap();
    setEditing(null);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Members"
        subtitle={`${peopleCount(users.length)} in ${orgName}`}
        action={
          <Button onClick={() => setEditing("new")}>
            <Plus className="size-4" /> Add member
          </Button>
        }
      />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {users.map((user) => (
          <PersonCard
            key={user.id}
            name={user.name}
            photo={user.photo}
            subtitle={`${departmentNames(user.departments, user.units) || "No department"} · ${user.hasPasskey ? "Passkey" : "No passkey"}`}
            pill={pillFor(
              user,
              roles.find((role) => role.id === user.role),
            )}
            tag={`${pointsOf(user.id)} pts`}
            onClick={() => setEditing(user)}
          />
        ))}
      </div>
      <Sheet
        open={editing !== null}
        title={editing === "new" ? "Add member" : "Edit member"}
        onClose={() => setEditing(null)}
      >
        {editing === "new" && <MemberForm key="new" onSave={handleSave} />}
        {editing !== null && editing !== "new" && (
          <MemberForm
            key={editing.id}
            initial={editing}
            onSave={handleSave}
            isRoleLocked={editing.isPrimaryAdmin}
            onRemove={canRemove(editing) ? () => handleRemove(editing) : undefined}
          />
        )}
      </Sheet>
    </div>
  );
};

export default MembersPage;

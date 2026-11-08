"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import RoleCard from "@/components/admin/RoleCard";
import RoleForm from "@/components/admin/RoleForm";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import { useConfirm } from "@/components/ui/ConfirmProvider";
import FormError from "@/components/ui/FormError";
import Sheet from "@/components/ui/Sheet";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectRoles, selectUsers } from "@/store/selectors";
import { removeRole, saveRole } from "@/store/thunks";
import { errorMessage } from "@/utils/error";
import type { RoleForm as RoleValues } from "@/utils/schemas";
import type { OrgRole } from "@/utils/types";

type Editing = { role?: OrgRole } | null;

const RolesPage = () => {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const roles = useAppSelector(selectRoles);
  const users = useAppSelector(selectUsers);
  const [editing, setEditing] = useState<Editing>(null);
  const [error, setError] = useState("");

  const handleSave = async (values: RoleValues) => {
    await dispatch(saveRole({ id: editing?.role?.id, values })).unwrap();
    setEditing(null);
  };

  const handleRemove = async (role: OrgRole) => {
    const isConfirmed = await confirm({
      title: `Delete the ${role.name} role?`,
      confirmLabel: "Delete",
      isDanger: true,
    });
    if (!isConfirmed) return;
    try {
      await dispatch(removeRole(role.id)).unwrap();
      setError("");
    } catch (failure) {
      setError(errorMessage(failure));
    }
  };

  return (
    <>
      <PageHeader
        title="Roles"
        subtitle="Decide what each role can see and do. Assign roles from Members."
        action={
          <Button startIcon={<Plus className="size-4" />} onClick={() => setEditing({})}>
            New role
          </Button>
        }
      />
      <div className="mb-4 empty:hidden">
        <FormError message={error} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            people={users.filter((user) => user.role === role.id).length}
            onEdit={() => setEditing({ role })}
            onRemove={() => handleRemove(role)}
          />
        ))}
      </div>
      <Sheet
        open={!!editing}
        title={editing?.role ? "Edit role" : "New role"}
        onClose={() => setEditing(null)}
      >
        {editing && (
          <RoleForm
            initial={
              editing.role && {
                name: editing.role.name,
                permissions: editing.role.permissions,
              }
            }
            onSave={handleSave}
          />
        )}
      </Sheet>
    </>
  );
};

export default RolesPage;

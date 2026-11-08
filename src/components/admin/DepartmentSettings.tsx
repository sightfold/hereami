"use client";

import { useState } from "react";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Pencil, Plus, Trash2 } from "lucide-react";
import DepartmentForm from "@/components/admin/DepartmentForm";
import Button from "@/components/ui/Button";
import { useConfirm } from "@/components/ui/ConfirmProvider";
import { useRunAction } from "@/components/ui/ErrorNotice";
import Sheet from "@/components/ui/Sheet";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectDepartments, selectUsers } from "@/store/selectors";
import { addDepartment, removeDepartment, updateDepartment } from "@/store/thunks";
import type { Department } from "@/utils/types";

const DepartmentSettings = () => {
  const dispatch = useAppDispatch();
  const run = useRunAction();
  const confirm = useConfirm();
  const departments = useAppSelector(selectDepartments);
  const users = useAppSelector(selectUsers);
  const [editing, setEditing] = useState<Department | "new" | null>(null);

  const memberCount = (id: string) => users.filter((user) => user.departments.includes(id)).length;
  const editingId = editing === "new" ? null : editing?.id;
  const takenNames = departments
    .filter((item) => item.id !== editingId)
    .map((item) => item.name.toLowerCase());

  const handleSave = async (input: Omit<Department, "id">) => {
    if (!editing) return;
    const pending =
      editing === "new"
        ? dispatch(addDepartment(input))
        : dispatch(updateDepartment({ ...editing, ...input }));
    if (await run(pending)) setEditing(null);
  };

  const handleDelete = async (department: Department) => {
    const count = memberCount(department.id);
    const isConfirmed = await confirm({
      title: `Delete ${department.name}?`,
      message: `${count} member${count === 1 ? "" : "s"} will be removed from it and its roster slots will be cleared.`,
      confirmLabel: "Delete",
      isDanger: true,
    });
    if (isConfirmed) run(dispatch(removeDepartment(department.id)));
  };

  return (
    <>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="text-sm">
          <p className="font-medium">Departments</p>
          <p className="text-muted">Add, rename or remove departments and their roster roles.</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setEditing("new")}>
          <Plus className="size-4" /> Add
        </Button>
      </div>
      {departments.length === 0 ? (
        <p className="rounded-lg bg-subtle px-3 py-4 text-center text-sm text-muted">
          No departments yet. Add one to start building rosters.
        </p>
      ) : (
        <ul className="divide-y divide-line rounded-xl border border-line">
          {departments.map((department) => (
            <li key={department.id} className="flex items-start gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {department.name}
                  <span className="ml-2 font-mono text-xs font-normal text-muted">
                    {memberCount(department.id)} members
                  </span>
                </p>
                {department.roles.length > 0 ? (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {department.roles.map((role) => (
                      <Chip key={role} label={role} size="small" className="h-5 text-[11px]" />
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-xs text-muted">No roles · everyone serves together</p>
                )}
              </div>
              <Tooltip title="Edit" arrow>
                <IconButton
                  size="small"
                  aria-label={`Edit ${department.name}`}
                  onClick={() => setEditing(department)}
                >
                  <Pencil className="size-4" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete" arrow>
                <IconButton
                  size="small"
                  aria-label={`Delete ${department.name}`}
                  onClick={() => handleDelete(department)}
                  className="text-bad"
                >
                  <Trash2 className="size-4" />
                </IconButton>
              </Tooltip>
            </li>
          ))}
        </ul>
      )}
      <Sheet
        open={editing !== null}
        title={editing === "new" ? "Add department" : "Edit department"}
        onClose={() => setEditing(null)}
      >
        {editing !== null && (
          <DepartmentForm
            key={editing === "new" ? "new" : editing.id}
            initial={editing === "new" ? undefined : editing}
            takenNames={takenNames}
            onSave={handleSave}
          />
        )}
      </Sheet>
    </>
  );
};

export default DepartmentSettings;

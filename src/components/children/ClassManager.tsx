"use client";

import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Pencil, Plus, Trash2 } from "lucide-react";
import ClassForm from "@/components/children/ClassForm";
import Button from "@/components/ui/Button";
import { useConfirm } from "@/components/ui/ConfirmProvider";
import FormError from "@/components/ui/FormError";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectChildClasses, selectChildren } from "@/store/selectors";
import { removeChildClass, saveChildClass } from "@/store/thunks";
import { ageRange, classLabel } from "@/utils/children";
import { errorMessage } from "@/utils/error";
import type { ChildClassForm } from "@/utils/schemas";
import type { ChildClass } from "@/utils/types";

const ClassManager = () => {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const classes = useAppSelector(selectChildClasses);
  const children = useAppSelector(selectChildren);
  const [editing, setEditing] = useState<ChildClass | "new" | null>(null);
  const [error, setError] = useState("");

  const countOf = (id: string) => children.filter((child) => child.classId === id).length;

  const handleSave = async (values: ChildClassForm) => {
    const id = editing === "new" ? undefined : editing?.id;
    await dispatch(saveChildClass({ ...values, id })).unwrap();
    setEditing(null);
  };

  const handleDelete = async (item: ChildClass) => {
    const isConfirmed = await confirm({
      title: `Delete ${item.name}?`,
      confirmLabel: "Delete",
      isDanger: true,
    });
    if (!isConfirmed) return;
    setError("");
    try {
      await dispatch(removeChildClass(item.id)).unwrap();
    } catch (failure) {
      setError(errorMessage(failure));
    }
  };

  if (editing !== null)
    return (
      <ClassForm
        initial={editing === "new" ? undefined : editing}
        onSave={handleSave}
        onCancel={() => setEditing(null)}
      />
    );

  return (
    <div className="flex flex-col gap-3">
      <ul className="divide-y divide-line rounded-xl border border-line">
        {classes.map((item) => (
          <li key={item.id} className="flex items-center gap-2 px-3 py-2.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{classLabel(item)}</p>
              <p className="text-xs text-muted">
                {ageRange(item)} · {countOf(item.id)} children
              </p>
            </div>
            <Tooltip title="Edit" arrow>
              <IconButton
                size="small"
                aria-label={`Edit ${item.name}`}
                onClick={() => setEditing(item)}
              >
                <Pencil className="size-4" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <IconButton
                size="small"
                aria-label={`Delete ${item.name}`}
                onClick={() => handleDelete(item)}
                className="text-bad"
              >
                <Trash2 className="size-4" />
              </IconButton>
            </Tooltip>
          </li>
        ))}
      </ul>
      <FormError message={error} />
      <Button variant="outline" onClick={() => setEditing("new")}>
        <Plus className="size-4" /> Add class
      </Button>
    </div>
  );
};

export default ClassManager;

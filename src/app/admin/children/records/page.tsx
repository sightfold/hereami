"use client";

import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { ArrowRightLeft, Layers, Plus, Search, Sprout } from "lucide-react";
import ChildForm from "@/components/children/ChildForm";
import ChildProfile from "@/components/children/ChildProfile";
import ClassManager from "@/components/children/ClassManager";
import ClassSelect, { allClasses } from "@/components/children/ClassSelect";
import MoveBar from "@/components/children/MoveBar";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Empty from "@/components/ui/Empty";
import { useRunAction } from "@/components/ui/ErrorNotice";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Sheet from "@/components/ui/Sheet";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectChildClasses, selectChildren, selectPermissions } from "@/store/selectors";
import { addChild, moveChildren, setChildArchived, updateChild } from "@/store/thunks";
import {
  childName,
  classLabel,
  matchesChild,
  sortChildren,
  toChildInput,
  toChildValues,
  type ChildSort,
} from "@/utils/children";
import type { ChildForm as ChildValues } from "@/utils/schemas";
import type { Child } from "@/utils/types";

const sortOptions = [
  { value: "serial", label: "S/N" },
  { value: "name", label: "Name" },
  { value: "age", label: "Age" },
];

type Panel =
  | { kind: "new" }
  | { kind: "classes" }
  | { kind: "view"; id: string }
  | { kind: "edit"; id: string };

const panelTitles: Record<Panel["kind"], string> = {
  new: "Add child",
  classes: "Classes",
  view: "Child record",
  edit: "Edit child",
};

const ChildrenRecordsPage = () => {
  const dispatch = useAppDispatch();
  const run = useRunAction();
  const children = useAppSelector(selectChildren);
  const classes = useAppSelector(selectChildClasses);
  const canManage = useAppSelector(selectPermissions).includes("children.manage");
  const [classId, setClassId] = useState(allClasses);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<ChildSort>("serial");
  const [showArchived, setShowArchived] = useState(false);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [moving, setMoving] = useState<string[] | null>(null);

  const shown = sortChildren(
    children.filter(
      (child) =>
        child.archived === showArchived &&
        (classId === allClasses || child.classId === classId) &&
        matchesChild(child, query),
    ),
    sort,
  );
  const open = panel?.kind === "view" || panel?.kind === "edit" ? panel : null;
  const openChild = children.find((child) => child.id === open?.id);
  const classOf = (child: Child) => classes.find((item) => item.id === child.classId);

  const toggleMoving = (id: string) =>
    setMoving((current) =>
      current?.includes(id) ? current.filter((item) => item !== id) : [...(current ?? []), id],
    );

  const handleSave = async (values: ChildValues) => {
    const input = toChildInput(values);
    if (openChild) await dispatch(updateChild({ ...openChild, ...input })).unwrap();
    else await dispatch(addChild(input)).unwrap();
    setPanel(null);
  };

  const handleArchive = async (child: Child) => {
    const pending = dispatch(setChildArchived({ id: child.id, archived: !child.archived }));
    if (await run(pending)) setPanel(null);
  };

  const handleMove = async (target: string) => {
    if (await run(dispatch(moveChildren({ ids: moving ?? [], classId: target })))) setMoving(null);
  };

  return (
    <>
      {canManage && (
        <div className="mb-4 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setPanel({ kind: "new" })}>
            <Plus className="size-4" /> Add child
          </Button>
          <Button size="sm" variant="outline" onClick={() => setPanel({ kind: "classes" })}>
            <Layers className="size-4" /> Classes
          </Button>
          <Button size="sm" variant="outline" onClick={() => setMoving([])}>
            <ArrowRightLeft className="size-4" /> Move to class
          </Button>
        </div>
      )}
      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ClassSelect value={classId} onChange={setClassId} />
        <Field label="Sort by">
          <Select
            value={sort}
            onChange={(value) => setSort(value as ChildSort)}
            options={sortOptions}
          />
        </Field>
        <Field label="Find a child">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name or S/N"
            startAdornment={<Search className="mr-2 size-4 text-muted" />}
          />
        </Field>
      </div>
      {canManage && (
        <FormControlLabel
          className="mb-3 ml-0"
          label={<span className="text-sm">Show archived</span>}
          control={
            <Switch
              size="small"
              checked={showArchived}
              onChange={(event) => setShowArchived(event.target.checked)}
            />
          }
        />
      )}
      {moving && (
        <MoveBar
          selected={moving.length}
          total={shown.length}
          onToggleAll={() =>
            setMoving(moving.length === shown.length ? [] : shown.map((child) => child.id))
          }
          onMove={handleMove}
          onCancel={() => setMoving(null)}
        />
      )}
      {shown.length === 0 ? (
        <Empty icon={Sprout} text="No children found." />
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line bg-card">
          {shown.map((child) => (
            <li key={child.id} className="flex items-center gap-1 pr-2 pl-1">
              {moving && (
                <Checkbox
                  size="small"
                  checked={moving.includes(child.id)}
                  onChange={() => toggleMoving(child.id)}
                  slotProps={{ input: { "aria-label": `Select ${childName(child)}` } }}
                />
              )}
              <button
                type="button"
                onClick={() => setPanel({ kind: "view", id: child.id })}
                className="flex min-w-0 flex-1 items-center gap-3 px-2 py-2.5 text-left"
              >
                <Avatar name={childName(child)} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{childName(child)}</span>
                  <span className="block truncate text-xs text-muted">
                    S/N {child.serial} · {child.age} yrs · {child.parentName ?? "No parent on file"}
                  </span>
                </span>
                <Badge>{classLabel(classOf(child))}</Badge>
              </button>
            </li>
          ))}
        </ul>
      )}
      <Sheet
        open={panel !== null}
        title={panel ? panelTitles[panel.kind] : ""}
        onClose={() => setPanel(null)}
      >
        {panel?.kind === "new" && <ChildForm key="new" onSave={handleSave} />}
        {panel?.kind === "classes" && <ClassManager />}
        {panel?.kind === "view" && openChild && (
          <ChildProfile
            child={openChild}
            canManage={canManage}
            onEdit={() => setPanel({ kind: "edit", id: openChild.id })}
            onArchive={() => handleArchive(openChild)}
          />
        )}
        {panel?.kind === "edit" && openChild && (
          <ChildForm key={openChild.id} initial={toChildValues(openChild)} onSave={handleSave} />
        )}
      </Sheet>
    </>
  );
};

export default ChildrenRecordsPage;

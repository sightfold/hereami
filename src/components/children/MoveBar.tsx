"use client";

import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { useAppSelector } from "@/store";
import { selectChildClasses } from "@/store/selectors";
import { classLabel } from "@/utils/children";

type MoveBarProps = {
  selected: number;
  total: number;
  onToggleAll: () => void;
  onMove: (classId: string) => void;
  onCancel: () => void;
};

const MoveBar = ({ selected, total, onToggleAll, onMove, onCancel }: MoveBarProps) => {
  const classes = useAppSelector(selectChildClasses);
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-card p-3">
      <FormControlLabel
        className="m-0 mr-auto"
        label={`${selected} selected`}
        control={
          <Checkbox
            size="small"
            checked={total > 0 && selected === total}
            onChange={onToggleAll}
            slotProps={{ input: { "aria-label": "Select all" } }}
          />
        }
      />
      <div className="w-40">
        <Select
          value={classId}
          aria-label="Move to class"
          onChange={setClassId}
          options={classes.map((item) => ({ value: item.id, label: classLabel(item) }))}
        />
      </div>
      <Button size="sm" disabled={selected === 0 || !classId} onClick={() => onMove(classId)}>
        Move
      </Button>
      <Button size="sm" variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
};

export default MoveBar;

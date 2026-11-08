"use client";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import type { UseFormRegisterReturn } from "react-hook-form";
import type { Department } from "@/utils/types";

type UnitFieldsProps = {
  departments: Department[];
  initialUnits: string[];
  field: UseFormRegisterReturn<"units">;
};

const UnitFields = ({ departments, initialUnits, field }: UnitFieldsProps) => {
  const withUnits = departments.filter((department) => department.units.length > 0);
  if (withUnits.length === 0) return null;

  return (
    <fieldset className="flex flex-col gap-3 text-sm">
      <legend className="mb-1.5 font-medium">Units (optional)</legend>
      {withUnits.map((department) => (
        <div key={department.id}>
          <p className="mb-1 text-xs text-muted">{department.name}</p>
          <div className="grid grid-cols-2 gap-2">
            {department.units.map((unit) => (
              <FormControlLabel
                key={unit.id}
                label={unit.name}
                className="m-0 rounded-lg border border-line pr-3"
                control={
                  <Checkbox
                    size="small"
                    value={unit.id}
                    defaultChecked={initialUnits.includes(unit.id)}
                    slotProps={{ input: field }}
                  />
                }
              />
            ))}
          </div>
        </div>
      ))}
    </fieldset>
  );
};

export default UnitFields;

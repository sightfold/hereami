"use client";

import Field from "@/components/ui/Field";
import Select from "@/components/ui/Select";
import { useAppSelector } from "@/store";
import { selectChildClasses } from "@/store/selectors";
import { classLabel } from "@/utils/children";

export const allClasses = "all";

type ClassSelectProps = { value: string; onChange: (value: string) => void };

const ClassSelect = ({ value, onChange }: ClassSelectProps) => {
  const classes = useAppSelector(selectChildClasses);
  return (
    <Field label="Class">
      <Select
        value={value}
        onChange={onChange}
        options={[
          { value: allClasses, label: "All classes" },
          ...classes.map((item) => ({ value: item.id, label: classLabel(item) })),
        ]}
      />
    </Field>
  );
};

export default ClassSelect;

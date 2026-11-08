"use client";

import type { Ref } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import MuiSelect, { type SelectProps as MuiSelectProps } from "@mui/material/Select";
import { cn } from "@/utils/cn";

export type SelectOption = { value: string; label: string; group?: string };

type SelectProps = Omit<
  MuiSelectProps<string>,
  "children" | "input" | "value" | "onChange" | "ref"
> & {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  ref?: Ref<unknown>;
  "aria-label"?: string;
};

const menuProps = {
  anchorOrigin: { vertical: "bottom", horizontal: "left" },
  transformOrigin: { vertical: "top", horizontal: "left" },
  slotProps: {
    paper: { className: "mt-1 max-h-72 rounded-xl border border-line shadow-lg" },
  },
} as const;

const renderItems = (options: SelectOption[]) =>
  options.flatMap((option, index) => {
    const item = (
      <MenuItem key={`item-${option.value}`} value={option.value} className="text-sm">
        {option.label}
      </MenuItem>
    );
    const isNewGroup = option.group && option.group !== options[index - 1]?.group;
    if (!isNewGroup) return [item];
    return [
      <ListSubheader key={`group-${option.group}`} className="text-xs leading-8">
        {option.group}
      </ListSubheader>,
      item,
    ];
  });

const Select = ({
  ref,
  value,
  options,
  onChange,
  className,
  "aria-label": ariaLabel,
  ...props
}: SelectProps) => (
  <MuiSelect
    value={value}
    onChange={(event) => onChange(event.target.value)}
    input={<OutlinedInput size="small" />}
    inputRef={ref}
    inputProps={{ "aria-label": ariaLabel }}
    displayEmpty
    fullWidth
    MenuProps={menuProps}
    className={cn("bg-card text-sm", className)}
    {...props}
  >
    {renderItems(options)}
  </MuiSelect>
);

export default Select;

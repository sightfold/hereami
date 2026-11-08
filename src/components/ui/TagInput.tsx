"use client";

import { useState, type ClipboardEvent, type KeyboardEvent } from "react";
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";

type TagInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
};

const splitTags = (text: string) =>
  text
    .split(/[,\n]/)
    .map((tag) => tag.trim())
    .filter(Boolean);

const TagInput = ({ value, onChange, placeholder }: TagInputProps) => {
  const [draft, setDraft] = useState("");

  const addTags = (text: string) => {
    const taken = new Set(value.map((tag) => tag.toLowerCase()));
    const fresh = splitTags(text).filter((tag) => {
      const key = tag.toLowerCase();
      if (taken.has(key)) return false;
      taken.add(key);
      return true;
    });
    if (fresh.length > 0) onChange([...value, ...fresh]);
    setDraft("");
  };

  const removeTag = (index: number) => onChange(value.filter((_, item) => item !== index));

  const handleChange = (text: string) => {
    if (text.includes(",")) addTags(text);
    else setDraft(text);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTags(draft);
    } else if (event.key === "Backspace" && !draft && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData("text");
    if (!/[,\n]/.test(text)) return;
    event.preventDefault();
    addTags(draft + text);
  };

  return (
    <OutlinedInput
      size="small"
      fullWidth
      value={draft}
      onChange={(event) => handleChange(event.target.value)}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onBlur={() => addTags(draft)}
      placeholder={value.length === 0 ? placeholder : "Add another"}
      className="flex-wrap gap-1.5 bg-card py-1.5"
      slotProps={{ input: { className: "min-w-28 flex-1 py-1" } }}
      startAdornment={value.map((tag, index) => (
        <Chip key={tag} label={tag} size="small" onDelete={() => removeTag(index)} />
      ))}
    />
  );
};

export default TagInput;

"use client";

import { useState, type ChangeEvent } from "react";
import Button from "@/components/ui/Button";
import OrgMark from "@/components/layout/OrgMark";

const maxBytes = 200 * 1024;
const accepted = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

const readAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("That file could not be read"));
    reader.readAsDataURL(file);
  });

type LogoFieldProps = {
  name: string;
  value?: string;
  color?: string;
  onChange: (value?: string) => void;
};

const LogoField = ({ name, value, color, onChange }: LogoFieldProps) => {
  const [error, setError] = useState("");

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!accepted.includes(file.type)) {
      setError("Use a PNG, JPEG, WebP or SVG file");
      return;
    }
    if (file.size > maxBytes) {
      setError("Use a file under 200 KB");
      return;
    }
    try {
      onChange(await readAsDataUrl(file));
      setError("");
    } catch {
      setError("That file could not be read");
    }
  };

  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium">Logo</span>
      <div className="flex items-center gap-3">
        <OrgMark name={name || "?"} logo={value} color={color} className="size-12 text-lg" />
        <Button component="label" variant="outline" size="sm">
          {value ? "Replace" : "Upload"}
          <input type="file" hidden accept={accepted.join(",")} onChange={handleFile} />
        </Button>
        {value && (
          <Button variant="ghost" size="sm" onClick={() => onChange(undefined)}>
            Remove
          </Button>
        )}
      </div>
      <span className="text-xs text-muted">PNG, JPEG, WebP or SVG, up to 200 KB.</span>
      {error && <span className="text-xs text-bad">{error}</span>}
    </div>
  );
};

export default LogoField;

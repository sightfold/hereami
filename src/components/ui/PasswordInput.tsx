"use client";

import { useState, type ComponentProps } from "react";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { Eye, EyeOff } from "lucide-react";
import Input from "@/components/ui/Input";

type PasswordInputProps = Omit<ComponentProps<typeof Input>, "type" | "endAdornment">;

const PasswordInput = (props: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = isVisible ? EyeOff : Eye;

  return (
    <Input
      {...props}
      type={isVisible ? "text" : "password"}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            size="small"
            edge="end"
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            onClick={() => setIsVisible(!isVisible)}
          >
            <Icon className="size-4" />
          </IconButton>
        </InputAdornment>
      }
    />
  );
};

export default PasswordInput;

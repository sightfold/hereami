import { Check, X } from "lucide-react";
import { passwordRules } from "@/constants/password";

const PasswordRules = ({ value }: { value: string }) => (
  <ul aria-label="Password requirements" className="flex flex-col gap-1 text-xs">
    {passwordRules.map(({ label, pattern }) => {
      const isMet = pattern.test(value);
      const Icon = isMet ? Check : X;
      return (
        <li key={label} className={`flex items-center gap-1.5 ${isMet ? "text-ok" : "text-muted"}`}>
          <Icon className="size-3.5" aria-hidden />
          {label}
          <span className="sr-only">{isMet ? "(done)" : "(missing)"}</span>
        </li>
      );
    })}
  </ul>
);

export default PasswordRules;

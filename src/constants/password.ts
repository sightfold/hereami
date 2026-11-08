export const passwordRules = [
  { label: "At least 8 characters", pattern: /.{8,}/ },
  { label: "An uppercase letter", pattern: /[A-Z]/ },
  { label: "A lowercase letter", pattern: /[a-z]/ },
  { label: "A number", pattern: /\d/ },
  { label: "A symbol, like ! or #", pattern: /[^A-Za-z0-9]/ },
];

import { MailCheck } from "lucide-react";
import Link from "next/link";
import routePath from "@/constants/route.json";

type Props = { email: string };

const CheckEmail = ({ email }: Props) => (
  <div className="flex flex-col items-center gap-3 text-center">
    <span className="grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
      <MailCheck className="size-6" />
    </span>
    <p className="text-sm text-muted">
      We sent a confirmation link to <span className="font-medium text-fg">{email}</span>. Open it,
      then sign in.
    </p>
    <Link href={routePath.Auth.Login} className="text-sm font-medium text-fg underline">
      Back to sign in
    </Link>
  </div>
);

export default CheckEmail;

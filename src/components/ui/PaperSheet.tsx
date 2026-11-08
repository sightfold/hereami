import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type PaperSheetProps = {
  title: string;
  meta?: ReactNode;
  className?: string;
  children: ReactNode;
};

const PaperSheet = ({ title, meta, className, children }: PaperSheetProps) => (
  <section
    className={cn("paper overflow-hidden rounded-md border border-line shadow-sm", className)}
  >
    <header className="flex items-baseline justify-between gap-3 border-b-2 border-rule-red px-4 pt-4 pb-1.5">
      <h2 className="font-serif text-xl">{title}</h2>
      {meta && <span className="font-serif text-base text-muted">{meta}</span>}
    </header>
    {children}
  </section>
);

export default PaperSheet;

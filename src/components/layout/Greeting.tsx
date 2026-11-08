import type { ReactNode } from "react";

const greetingFor = (hour: number) => {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

type GreetingProps = { name?: string; subtitle: string; action?: ReactNode };

const Greeting = ({ name, subtitle, action }: GreetingProps) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div>
      <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
        {greetingFor(new Date().getHours())}
        {name && (
          <>
            , <span className="font-serif font-normal">{name.split(" ")[0]}</span>
          </>
        )}
      </h1>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>
    </div>
    {action}
  </div>
);

export default Greeting;

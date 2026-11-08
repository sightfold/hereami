import Link from "next/link";
import Copyright from "@/components/layout/Copyright";
import Logo from "@/components/layout/Logo";
import PoweredBy from "@/components/layout/PoweredBy";
import Button from "@/components/ui/Button";
import routePath from "@/constants/route.json";

const ClosingCta = () => (
  <>
    <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
      <h2 className="mx-auto max-w-2xl font-serif text-4xl tracking-tight sm:text-6xl">
        Close the book on <span className="text-ember">the table.</span>
      </h2>
      <p className="mx-auto mt-4 max-w-md text-muted">
        Register your church and have workers checking in by next Sunday.
      </p>
      <Link href={routePath.Auth.Signup} className="mt-7 inline-block">
        <Button size="lg">Get started</Button>
      </Link>
    </section>
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-muted">
        <div className="flex flex-wrap items-center gap-3">
          <Logo platform />
          <Copyright />
        </div>
        <PoweredBy />
      </div>
    </footer>
  </>
);

export default ClosingCta;

import Link from "next/link";
import PaperVsLive from "@/components/landing/PaperVsLive";
import Button from "@/components/ui/Button";
import routePath from "@/constants/route.json";

const Hero = () => (
  <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:py-20 lg:grid-cols-2">
    <div>
      <h1 className="font-serif text-5xl leading-[1.05] tracking-tight sm:text-7xl">
        Your church <span className="text-ember">register</span>,{" "}
        <span className="text-ember">on</span> every <span className="text-ember">phone</span>.
      </h1>
      <p className="mt-5 max-w-md text-base text-muted sm:text-lg">
        Workers check in as they arrive. Leaders see who&apos;s present, late or missing, live.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link href={routePath.Auth.Signup}>
          <Button size="lg">Register your church</Button>
        </Link>
        <Link href={routePath.Auth.Login}>
          <Button size="lg" variant="outline">
            Sign in
          </Button>
        </Link>
      </div>
      <p className="mt-5 text-sm text-muted">
        Works on any smartphone. Nothing to download from an app store.
      </p>
    </div>
    <PaperVsLive />
  </section>
);

export default Hero;

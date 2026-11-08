import {
  CalendarRange,
  KeyRound,
  MapPin,
  QrCode,
  Sprout,
  Trophy,
  type LucideIcon,
} from "lucide-react";

const features: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: MapPin,
    title: "Location check",
    text: "Check-in only works within the radius you set around your church building.",
  },
  {
    icon: QrCode,
    title: "Check-in code",
    text: "A QR code on the church screen that changes every 30 seconds, for halls where GPS is weak.",
  },
  {
    icon: CalendarRange,
    title: "Duty rosters",
    text: "Assign posts for each service, catch double bookings and share the roster on WhatsApp as an image or PDF.",
  },
  {
    icon: Sprout,
    title: "Children's register",
    text: "Teachers mark each child present by class, with parents' contacts and monthly reports.",
  },
  {
    icon: Trophy,
    title: "Recognition",
    text: "Points and streaks for faithful, early service, if your workers enjoy a little encouragement.",
  },
  {
    icon: KeyRound,
    title: "Roles and access",
    text: "Pastors, heads of department and admins each see exactly what they need.",
  },
];

const Features = () => (
  <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
    <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">What&apos;s included</h2>
    <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {features.map(({ icon: Icon, title, text }) => (
        <div key={title}>
          <span className="flex size-9 items-center justify-center rounded-lg bg-subtle">
            <Icon className="size-4" />
          </span>
          <h3 className="mt-3 font-medium">{title}</h3>
          <p className="mt-1 text-sm text-muted">{text}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Features;

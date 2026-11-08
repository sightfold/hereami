const steps = [
  {
    title: "Set up your church",
    text: "Pin your building on the map, add departments like choir, ushers and media, and invite your workers.",
  },
  {
    title: "Workers check in on arrival",
    text: "They confirm with fingerprint or face. The app checks they are at church; indoors, they scan the code on the church screen.",
  },
  {
    title: "Leaders see gaps at call time",
    text: "Every check-in updates the count, so heads of department know who is missing before the first song.",
  },
  {
    title: "Follow up with care",
    text: "See who has been away for weeks and reach out. A dead phone? A lead checks them in, with the reason on record.",
  },
];

const HowItWorks = () => (
  <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
    <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">How it works</h2>
    <ol className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
      {steps.map(({ title, text }, index) => (
        <li key={title}>
          <span className="font-serif text-4xl text-muted">{index + 1}</span>
          <h3 className="mt-2 font-medium">{title}</h3>
          <p className="mt-1 text-sm text-muted">{text}</p>
        </li>
      ))}
    </ol>
  </section>
);

export default HowItWorks;

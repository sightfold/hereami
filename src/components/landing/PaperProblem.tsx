const problems = [
  {
    title: "Gaps show up mid-service",
    text: "An empty post is noticed when the camera isn't manned or the door isn't covered, not at call time when you could still fix it.",
  },
  {
    title: "Anyone can sign for anyone",
    text: "A name in the book doesn't prove who was really there, or when they arrived.",
  },
  {
    title: "Missing members go unnoticed",
    text: "A worker can miss four Sundays before anyone leafs back far enough to see it, and by then the follow-up call is late.",
  },
  {
    title: "Rosters get retyped every week",
    text: "Duty lists are rebuilt by hand and passed around on WhatsApp, and double bookings only show up on the day.",
  },
];

const PaperProblem = () => (
  <section className="border-y border-line bg-card">
    <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <h2 className="max-w-xl font-serif text-4xl tracking-tight sm:text-5xl">
        What the sign-in book costs you
      </h2>
      <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {problems.map(({ title, text }) => (
          <div key={title} className="border-t border-pine/40 pt-4">
            <h3 className="font-medium">{title}</h3>
            <p className="mt-1 text-sm text-muted">{text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PaperProblem;

const departments = [
  "Choir",
  "Ushering",
  "Media",
  "Protocol",
  "Sanctuary",
  "Children's church",
  "Prayer team",
  "Security",
  "Welfare",
];

const Departments = () => (
  <section className="mx-auto max-w-6xl px-4 pb-14 sm:pb-20">
    <p className="text-sm text-muted">
      One register for <span className="text-ember">every department</span> that serves
    </p>
    <ul className="mt-4 flex flex-wrap gap-2">
      {departments.map((name) => (
        <li key={name} className="rounded-full border border-line px-3.5 py-1.5 text-sm">
          {name}
        </li>
      ))}
    </ul>
  </section>
);

export default Departments;

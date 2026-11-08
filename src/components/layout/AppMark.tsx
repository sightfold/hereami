const AppMark = ({ className = "size-8" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" aria-hidden="true" className={`shrink-0 ${className}`}>
    <rect width="64" height="64" rx="14" fill="#161616" />
    <circle cx="34" cy="14" r="5.5" fill="#f5843c" />
    <g fill="none" stroke="#f4ede2" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M30 24 L28 40 L22 54" />
      <path d="M28 40 L36 54" />
      <path d="M30 26 L42 8" />
      <path d="M30 28 L20 38" />
    </g>
  </svg>
);

export default AppMark;

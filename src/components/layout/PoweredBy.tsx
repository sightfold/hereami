import Image from "next/image";

const PoweredBy = () => (
  <a
    href="https://sightfold.com"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 text-[11px] text-muted hover:text-fg"
  >
    Powered by
    <Image src="/sightfold-mark.svg" alt="" width={16} height={16} />
    <span className="font-medium">Sightfold</span>
  </a>
);

export default PoweredBy;
